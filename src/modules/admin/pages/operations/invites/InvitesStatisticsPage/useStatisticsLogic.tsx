import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Service as InvitesService } from "@/api/services/Service";
import type { StatisticRow, StatisticsQuery } from "./types";

/**
 * 邀请统计页面逻辑 Hook
 */
export function useStatisticsLogic() {
  const [rows, setRows] = useState<StatisticRow[]>([]);

  // 筛选条件状态
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [granularity, setGranularity] = useState<string>("day");
  const [issuerId, setIssuerId] = useState("");

  // 统计请求 Mutation
  const statisticsMutation = useMutation({
    mutationFn: async (params: StatisticsQuery) => {
      return InvitesService.inviteStatsControllerStatistics(params as any);
    },
    onSuccess: (resp) => {
      const buckets = (resp as any)?.data?.buckets ?? [];
      setRows(Array.isArray(buckets) ? buckets : []);
      toast.success("统计完成");
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message || "加载统计失败");
    },
  });

  // 执行统计
  const fetchStat = useCallback(() => {
    const params: StatisticsQuery = {
      dateFrom: dateFrom ? new Date(dateFrom).toISOString() : undefined,
      dateTo: dateTo ? new Date(dateTo).toISOString() : undefined,
      granularity: (granularity as "day" | "week" | "month") || "day",
      issuerId: issuerId.trim() || undefined,
    };
    statisticsMutation.mutate(params);
  }, [dateFrom, dateTo, granularity, issuerId, statisticsMutation]);

  // 重置筛选条件
  const resetFilters = useCallback(() => {
    setDateFrom("");
    setDateTo("");
    setGranularity("day");
    setIssuerId("");
    setRows([]);
  }, []);

  return {
    rows,
    loading: statisticsMutation.isPending,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    granularity,
    setGranularity,
    issuerId,
    setIssuerId,
    fetchStat,
    resetFilters,
  };
}
