import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ForumsTopicsService } from "@/api/services/ForumsTopicsService";
import { AdminListTopicBountyCancelRequestsDto } from "@/api/models/AdminListTopicBountyCancelRequestsDto";
import { AdminReviewTopicBountyCancelRequestDto } from "@/api/models/AdminReviewTopicBountyCancelRequestDto";

export type BountyStatus = "pending" | "approved" | "rejected" | "all";

export function useForumBountyCancel(params: {
  status?: BountyStatus;
  page?: number;
  limit?: number;
}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const cancelRequestStatus =
    params.status && params.status !== "all"
      ? (params.status as AdminListTopicBountyCancelRequestsDto.cancelRequestStatus)
      : undefined;

  const query = useQuery({
    queryKey: ["forum", "admin", "bounty-cancel", { page, limit, cancelRequestStatus }],
    queryFn: async () => {
      const body: AdminListTopicBountyCancelRequestsDto = { page, limit, cancelRequestStatus };
      const resp = await ForumsTopicsService.topicsControllerAdminListCancelRequests(body);
      const r: any = (resp as any)?.code !== undefined ? resp : ((resp as any)?.data ?? resp);
      const data: any = r?.data ?? r;
      const items = (data?.items ?? []).map((it: any, idx: number) => ({
        id: String(it?.id ?? it?.topicId ?? idx),
        topicId: it?.topicId,
        topic: it?.topic,
        amount: it?.amount,
        cancelRequestStatus: it?.cancelRequestStatus,
        cancelRequestReason: it?.cancelRequestReason,
      }));
      return {
        items,
        total: Number(data?.total ?? 0),
        page: Number(data?.page ?? page),
        limit: Number(data?.limit ?? limit),
      };
    },
    placeholderData: keepPreviousData,
  });

  const review = async (topicId: string, action: "approve" | "reject", note?: string) => {
    const payload: AdminReviewTopicBountyCancelRequestDto = {
      topicId,
      action:
        action === "approve"
          ? AdminReviewTopicBountyCancelRequestDto.action.APPROVE
          : AdminReviewTopicBountyCancelRequestDto.action.REJECT,
      note,
    };
    await ForumsTopicsService.topicsControllerAdminReviewCancelRequest(payload);
  };

  const load = (nextPage = 1) => {
    query.refetch({ throwOnError: false });
  };

  return {
    items: (query.data as any)?.items ?? [],
    total: (query.data as any)?.total ?? 0,
    page: (query.data as any)?.page ?? page,
    limit: (query.data as any)?.limit ?? limit,
    loading: query.isLoading,
    load,
    review,
  };
}
