import { Plus, Search } from "lucide-react";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Input } from "@/modules/admin/components/ui/input";
import { Button } from "@/modules/admin/components/ui/button";
import { useUnbanReasonsLogic } from "./useUnbanReasonsLogic";
import { UnbanReasonModal } from "./UnbanReasonModal";
import { ConfirmModal } from "@/modules/admin/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";

export default function UnbanReasons() {
  const {
    loading,
    data,
    total,
    query,
    setQuery,
    columns,
    searchText,
    setSearchText,
    handleSearch,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    editRecord,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    deleteRecord,
    deleteLoading,
    handleDeleteExecute,
    fetchList,
  } = useUnbanReasonsLogic();

  return (
    <>
      {/* 头部工具栏 */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">解封原因管理</h1>
      </div>

      {/* 列表及搜索 */}
      <DataTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        toolbarLeft={
          <div className="flex items-center gap-2">
            {/* 搜索框 + 搜索按钮 */}
            <div className="flex">
              <div className="relative">
                <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  placeholder="搜索键值、名称或描述..."
                  className="w-[240px] rounded-r-none pl-9"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button variant="primary" className="-ml-px rounded-l-none" onClick={handleSearch}>
                搜索
              </Button>
            </div>
            {/* 状态筛选 */}
            {/* 状态筛选 */}
            <Select
              value={query.enabled === undefined ? "all" : String(query.enabled)}
              onValueChange={(val) => {
                setQuery((prev) => ({
                  ...prev,
                  enabled: val === "all" ? undefined : val === "true",
                }));
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="true">已启用</SelectItem>
                <SelectItem value="false">已禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        toolbarRight={
          <Button
            variant="primary"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            新增解封原因
          </Button>
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

      {/* 弹窗组件 */}
      <UnbanReasonModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        record={null}
        onSuccess={fetchList}
      />
      <UnbanReasonModal
        open={editOpen}
        onOpenChange={setEditOpen}
        record={editRecord}
        onSuccess={fetchList}
      />

      {/* 删除确认弹窗 */}
      <ConfirmModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="确认删除"
        content={
          <div className="space-y-2">
            <div className="text-gray-600">确定要删除该解封原因吗？</div>
            {deleteRecord && (
              <div className="rounded bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{deleteRecord.label}</span>
                <span className="ml-2 text-gray-400">({deleteRecord.key})</span>
              </div>
            )}
            <div className="text-xs text-gray-400">此操作无法撤销。</div>
          </div>
        }
        onOk={handleDeleteExecute}
        confirmLoading={deleteLoading}
        okButtonProps={{ variant: "primary", danger: true }}
      />
    </>
  );
}
