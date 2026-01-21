/**
 * 统计行数据
 */
export interface StatisticRow {
  time: string;
  total: number;
  unused: number;
  accepted: number;
  expired: number;
  revoked: number;
}

/**
 * 统计查询参数
 */
export interface StatisticsQuery {
  dateFrom?: string;
  dateTo?: string;
  granularity: "day" | "week" | "month";
  issuerId?: string;
}
