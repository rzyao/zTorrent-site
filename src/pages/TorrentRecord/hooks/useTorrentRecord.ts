import { useQuery } from '@tanstack/react-query';
import { TorrentRecordService } from '@/api/services/TorrentRecordService';
import { TorrentStatus, Torrent, TorrentStats } from '../types';
import { transformTorrentData, transformStatsData } from '../utils';

interface UseTorrentRecordProps {
  /** 当前激活的标签页 */
  activeTab: TorrentStatus;
  /** 搜索关键词 */
  searchQuery: string;
}

/**
 * 种子记录数据获取 Hook
 * 负责根据当前标签页和搜索词获取种子列表数据，以及获取统计数据
 */
export function useTorrentRecord({ activeTab, searchQuery }: UseTorrentRecordProps) {
  // 获取种子列表数据
  const { data: result, isLoading, isFetching } = useQuery({
    queryKey: ['torrentHistory', activeTab, searchQuery],
    queryFn: async () => {
      let resp: any;
      switch (activeTab) {
        case 'uploaded':
          resp = await TorrentRecordService.torrentRecordControllerFindPublished(undefined, searchQuery, 50, 1);
          break;
        case 'seeding':
          resp = await TorrentRecordService.torrentRecordControllerFindSeeding(undefined, searchQuery, 50, 1);
          break;
        case 'downloading':
          resp = await TorrentRecordService.torrentRecordControllerFindDownloading(undefined, searchQuery, 50, 1);
          break;
        case 'completed':
          resp = await TorrentRecordService.torrentRecordControllerFindCompleted(undefined, searchQuery, 50, 1);
          break;
        case 'incomplete':
          resp = await TorrentRecordService.torrentRecordControllerFindIncomplete(undefined, searchQuery, 50, 1);
          break;
        default:
          resp = await TorrentRecordService.torrentRecordControllerFindSeeding(undefined, searchQuery, 50, 1);
          break;
      }
      const body = (resp as any)?.code !== undefined ? resp : (resp as any)?.data ?? (resp as any);
      const payload = body?.data ?? body;
      const items = (payload?.items ?? []).map((it: any) => transformTorrentData(it, activeTab));
      return { items };
    },
  });

  const { data: statsResult, isLoading: isLoadingStats, isFetching: isFetchingStats } = useQuery({
    queryKey: ['torrentRecordStats'],
    queryFn: async () => {
      const resp = await TorrentRecordService.torrentRecordControllerGetStats();
      const body = (resp as any)?.code !== undefined ? resp : (resp as any)?.data ?? (resp as any);
      const payload = body?.data ?? body;
      return transformStatsData(payload);
    },
  });

  const torrents: Torrent[] = (result?.items ?? []) as Torrent[];

  const stats: TorrentStats = statsResult ?? {
    uploaded: 0,
    seeding: 0,
    downloading: 0,
    completed: 0,
    incomplete: 0,
  };

  const isUpdating = (isFetching || isFetchingStats) && !(isLoading || isLoadingStats);

  return {
    torrents,
    stats,
    isLoading,
    isUpdating,
  };
}
