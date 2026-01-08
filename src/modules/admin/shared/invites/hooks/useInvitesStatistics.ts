import { useState } from "react";
import { App, Form } from "antd";
import type { StatisticRow } from "../types";
import { Service as InvitesService } from "@/api/services/Service";
import type { StatisticsDto } from "@/api/models/StatisticsDto";

export function useInvitesStatistics() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<StatisticRow[]>([]);

  const fetchStat = async () => {
    setLoading(true);
    try {
      const v = form.getFieldsValue();
      const req: StatisticsDto = {
        dateFrom: v.dateRange?.[0]?.toISOString?.() ?? "",
        dateTo: v.dateRange?.[1]?.toISOString?.() ?? "",
        granularity: v.granularity || "day",
        issuerId: v.issuerId || undefined,
      };
      const resp = await InvitesService.inviteStatsControllerStatistics(req);
      const buckets = (resp as any)?.data?.buckets ?? [];
      setRows(Array.isArray(buckets) ? buckets : []);
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "加载统计失败");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    rows,
    fetchStat,
    setRows,
  };
}
