import { useQuery } from '@tanstack/react-query';
import { TorrentsService } from '@/api/services/TorrentsService';
import { UserListTorrentsDto } from '@/api/models/UserListTorrentsDto';
import { UserTorrentItemDto } from '@/api/models/UserTorrentItemDto';

interface UseHomeDataParams {
  category?: string; // slug/key from url
}

export function useHomeData({ category }: UseHomeDataParams) {
  // 处理 'home' slug 为空，以便 API 理解（如果 API 仅接受特定 key）
  // 通常 'home' 或 undefined 传给后端意味着“全部”
  const apiCategory = category === 'home' ? undefined : category;

  // Banner 数据：取做种最多的 1 条 (模拟热门置顶)
  const featuredQuery = useQuery({
    queryKey: ['torrents', 'featured', apiCategory],
    queryFn: async () => {
      const res = await TorrentsService.torrentsControllerListTorrentsForUser({
        category: apiCategory,
        limit: 1,
        orderBy: UserListTorrentsDto.orderBy.SEEDERS, // 暂用种子数最多作为 Banner
        order: UserListTorrentsDto.order.DESC,
      });
      return res.data?.items?.[0] || null;
    },
  });

  // 热门列表：取下载最多的 10 条
  const hotQuery = useQuery({
    queryKey: ['torrents', 'hot', apiCategory],
    queryFn: async () => {
      const res = await TorrentsService.torrentsControllerListTorrentsForUser({
        category: apiCategory,
        limit: 10,
        orderBy: UserListTorrentsDto.orderBy.DOWNLOADS, // 或 DOWNLOADING_COUNT
        order: UserListTorrentsDto.order.DESC,
      });
      return res.data?.items || [];
    },
  });

  // 最新列表：取最新发布的 10 条
  const latestQuery = useQuery({
    queryKey: ['torrents', 'latest', apiCategory],
    queryFn: async () => {
      const res = await TorrentsService.torrentsControllerListTorrentsForUser({
        category: apiCategory,
        limit: 10,
        orderBy: UserListTorrentsDto.orderBy.UPLOADED_AT,
        order: UserListTorrentsDto.order.DESC,
      });
      return res.data?.items || [];
    },
  });

  // 免费列表：无法直接筛选，取做种最多的前 50 条然后在前端筛选 isFree
  const freeQuery = useQuery({
    queryKey: ['torrents', 'free', apiCategory],
    queryFn: async () => {
      const res = await TorrentsService.torrentsControllerListTorrentsForUser({
        category: apiCategory,
        limit: 50,
        orderBy: UserListTorrentsDto.orderBy.SEEDERS,
        order: UserListTorrentsDto.order.DESC,
      });
      const items = res.data?.items || [];
      // @ts-ignore: UserTorrentItemDto 定义中可能暂时缺少 isFree，但运行时可能有
      return items.filter((item: any) => item.isFree).slice(0, 10);
    },
  });

  // VIP 列表 (同理，前端过滤)
  const vipQuery = useQuery({
    queryKey: ['torrents', 'vip', apiCategory],
    queryFn: async () => {
      const res = await TorrentsService.torrentsControllerListTorrentsForUser({
        category: apiCategory,
        limit: 50,
        orderBy: UserListTorrentsDto.orderBy.SEEDERS,
        order: UserListTorrentsDto.order.DESC,
      });
      const items = res.data?.items || [];
      // @ts-ignore: 同上
      return items.filter((item: any) => item.isVip).slice(0, 10);
    },
  });

  return {
    featured: featuredQuery,
    hot: hotQuery,
    latest: latestQuery,
    free: freeQuery,
    vip: vipQuery,
    isLoading: featuredQuery.isLoading || hotQuery.isLoading || latestQuery.isLoading,
  };
}
