import type { Column } from "@/modules/admin/components/ui/data-table";
import type { StatisticRow } from "./types";

/**
 * 统计粒度选项
 */
export const GRANULARITY_OPTIONS = [
  { label: "按天", value: "day" },
  { label: "按周", value: "week" },
  { label: "按月", value: "month" },
];

/**
 * 统计表格列定义
 */
export const STATISTICS_COLUMNS: Column<StatisticRow>[] = [
  { title: "统计周期", dataIndex: "time", key: "time", width: 160 },
  { title: "总量", dataIndex: "total", key: "total", width: 100 },
  { title: "未使用", dataIndex: "unused", key: "unused", width: 100 },
  { title: "已接受", dataIndex: "accepted", key: "accepted", width: 100 },
  { title: "已过期", dataIndex: "expired", key: "expired", width: 100 },
  { title: "已撤销", dataIndex: "revoked", key: "revoked", width: 100 },
];
