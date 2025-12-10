// 求种大厅数据查询 Hook：负责与 OpenAPI 生成的 RequestsService 对接，提供分页与筛选能力
// 设计说明：
// - 封装服务端请求与响应解包，组件只关注 UI 与交互状态
// - 使用 React Query 管理缓存与状态，支持基于筛选条件的自动刷新
// - DTO 暂为空类型，按约定以 any 传递筛选参数；待后端丰富 OpenAPI 模型后替换为强类型

import { useQuery } from '@tanstack/react-query';
import { RequestsService } from '@/api/services/RequestsService';
import { extractErrorMessage } from '@/utils/errorMessage';

export type HallStatus = 'all' | 'active' | 'completed' | 'expired';
export type HallSortBy = 'latest' | 'bounty' | 'comments' | 'votes';

export interface HallFilters {
  keyword?: string;
  category?: string; // '全部' 或具体分类；传给后端时将 '全部' 归一为 undefined
  status?: HallStatus;
  sortBy?: HallSortBy;
  page?: number;
  pageSize?: number;
}

import { unwrap } from '@/pages/Requests/utils/unwrap';

export function useHallQuery(filters: HallFilters) {
  const normalized = {
    keyword: filters.keyword || undefined,
    category: filters.category && filters.category !== '全部' && filters.category !== 'all' ? filters.category : undefined,
    status: filters.status && filters.status !== 'all' ? filters.status : undefined,
    sortBy: filters.sortBy || 'latest',
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 20,
  } as any;

  const queryKey = ['requests-list', normalized];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const resp = await RequestsService.requestsControllerList(normalized);
        return unwrap<{ items: any[]; total: number }>(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '获取求种列表失败'));
      }
    },
  });

  return {
    items: (query.data as any)?.items ?? [],
    total: (query.data as any)?.total ?? 0,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
