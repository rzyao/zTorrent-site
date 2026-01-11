import { useMemo } from "react";
import { DatePicker } from "antd";
import { BarChart3, RefreshCw } from "lucide-react";
import { useStatisticsLogic } from "./useStatisticsLogic";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { StandardSelect } from "@/modules/admin/components/ui/select";
import { GRANULARITY_OPTIONS, STATISTICS_COLUMNS } from "./constants";
import type { StatisticRow } from "./types";

const { RangePicker } = DatePicker;

/** 行 Key 提取函数 */
const getRowKey = (record: StatisticRow) => record.time;

/**
 * 邀请统计页面
 * 已完成架构层重构：
 * - TanStack Query useMutation 管理请求状态
 * - Admin UI 组件
 * - 逻辑与视图分离
 * - 性能优化 (useMemo/useCallback)
 */
export default function InvitesStatisticsPage() {
  const {
    rows,
    loading,
    dateRange,
    setDateRange,
    granularity,
    setGranularity,
    issuerId,
    setIssuerId,
    fetchStat,
  } = useStatisticsLogic();

  // 工具栏（memoize 以优化性能）
  const toolbarLeft = useMemo(
    () => (
      <div className="flex flex-wrap items-center gap-3">
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates as [any, any] | null)}
          placeholder={["开始日期", "结束日期"]}
          className="w-[260px]"
        />

        <StandardSelect
          value={granularity}
          onValueChange={setGranularity}
          options={GRANULARITY_OPTIONS}
          placeholder="统计粒度"
          className="w-28"
        />

        <Input
          value={issuerId}
          onChange={(e) => setIssuerId(e.target.value)}
          placeholder="发起人ID（可选）"
          className="w-40"
        />

        <Button variant="primary" onClick={fetchStat} loading={loading}>
          <RefreshCw className="mr-1.5 h-4 w-4" />
          统计
        </Button>
      </div>
    ),
    [
      dateRange,
      setDateRange,
      granularity,
      setGranularity,
      issuerId,
      setIssuerId,
      fetchStat,
      loading,
    ],
  );

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* 页面标题 */}
      <div className="flex shrink-0 items-center gap-2 text-lg font-semibold text-gray-900">
        <BarChart3 className="h-5 w-5" />
        邀请统计
      </div>

      {/* 数据表格 */}
      <DataTable
        className="min-h-0 flex-1"
        columns={STATISTICS_COLUMNS}
        dataSource={rows}
        rowKey={getRowKey}
        loading={loading}
        toolbarLeft={toolbarLeft}
        emptyText="暂无统计数据，请选择时间范围后点击「统计」"
      />
    </div>
  );
}
