import { formatSize } from '@/utils/format';
import { Torrent, TorrentStatus } from './types';

export function transformTorrentData(item: any, activeTab: TorrentStatus): Torrent {
  return {
    id: Number(item.id ?? 0),
    title: String(item.title ?? item.name ?? ''),
    subTitle: String(item.subTitle ?? ''),
    name: String(item.name ?? ''),
    category: String(item.category_name ?? item.category ?? ''),
    size: formatSize(Number(item.size_bytes ?? item.size ?? 0)),
    uploaded: formatSize(Number(item.upload_bytes ?? item.uploaded_bytes ?? item.uploaded ?? 0)),
    downloaded: formatSize(Number(item.download_bytes ?? item.downloaded_bytes ?? item.downloaded ?? 0)),
    ratio: typeof item.ratio === 'number' ? item.ratio : Number(item.share_ratio ?? 0),
    seeders: Number(item.seeders ?? item.seeders_count ?? 0),
    leechers: Number(item.leechers ?? item.leechers_count ?? 0),
    // 总下载次数：优先读取后端新增的次数字段，兼容多种命名
    totalDownloads: Number(
      item.downloads ??
      item.download_count ??
      item.totalDownloads ??
      0
    ),
    progress: Number(item.progress_percent ?? item.progress ?? 0),
    uploadDate: String(item.uploadedAt ?? item.upload_date ?? item.created_at ?? '').slice(0, 10),
    completeDate: item.complete_date
      ? String(item.complete_date).slice(0, 10)
      : item.completed_at
        ? String(item.completed_at).slice(0, 10)
        : undefined,
    status: String(item.status ?? activeTab) as TorrentStatus,
  };
}

export function transformStatsData(payload: any) {
  return {
    uploaded: Number(payload?.uploaded ?? payload?.published ?? 0),
    seeding: Number(payload?.seeding ?? 0),
    downloading: Number(payload?.downloading ?? 0),
    completed: Number(payload?.completed ?? 0),
    incomplete: Number(payload?.incomplete ?? 0),
  };
}
