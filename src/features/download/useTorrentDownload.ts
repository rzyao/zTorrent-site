import { useRef } from 'react';
import { TorrentsService, DownloadsService } from '@/api';
import { ApiError } from '@/api/core/ApiError';
import { parseFilenameFromContentDisposition, saveBlobAsFile } from '@/utils/http/saveBlobAsFile';

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

  const info = (m: string) => opts?.onInfo?.(m);
  const error = (m: string) => opts?.onError?.(m);

  /**
   * 根据种子 ID 生成一次性链接并下载保存。
   * @param torrentId 种子 ID
   * @param name 期望文件名（回退使用）
   */
  const downloadByTorrentId = async (torrentId: string, name?: string) => {
    const now = Date.now();
    const last = lastDownloadAtRef.current.get(torrentId) || 0;
    if (now - last < THROTTLE_MS) {
      info?.('操作过于频繁，请稍后再试');
      return;
    }
    lastDownloadAtRef.current.set(torrentId, now);

    try {
      const resp = await TorrentsService.torrentsControllerCreateDownloadUrl({ torrentId });
      const body = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      const data = body?.data ?? body;
      const url: string = String(data?.url ?? '');
      if (!url) throw new Error('下载链接生成失败');

      // 支持两种下载方式：
      // 1) 绝对 URL：直接 fetch → Blob
      // 2) token：调用 DownloadsService → Blob
      const tokenMatch = /\/download\/(?<token>[^/?#]+)/.exec(url);
      let blob: Blob;
      let contentDisposition: string | undefined;
      let contentType: string | undefined;
      if (tokenMatch?.groups?.token) {
        const token = tokenMatch.groups.token;
        blob = await DownloadsService.downloadsControllerDownload(token);
        // 通过原生 __request 无法得到 header，这里在保存时仅用回退文件名
      } else {
        const res = await fetch(url, { method: 'GET' });
        if (!res.ok) {
          const status = res.status;
          if (status === 401) throw Object.assign(new Error('未登录或令牌无效'), { status });
          if (status === 403) throw Object.assign(new Error('无权限或无下载权限'), { status });
          if (status === 404) throw Object.assign(new Error('链接无效、过期或已被消费'), { status });
          if (status === 429) throw Object.assign(new Error('触发限流，请稍后再试'), { status });
          throw Object.assign(new Error(`HTTP ${status}`), { status });
        }
        contentDisposition = res.headers.get('Content-Disposition') ?? res.headers.get('content-disposition') ?? undefined;
        contentType = res.headers.get('Content-Type') ?? res.headers.get('content-type') ?? undefined;
        blob = await res.blob();
      }

      const filenameFromHeader = parseFilenameFromContentDisposition(contentDisposition);
      const filename = filenameFromHeader || (name ? `${name}.torrent` : 'download.torrent');
      if (contentType && contentType !== 'application/x-bittorrent') {
        info?.('警告：响应类型非 application/x-bittorrent');
      }
      saveBlobAsFile(blob, filename);

      // 成功后记录下载（可选，不影响用户体验）
      try {
        await TorrentsService.torrentsControllerRecordDownload({ torrentId });
      } catch (_) {}
    } catch (e: any) {
      const status = (e as ApiError)?.status ?? e?.status;
      if (status === 401) return error?.('未登录或令牌无效');
      if (status === 403) return error?.('无权限或无下载权限');
      if (status === 404) return error?.('链接无效、过期或已被消费');
      if (status === 429) return error?.('触发限流，请稍后再试');
      return error?.(e?.message || '下载失败，请稍后重试');
    }
  };

  return { downloadByTorrentId };
}

