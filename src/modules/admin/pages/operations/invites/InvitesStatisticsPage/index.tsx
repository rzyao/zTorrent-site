import { useMemo } from "react";
import { BarChart3, RefreshCw, Filter } from "lucide-react";
import { useStatisticsLogic } from "./useStatisticsLogic";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { StandardSelect } from "@/modules/admin/components/ui/select";
import { Label } from "@/modules/admin/components/ui/label";
import { GRANULARITY_OPTIONS, STATISTICS_COLUMNS } from "./constants";
import type { StatisticRow } from "./types";

/** 行 Key 提取函数 */
const getRowKey = (record: StatisticRow) => record.time;

export default function InvitesStatisticsPage() {
  const {
    rows,
    loading,
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
  } = useStatisticsLogic();

  // 工具栏（memoize 以优化性能）
  const toolbarLeft = useMemo(
    () => (
      <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-slate-50/50 p-4 dark:bg-slate-900/10">
        <div className="space-y-1.5">
          <Label size="sm">统计时间范围</Label>
          <div className="flex items-center gap-2">
            <Input
              type="datetime-local"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-[200px]"
            />
            <span className="text-muted-foreground text-xs font-medium italic">至</span>
            <Input
              type="datetime-local"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-[200px]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label size="sm">粒度</Label>
          <StandardSelect
            value={granularity}
            onValueChange={setGranularity}
            options={GRANULARITY_OPTIONS}
            placeholder="粒度"
            className="w-28"
          />
        </div>

        <div className="space-y-1.5">
          <Label size="sm">发起人ID (选填)</Label>
          <Input
            value={issuerId}
            onChange={(e) => setIssuerId(e.target.value)}
            placeholder="搜索发起人..."
            className="w-40"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="primary" onClick={fetchStat} loading={loading}>
            <BarChart3 className="mr-1.5 h-4 w-4" />
            分析
          </Button>
          <Button variant="default" onClick={resetFilters}>
            重置
          </Button>
        </div>
      </div>
    ),
    [
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
      loading,
    ],
  );

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* 页面标题 */}
      <div className="flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Filter className="text-primary h-5 w-5" />
          邀请数据统计分析
        </div>
      </div>

      {toolbarLeft}

      {/* 数据表格 */}
      <DataTable
        className="min-h-0 flex-1"
        columns={STATISTICS_COLUMNS}
        dataSource={rows}
        rowKey={getRowKey}
        loading={loading}
        emptyText="暂无统计数据，请选择时间范围后点击「分析」"
      />
    </div>
  );
}
