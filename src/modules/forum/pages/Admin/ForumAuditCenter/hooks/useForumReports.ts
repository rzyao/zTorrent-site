import { useQuery } from "@tanstack/react-query";
import { ForumsReportsService } from "@/api/services/ForumsReportsService";
import { QueryReportDto } from "@/api/models/QueryReportDto";
import { HandleReportDto } from "@/api/models/HandleReportDto";

export type ReportStatus = "pending" | "resolved" | "rejected" | "all";

export function useForumReports(params: { status?: ReportStatus; keyword?: string; page?: number; limit?: number }) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const status = params.status && params.status !== "all" ? params.status : undefined;

  const query = useQuery({
    queryKey: ["forum", "admin", "reports", { page, limit, status, keyword: params.keyword }],
    queryFn: async () => {
      const body: QueryReportDto = { page, limit, status: status as any };
      const resp = await ForumsReportsService.reportsControllerFindAll(body);
      const r: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data ?? resp;
      const data: any = r?.data ?? r;
      const items = (data?.items ?? []).map((it: any, idx: number) => ({
        id: String(it?.id ?? it?.reportId ?? `${it?.topicId ?? ""}-${it?.postId ?? ""}-${idx}`),
        topicId: it?.topicId ?? null,
        postId: it?.postId ?? null,
        reason: it?.reason,
        status: it?.status,
        handlerNote: it?.handlerNote ?? null,
      }));
      return { items, total: Number(data?.total ?? 0), page: Number(data?.page ?? page), limit: Number(data?.limit ?? limit) };
    },
    keepPreviousData: true,
  });

  const handle = async (
    reportId: string,
    action: "resolve" | "reject",
    options?: { deleteContent?: boolean; lockTopic?: boolean; note?: string },
  ) => {
    const payload: HandleReportDto = {
      reportId,
      status: action === "resolve" ? HandleReportDto.status.RESOLVED : HandleReportDto.status.REJECTED,
      handlerNote: options?.note,
      deleteContent: options?.deleteContent,
      lockTopic: options?.lockTopic,
    };
    await ForumsReportsService.reportsControllerHandle(payload);
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
    handle,
  };
}

