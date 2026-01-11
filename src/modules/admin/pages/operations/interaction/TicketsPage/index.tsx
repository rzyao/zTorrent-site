import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { Plus, Search, RotateCcw } from "lucide-react";
import { useTicketsLogic } from "./useTicketsLogic";
import { TicketModal } from "./components/TicketModal";
import { StandardSelect as Select } from "@/modules/admin/components/ui/select";
import { Input } from "@/modules/admin/components/ui/input";
import { Card } from "antd";
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
    createForm,
    // 操作
    handleSearch,
    handleReset,
    handleSubmitCreate,
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
          <Card
            key={item.title}
            size="small"
            className="bg-card/50 border-none shadow-sm backdrop-blur-sm"
          >
            <div className="p-2">
              <div className="text-muted-foreground text-sm font-medium">{item.title}</div>
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
            </div>
          </Card>
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
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Input
                placeholder="搜索关键词..."
                value={query.keyword || ""}
                onChange={(e) => setQuery((prev) => ({ ...prev, keyword: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleSearch({})}
                className="h-8 w-48 rounded-r-none"
              />
              <Button
                variant="default"
                className="-ml-px h-8 rounded-l-none"
                onClick={() => handleSearch({})}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Select
              value={query.status}
              onValueChange={(v) => setQuery((prev) => ({ ...prev, status: v, page: 1 }))}
              options={statusOptions}
              className="w-32"
            />
            <Select
              value={query.category}
              onValueChange={(v) => setQuery((prev) => ({ ...prev, category: v, page: 1 }))}
              options={categoryOptions}
              className="w-32"
            />
            <Button variant="text" size="sm" onClick={handleReset} className="h-8 w-8 p-1">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        }
        toolbarRight={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新建工单
          </Button>
        }
      />

      <TicketModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        form={createForm}
        onFinish={handleSubmitCreate}
        loading={createLoading}
      />
    </div>
  );
}
