// 仲裁中心数据查询 Hook：对接 OpenAPI 的 /requests/disputes/list 与 /detail
// 支持优先级筛选与选中案件详情加载

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RequestsService } from '@/api/services/RequestsService';
import { extractErrorMessage } from '@/utils/errorMessage';

import { unwrap } from '@/pages/Requests/utils/unwrap';

export type DisputePriority = 'all' | 'high' | 'medium' | 'low';

export interface DisputesFilters {
  priority?: DisputePriority;
  status?: 'all' | 'open' | 'resolved';
  page?: number;
  pageSize?: number;
}

export function useModerationQuery(filters: DisputesFilters) {
  const normalized = {
    priority: filters.priority && filters.priority !== 'all' ? filters.priority : undefined,
    status: filters.status && filters.status !== 'all' ? filters.status : undefined,
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 20,
  } as any;

  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['disputes-list', normalized],
    queryFn: async () => {
      try {
        const resp = await RequestsService.requestsDisputesControllerList(normalized);
        return unwrap<{ items: any[]; total: number }>(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '获取争议列表失败'));
      }
    },
  });

  const selectCase = async (id: string) => {
    const resp = await RequestsService.requestsDisputesControllerDetail({ id } as any);
    const data = unwrap<any>(resp);
    queryClient.setQueryData(['dispute-detail', id], data);
    return data;
  };

  const getSelectedCase = (id?: string) => {
    if (!id) return null;
    return (queryClient.getQueryData(['dispute-detail', id]) as any) ?? null;
  };

  return {
    items: (listQuery.data as any)?.items ?? [],
    total: (listQuery.data as any)?.total ?? 0,
    isLoading: listQuery.isLoading,
    error: listQuery.error as Error | null,
    selectCase,
    getSelectedCase,
    refetch: listQuery.refetch,
  };
}
