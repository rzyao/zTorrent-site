import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ForumsReportsService } from "@/api";
import { ForumReport } from "@/api/models/ForumReport";

export function useReportData() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<"pending" | "resolved" | "rejected" | undefined>("pending");

  // Fetch Stats
  const { data: statsData } = useQuery({
    queryKey: ["reports", "stats"],
    queryFn: () => ForumsReportsService.reportsControllerGetStats(),
  });

  // Fetch List
  const {
    data: listData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reports", "list", page, limit, status],
    queryFn: () =>
      ForumsReportsService.reportsControllerFindAll({
        page,
        limit,
        status: status as any,
      }),
  });

  return {
    page,
    setPage,
    limit,
    setLimit,
    status,
    setStatus,
    stats: statsData?.data as
      | { pending: number; resolved: number; rejected: number; total: number }
      | undefined,
    items: (listData?.data?.items || []) as ForumReport[],
    total: listData?.data?.total || 0,
    isLoading,
    refetch,
  };
}
