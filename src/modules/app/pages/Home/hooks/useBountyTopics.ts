// 首页“资源悬赏”数据 Hook：接入后端悬赏进行中话题列表
// 设计目标：
// - 仅获取第一页数据用于首页卡片展示，默认 limit=8、sort='latest'
// - 统一走 OpenAPI 生成的 ForumsTopicsService，使用 unwrap 解包，统一错误处理
// - 保持 app 模块内聚，避免直接依赖 forum 模块的实现细节
import { useQuery } from '@tanstack/react-query';
import { ForumsTopicsService } from '@/api/services/ForumsTopicsService';
import { ListBountyTopicsDto } from '@/api/models/ListBountyTopicsDto';
import { TopicPaginatedResponseDto } from '@/api/models/TopicPaginatedResponseDto';
import { extractErrorMessage } from '@/utils/errorMessage';
import { unwrap } from '@/modules/app/pages/Requests/utils/unwrap';

// 为了避免跨模块耦合，这里定义首页使用的最小 Topic 视图类型
// 如需更多字段，可按需扩展（与 forum 模块的 ExtendedApiTopic 保持一致性）
export type HomeBountyTopic = {
  id: string;
  title: string;
  // 后端保证仅返回“进行中”悬赏话题，bounty 信息存在即可用于展示金额/状态等
  bounty?: {
    id: string;
    amount: string;
    status: 'open' | 'awarded' | 'expired' | 'canceled';
    expiresAt?: string;
  };
  views?: number;
  replyCount?: number;
  updatedAt?: string;
};

export interface UseBountyTopicsParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  sort?: ListBountyTopicsDto['sort'];
}

// 抽取纯函数，便于测试：根据请求体获取映射后的分页结果
export async function fetchBountyTopics(
  requestBody: ListBountyTopicsDto,
): Promise<{ items: HomeBountyTopic[]; total: number; page: number; limit: number }> {
  const resp = await ForumsTopicsService.topicsControllerListBountyTopics(requestBody);
  const data = unwrap<TopicPaginatedResponseDto>(resp);
  const items: HomeBountyTopic[] = (data.items as any[]).map((t: any) => ({
    id: t.id,
    title: t.title,
    bounty: t.bounty,
    views: t.views,
    replyCount: t.replyCount,
    updatedAt: t.updatedAt ?? t.lastReplyAt,
  }));
  return { items, total: data.total, page: data.page, limit: data.limit };
}

export function useBountyTopics(params: UseBountyTopicsParams = {}) {
  const {
    page = 1,
    limit = 8,
    categoryId,
    search,
    sort = ListBountyTopicsDto.sort.LATEST,
  } = params;

  // 构建请求体，严格遵循后端 DTO；由后端统一判定“进行中”
  const requestBody: ListBountyTopicsDto = {
    page,
    limit,
    categoryId: categoryId || undefined,
    search: search || undefined,
    sort,
  };

  const queryKey = ['app', 'home', 'bounty-topics', requestBody];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await fetchBountyTopics(requestBody);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '获取悬赏进行中话题失败'));
      }
    },
    staleTime: 60_000, // 1 分钟缓存：首页不必秒级刷新
  });

  return {
    items: (query.data as any)?.items ?? [],
    total: (query.data as any)?.total ?? 0,
    page: (query.data as any)?.page ?? page,
    limit: (query.data as any)?.limit ?? limit,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
