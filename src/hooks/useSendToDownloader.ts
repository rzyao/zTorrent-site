import { useState } from 'react';
import { DownloadsService } from '@/api/services/DownloadsService';
import { DownloadersService } from '@/api/services/DownloadersService';
import { customToast } from '@/hooks/useToast';

interface SendToDownloaderParams {
  torrentId: string;
  source?: {
    filmId?: string;
    playListId?: string;
  };
  downloaderId: string;
  path?: string;
}

export function useSendToDownloader() {
  const [sending, setSending] = useState(false);

  const sendToDownloader = async ({ torrentId, source, downloaderId, path }: SendToDownloaderParams) => {
    if (!torrentId || !downloaderId) return false;
    
    setSending(true);
    try {
      // 1. 获取一次性下载链接
      const resp = await DownloadsService.downloadsControllerCreateDownloadUrl({
        torrentId: String(torrentId),
        source: source || { filmId: "", playListId: "" },
      });
      const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      const data = body?.data ?? body;
      const downloadTokenUrl = String(data?.url ?? "");

      if (!downloadTokenUrl) {
        throw new Error("无法生成下载链接");
      }

      // 2. 发送到下载器
      await DownloadersService.downloadersControllerDownload({
        id: downloaderId,
        url: downloadTokenUrl,
        path: path,
      });

      customToast.success("已发送至下载器");
      return true;
    } catch (e: any) {
      const msg = e?.message || "发送失败";
      customToast.error(msg);
      return false;
    } finally {
      setSending(false);
    }
  };

  return { sendToDownloader, sending };
}
