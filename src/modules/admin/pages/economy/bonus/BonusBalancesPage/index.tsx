import { Search } from "lucide-react";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Input } from "@/modules/admin/components/ui/input";
import { Button } from "@/modules/admin/components/ui/button";
import { ConfirmModal } from "@/modules/admin/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";
import { useBonusBalancesLogic } from "./useBonusBalancesLogic";
import { AdjustModal } from "./components/AdjustModal";
import { FROZEN_OPTIONS, SORT_OPTIONS, ORDER_OPTIONS } from "./types";

/**
 * 魔力值余额管理页面
 */
export default function BonusBalancesPage() {
  const {
    loading,
    data,
    total,
    query,
    setQuery,
    columns,
    // 搜索
    searchText,
    setSearchText,
    handleSearch,
    resetQuery,
    // 弹窗
    adjustOpen,
    setAdjustOpen,
    currentRecord,
    // 冻结/解冻
    freezeConfirmOpen,
    setFreezeConfirmOpen,
    freezeLoading,
    handleFreezeExecute,
    unfreezeConfirmOpen,
    setUnfreezeConfirmOpen,
    unfreezeLoading,
    handleUnfreezeExecute,
    actionRecord,
    fetchList,
  } = useBonusBalancesLogic();

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">魔力值余额管理</h1>
        <div className="flex gap-2">
          <Button variant="default" onClick={resetQuery}>
            重置
          </Button>
          <Button variant="default" onClick={fetchList}>
            刷新
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        dataSource={data}
        rowKey="userId"
        loading={loading}
        toolbarLeft={
          <div className="flex flex-wrap items-center gap-2">
            {/* 用户ID搜索 */}
            <div className="flex">
              <div className="relative">
                <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  placeholder="搜索用户ID..."
                  className="w-[200px] rounded-r-none pl-9"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button variant="primary" className="-ml-px rounded-l-none" onClick={handleSearch}>
                查询
              </Button>
            </div>

            {/* 冻结状态 */}
            <Select
              value={query.isFrozen !== undefined ? String(query.isFrozen) : "all"}
              onValueChange={(val) => {
                setQuery((prev) => ({
                  ...prev,
                  isFrozen: val === "all" ? undefined : Number(val),
                  page: 1,
                }));
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {FROZEN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 余额范围 */}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Input
                placeholder="最小余额"
                className="w-[100px]"
                value={query.min || ""}
                onChange={(e) => setQuery((prev) => ({ ...prev, min: e.target.value }))}
              />
              <span>-</span>
              <Input
                placeholder="最大余额"
                className="w-[100px]"
                value={query.max || ""}
                onChange={(e) => setQuery((prev) => ({ ...prev, max: e.target.value }))}
              />
            </div>

            {/* 排序字段 */}
            <Select
              value={query.sortBy || "balance"}
              onValueChange={(val) => {
                setQuery((prev) => ({
                  ...prev,
                  sortBy: val as any,
                  page: 1,
                }));
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="排序字段" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 排序方向 */}
            <Select
              value={query.order || "DESC"}
              onValueChange={(val) => {
                setQuery((prev) => ({
                  ...prev,
                  order: val as any,
                  page: 1,
                }));
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="排序" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        pagination={{
          current: query.page,
          pageSize: query.limit,
          total: total,
          onChange: (page, limit) => {
            setQuery((prev) => ({ ...prev, page, limit }));
          },
        }}
      />

      {/* 调账弹窗 */}
      <AdjustModal
        open={adjustOpen}
        onClose={() => setAdjustOpen(false)}
        userId={currentRecord?.userId}
        isFrozen={currentRecord?.isFrozen}
        onDone={fetchList}
      />

      {/* 冻结确认 */}
      <ConfirmModal
        open={freezeConfirmOpen}
        onClose={() => setFreezeConfirmOpen(false)}
        title="确认冻结"
        content={
          <div className="space-y-2">
            <p className="text-gray-600">确定要冻结以下用户的魔力值账户吗？</p>
            {actionRecord && (
              <div className="rounded bg-gray-50 px-3 py-2 text-sm font-medium">
                用户: {actionRecord.username || actionRecord.userId}
              </div>
            )}
            <p className="text-xs text-gray-400">冻结后，该用户将无法获得魔力值。</p>
          </div>
        }
        onOk={handleFreezeExecute}
        confirmLoading={freezeLoading}
        okButtonProps={{ variant: "primary", danger: true }}
      />

      {/* 解冻确认 */}
      <ConfirmModal
        open={unfreezeConfirmOpen}
        onClose={() => setUnfreezeConfirmOpen(false)}
        title="确认解冻"
        content={
          <div className="space-y-2">
            <p className="text-gray-600">确定要解冻以下用户的魔力值账户吗？</p>
            {actionRecord && (
              <div className="rounded bg-gray-50 px-3 py-2 text-sm font-medium">
                用户: {actionRecord.username || actionRecord.userId}
              </div>
            )}
          </div>
        }
        onOk={handleUnfreezeExecute}
        confirmLoading={unfreezeLoading}
        okButtonProps={{ variant: "primary", className: "bg-green-600 hover:bg-green-700" }}
      />
    </>
  );
}
