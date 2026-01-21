import { useCallback, useMemo } from "react";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Input } from "@/modules/admin/components/ui/input";
import { AdjustmentForm } from "./components/AdjustmentForm";
import { ADJUSTMENT_COLUMNS } from "./constants";
import { useBonusAdjustments } from "./hooks/useBonusAdjustments";

/**
 * 人工调账页面
 * 职责：为管理员提供对用户魔力值的人工增减能力，并展示审计记录
 */
export default function BonusAdjustmentsPage() {
  const {
    items,
    total,
    loading,
    adjusting,
    page,
    limit,
    userFilter,
    setPage,
    setLimit,
    setUserFilter,
    handleAdjust,
  } = useBonusAdjustments();

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserFilter(e.target.value || undefined);
      setPage(1);
    },
    [setUserFilter, setPage],
  );

  const pagination = useMemo(
    () => ({
      current: page,
      pageSize: limit,
      total,
      onChange: (p: number, s: number) => {
        setPage(p);
        setLimit(s);
      },
    }),
    [page, limit, total, setPage, setLimit],
  );

  const toolbarLeft = useMemo(
    () => (
      <div className="flex items-center space-x-2">
        <Input
          placeholder="筛选用户ID"
          className="w-[200px]"
          value={userFilter || ""}
          onChange={handleFilterChange}
        />
      </div>
    ),
    [userFilter, handleFilterChange],
  );

  return (
    <div className="flex h-full flex-col space-y-4">
      {/* 顶部调账操作表单 */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <AdjustmentForm onAdjust={handleAdjust} loading={adjusting} />
      </div>

      {/* 审计记录表格 */}
      <DataTable
        className="min-h-0 flex-1"
        columns={ADJUSTMENT_COLUMNS}
        dataSource={items}
        rowKey="id"
        loading={loading}
        toolbarLeft={toolbarLeft}
        pagination={pagination}
      />
    </div>
  );
}
