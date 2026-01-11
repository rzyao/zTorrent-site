import { Plus, Search } from "lucide-react";
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
import { usePlaylistsLogic } from "./usePlaylistsLogic";
import { PlaylistModal } from "./components/PlaylistModal";
import { ReviewModal } from "./components/ReviewModal";
import { APPROVAL_STATUS_OPTIONS, TYPE_OPTIONS, VISIBILITY_OPTIONS } from "./types";

/**
 * 片单管理页面
 * 页面仅负责 UI 渲染，核心逻辑由 usePlaylistsLogic Hook 提供
 */
export default function Playlists() {
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
    selectedIds,
    setSelectedIds,
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
    handleBatchEnable,
    handleBatchDisable,
    batchEnableLoading,
    batchDisableLoading,
    reviewOpen,
    setReviewOpen,
    reviewAction,
    reviewIds,
    reviewLoading,
    handleReviewExecute,
    openReviewApprove,
    openReviewReject,
    fetchList,
  } = usePlaylistsLogic();

  // 是否有选中行
  const hasSelection = selectedIds.length > 0;

  return (
    <>
      {/* 列表及搜索 */}
      <DataTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        rowSelection={{
          selectedRowKeys: selectedIds,
          onChange: setSelectedIds,
        }}
        toolbarLeft={
          <div className="flex flex-wrap items-center gap-2">
            {/* 搜索框 + 搜索按钮 */}
            <div className="flex">
              <div className="relative">
                <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  placeholder="关键词搜索..."
                  className="w-[200px] rounded-r-none pl-9"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button variant="primary" className="-ml-px rounded-l-none" onClick={handleSearch}>
                搜索
              </Button>
            </div>

            {/* 审核状态筛选 */}
            <Select
              value={query.approvalStatus || "all"}
              onValueChange={(val) => {
                setQuery((prev) => ({
                  ...prev,
                  approvalStatus: val === "all" ? undefined : (val as any),
                  page: 1,
                }));
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="审核状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {APPROVAL_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 类型筛选 */}
            <Select
              value={query.type || "all"}
              onValueChange={(val) => {
                setQuery((prev) => ({
                  ...prev,
                  type: val === "all" ? undefined : (val as any),
                  page: 1,
                }));
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 可见性筛选 */}
            <Select
              value={query.visibility || "all"}
              onValueChange={(val) => {
                setQuery((prev) => ({
                  ...prev,
                  visibility: val === "all" ? undefined : (val as any),
                  page: 1,
                }));
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="可见性" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部可见</SelectItem>
                {VISIBILITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 拥有者ID输入 */}
            <Input
              placeholder="拥有者用户ID"
              className="w-[160px]"
              value={query.ownerUserId || ""}
              onChange={(e) => {
                setQuery((prev) => ({
                  ...prev,
                  ownerUserId: e.target.value || undefined,
                }));
              }}
            />
          </div>
        }
        toolbarRight={
          <div className="flex items-center gap-2">
            {/* 批量操作按钮 */}
            <Button
              variant="default"
              disabled={!hasSelection}
              loading={batchEnableLoading}
              onClick={handleBatchEnable}
            >
              批量启用
            </Button>
            <Button
              variant="default"
              danger
              disabled={!hasSelection}
              loading={batchDisableLoading}
              onClick={handleBatchDisable}
            >
              批量禁用
            </Button>
            <Button
              variant="default"
              disabled={!hasSelection}
              onClick={() => openReviewApprove(selectedIds)}
            >
              批量通过
            </Button>
            <Button
              variant="default"
              danger
              disabled={!hasSelection}
              onClick={() => openReviewReject(selectedIds)}
            >
              批量驳回
            </Button>
            {/* 新增按钮 */}
            <Button
              variant="primary"
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              新增片单
            </Button>
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

      {/* 新增弹窗 */}
      <PlaylistModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        record={null}
        onSuccess={fetchList}
      />

      {/* 编辑弹窗 */}
      <PlaylistModal
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
            <div className="text-gray-600">确定要删除该片单吗？</div>
            {deleteRecord && (
              <div className="rounded bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium text-gray-900">{deleteRecord.title}</span>
                <span className="ml-2 text-gray-400">({deleteRecord.id})</span>
              </div>
            )}
            <div className="text-xs text-gray-400">此操作无法撤销。</div>
          </div>
        }
        onOk={handleDeleteExecute}
        confirmLoading={deleteLoading}
        okButtonProps={{ variant: "primary", danger: true }}
      />

      {/* 审核弹窗 */}
      <ReviewModal
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        action={reviewAction}
        ids={reviewIds}
        loading={reviewLoading}
        onConfirm={handleReviewExecute}
      />
    </>
  );
}
