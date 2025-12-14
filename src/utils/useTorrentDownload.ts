import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTorrentsService, getOpenAPI } from '@/api/lazy';
import { ApiError } from '@/api/core/ApiError';
import { parseFilenameFromContentDisposition, saveBlobAsFile } from '@/utils/http/saveBlobAsFile';
import { customToast } from '@/hooks/useToast';
import { useSourceTracker } from '@/hooks/useSourceTracker';

export type UseTorrentDownloadOptions = {
  onInfo?: (message: string) => void;
  onError?: (message: string) => void;
};

/**
 * 封装“生成一次性下载链接 → 执行下载 → 保存 .torrent 文件”的流程。
 * - 文档要求：POST /torrents/download-url（需鉴权与权限）→ GET /download/{token}（公开、原子消费）。
 * - 限流：前端做 5s 轻量节流，降低触发 429；真正限流由服务端负责。
 * - 错误语义：统一提示 401/403/404/429 等。
 */
export function useTorrentDownload(opts?: UseTorrentDownloadOptions) {
  const lastDownloadAtRef = useRef<Map<string, number>>(new Map());
  const THROTTLE_MS = 5000;
  const { sourcePayload } = useSourceTracker();
  const navigate = useNavigate();

  const info = useCallback((m: string) => (opts?.onInfo ? opts.onInfo(m) : customToast.info(m)), [opts]);
  const error = useCallback((m: string) => (opts?.onError ? opts.onError(m) : customToast.error(m)), [opts]);

  /**
   * 根据种子 ID 生成一次性链接并下载保存。
   * @param torrentId 种子 ID
   * @param name 期望文件名（回退使用）
   */
  const downloadByTorrentId = useCallback(async (
    torrentId: string,
    name?: string,
    sourceOverride?: { filmId: string; playListId: string }
  ) => {
    const now = Date.now();
    const last = lastDownloadAtRef.current.get(torrentId) || 0;
    if (now - last < THROTTLE_MS) {
      info?.('操作过于频繁，请稍后再试');
      return;
    }
    lastDownloadAtRef.current.set(torrentId, now);

    try {
      let url: string = '';
      try {
        const source = sourceOverride ?? sourcePayload ?? { filmId: '', playListId: '' };
        const TorrentsService = await getTorrentsService();
        const resp = await TorrentsService.torrentsControllerCreateDownloadUrl({ torrentId, source });
        const body = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
        const data = body?.data ?? body;
        url = String(data?.url ?? '');
        if (!url) throw new Error('下载链接生成失败');
      } catch (e: any) {
        const apiBody = (e as ApiError)?.body ?? undefined;
        const serverMessage = String(
          apiBody?.message ?? apiBody?.data?.message ?? apiBody?.msg ?? apiBody?.error ?? apiBody?.detail ?? apiBody?.description ?? ''
        ).trim();
        error(serverMessage || '下载错误');
        return;
      }

      const tokenMatch = /\/download\/(?<token>[^/?#]+)/.exec(url);
      let blob: Blob;
      let contentDisposition: string | undefined;
      let contentType: string | undefined;
      const OpenAPI = await getOpenAPI();
      const downloadUrl = tokenMatch?.groups?.token
        ? `${String((OpenAPI as any).BASE || '').replace(/\/$/, '')}/download/${tokenMatch.groups.token}`
        : url;

      const res = await fetch(downloadUrl, { method: 'GET' });
      if (!res.ok) {
        /**
         * 尝试读取后端返回的具体错误信息：优先 JSON 的 message 字段，回退 msg/error/detail/description，再回退纯文本。
         * 这样用户能看到“Token 已过期/已消费”等更明确的错误，而非通用语义。
         */
        let serverMessage: string | undefined;
        try {
          const json = await res.json();
          const body = (json?.code !== undefined) ? json : (json?.data ? json : { data: json });
          const data = body?.data ?? json;
          serverMessage = String(
            (body?.message ?? data?.message ?? json?.message ?? json?.msg ?? json?.error ?? json?.detail ?? json?.description ?? '')
          ).trim() || undefined;
        } catch {
          try {
            const text = await res.text();
            serverMessage = (text && text.length <= 2000) ? text : undefined;
          } catch { }
        }

        const status = res.status;
        const baseError = (() => {
          if (status === 401) return '未登录或令牌无效';
          if (status === 403) return '无权限或无下载权限';
          if (status === 404) return '链接无效、过期或已被消费';
          if (status === 429) return '触发限流，请稍后再试';
          return `HTTP ${status}`;
        })();

        const finalMessage = serverMessage || baseError;
        throw Object.assign(new Error(finalMessage), { status, serverMessage });
      }
      contentDisposition = res.headers.get('Content-Disposition') ?? res.headers.get('content-disposition') ?? undefined;
      contentType = res.headers.get('Content-Type') ?? res.headers.get('content-type') ?? undefined;
      blob = await res.blob();

      const filenameFromHeader = parseFilenameFromContentDisposition(contentDisposition);
      const filename = filenameFromHeader || (name ? `${name}.torrent` : 'download.torrent');
      if (contentType && contentType !== 'application/x-bittorrent') {
        info?.('警告：响应类型非 application/x-bittorrent');
      }
      // 提示策略调整：取消“开始下载”提示，仅在成功/失败时提示。
      // 成功的判定：已成功获取 .torrent Blob 并触发保存文件动作。
      saveBlobAsFile(blob, filename);
      customToast.success('下载成功');

      // 成功后记录下载（可选，不影响用户体验）
      try {
        const TorrentsService = await getTorrentsService();
        await TorrentsService.torrentsControllerRecordDownload({ torrentId });
      } catch (_) { }
    } catch (e: any) {
      const status = (e as ApiError)?.status ?? e?.status;
      const serverMessage = e?.serverMessage as string | undefined;
      if (serverMessage && serverMessage.trim()) {
        return error?.(serverMessage);
      }
      if (status === 401) return error?.('未登录或令牌无效');
      if (status === 403) return error?.('无权限或无下载权限');
      if (status === 404) return error?.('链接无效、过期或已被消费');
      if (status === 429) return error?.('触发限流，请稍后再试');
      return error?.(e?.message || '下载失败，请稍后重试');
    }
  }, [sourcePayload, info, error]);

  return { downloadByTorrentId };
}
