// 我的求种数据查询 Hook：对接 OpenAPI 的 /requests/my/list
// 说明：当前 SDK 方法 `requestsControllerMyList()` 无参数；按 UI 进行 client-side 分组过滤
// 返回统计信息供顶部卡片展示

import { useQuery } from '@tanstack/react-query';
import { RequestsService } from '@/api/services/RequestsService';
import { extractErrorMessage } from '@/utils/errorMessage';

import { unwrap } from '@/modules/app/pages/Requests/utils/unwrap';

export type MyRequestStatus = 'draft' | 'active' | 'completed' | 'cancelled' | 'expired';

export function useMyRequestsQuery() {
  const query = useQuery({
    queryKey: ['my-requests'],
    queryFn: async () => {
      try {
        const resp = await RequestsService.requestsControllerMyList({});
        return unwrap<{ items: any[]; total?: number }>(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '获取我的求种失败'));
      }
    },
  });

  const items = (query.data as any)?.items ?? [];
  const stats = {
    ongoingCount: items.filter((r: any) => ['draft', 'active'].includes(r?.status)).length,
    historyCount: items.filter((r: any) => ['completed', 'cancelled', 'expired'].includes(r?.status)).length,
    pendingSubmissionsCount: items.filter((r: any) => Number(r?.pendingSubmissions) > 0).length,
    totalSpent: items
      .filter((r: any) => r?.status === 'completed')
      .reduce((sum: number, r: any) => sum + Number(r?.bounty || 0) + Number(r?.additionalBounty || 0), 0),
  };

  return {
    items,
    stats,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
