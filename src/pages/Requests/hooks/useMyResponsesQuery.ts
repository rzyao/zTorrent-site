// 我的应答数据查询 Hook：对接 OpenAPI 的 /requests/my-responses/list
// 说明：当前 SDK 方法 `requestsControllerMyResponses()` 无参数；按 UI 进行 client-side 状态过滤

import { useQuery } from '@tanstack/react-query';
import { RequestsService } from '@/api/services/RequestsService';
import { extractErrorMessage } from '@/utils/errorMessage';

import { unwrap } from '@/pages/Requests/utils/unwrap';

export type ResponseStatus = 'claimed' | 'submitted' | 'approved' | 'rejected' | 'disputed';

export function useMyResponsesQuery() {
  const query = useQuery({
    queryKey: ['my-responses'],
    queryFn: async () => {
      try {
        const resp = await RequestsService.requestsControllerMyResponses({});
        return unwrap<{ items: any[]; total?: number }>(resp);
      } catch (err: any) {
        throw new Error(extractErrorMessage(err, '获取我的应答失败'));
      }
    },
  });

  return {
    items: (query.data as any)?.items ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
