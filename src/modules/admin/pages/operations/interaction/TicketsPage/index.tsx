import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useTicketsLogic } from "./useTicketsLogic";
import { TicketModal } from "./components/TicketModal";
import { StandardSelect as Select } from "@/modules/admin/components/ui/select";
import { SearchInput } from "@/modules/admin/components/ui/search-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/modules/admin/components/ui/dialog";
import { statusOptions, categoryOptions } from "./constants";

export default function TicketsPage() {
  const {
    data,
    loading,
    total,
    stats,
    query,
    setQuery,
    columns,
    // 弹窗
    createOpen,
    setCreateOpen,
    createLoading,
    control,
    errors,
    // 确认弹窗
    confirmOpen,
    setConfirmOpen,
    handleConfirmClose,
    isClosing,
    // 操作
    handleSearch,
    onSubmitCreate,
  } = useTicketsLogic();

  return (
    <div className="space-y-4">
      {/* 统计指标 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { title: "待处理", value: stats.pending, color: "text-blue-500" },
          { title: "处理中", value: stats.processing, color: "text-orange-500" },
          { title: "已解决", value: stats.resolved, color: "text-green-500" },
          { title: "已关闭", value: stats.closed, color: "text-muted-foreground" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-card border-border/50 rounded-lg border p-4 shadow-sm"
          >
            <div className="text-muted-foreground text-sm font-medium">{item.title}</div>
            <div className={`mt-1 text-2xl font-bold ${item.color}`}>{item.value}</div>
          </div>
        ))}
      </div>

      <DataTable
        columns={columns as any}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: query.page,
          pageSize: query.pageSize,
          total: total,
          onChange: (page, pageSize) => setQuery((prev) => ({ ...prev, page, pageSize })),
        }}
        toolbarLeft={
          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="搜索关键词..."
              value={query.keyword || ""}
              onChange={(e) => setQuery((prev) => ({ ...prev, keyword: e.target.value }))}
              onSearch={() => handleSearch({})}
              wrapperClassName="w-64"
              enterButton={
                <>
                  <Search className="mr-1 h-4 w-4" />
                  搜索
                </>
              }
            />
            <Select
              value={query.status}
              onValueChange={(v) => setQuery((prev) => ({ ...prev, status: v, page: 1 }))}
              options={statusOptions}
              placeholder="状态"
              className="w-32"
              allowClear
            />
            <Select
              value={query.category}
              onValueChange={(v) => setQuery((prev) => ({ ...prev, category: v, page: 1 }))}
              options={categoryOptions}
              placeholder="类别"
              className="w-32"
              allowClear
            />
          </div>
        }
        toolbarRight={
          <Button variant="primary" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新建工单
          </Button>
        }
      />

      <TicketModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        control={control}
        errors={errors}
        onFinish={onSubmitCreate}
        loading={createLoading}
      />

      {/* 关闭工单确认弹窗 */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>确认关闭该工单？</DialogTitle>
          </DialogHeader>
          <div className="text-muted-foreground py-4 text-sm">
            关闭后工单将不再接受回复，且状态变更为“已关闭”。
          </div>
          <DialogFooter>
            <Button variant="default" onClick={() => setConfirmOpen(false)}>
              取消
            </Button>
            <Button variant="primary" danger onClick={handleConfirmClose} loading={isClosing}>
              确认关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
