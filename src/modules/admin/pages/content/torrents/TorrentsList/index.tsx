import { useTorrentsLogic } from "./hooks/useTorrentsLogic";
import { TorrentsToolbar } from "./components/TorrentsToolbar";
import { TorrentsTable } from "./components/TorrentsTable";
import { CreateTorrentModal } from "./components/CreateTorrentModal";
import { EditTorrentModal } from "./components/EditTorrentModal";
import { ReviewModal } from "./components/ReviewModal";
import { AdvancedSearchModal } from "./components/AdvancedSearchModal";
import { ReviewDto } from "@/api/models/ReviewDto";
import { toast } from "sonner";

/**
 * 种子列表管理页面
 * 支持搜索、筛选、排序、CRUD和审核操作
 */
export default function TorrentsList() {
  const {
    loading,
    items,
    page,
    setPage,
    limit,
    setLimit,
    total,
    searchText,
    setSearchText,
    categoryFilter,
    setCategoryFilter,
    categories,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    editing,
    setEditing,
    uploading,
    advOpen,
    setAdvOpen,
    advRules,
    setAdvRules,
    advLogic,
    setAdvLogic,
    approvalStatus,
    setApprovalStatus,
    reviewOpen,
    setReviewOpen,
    reviewAction,
    setReviewAction,
    selectedRowKeys,
    setSelectedRowKeys,
    openCreate,
    submitCreate,
    openEdit,
    submitEdit,
    remove,
    doReview,
    fetchAdminWithRules,
  } = useTorrentsLogic();

  // 处理分页变化
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setLimit(newPageSize);
  };

  // 处理排序变化
  const handleSortChange = (nextSortBy: typeof sortBy, nextOrder: typeof sortOrder) => {
    setSortBy(nextSortBy);
    setSortOrder(nextOrder);
    setPage(1); // 排序变化时重置页码
  };

  // 获取工具栏内容
  const toolbar = TorrentsToolbar({
    searchText,
    setSearchText,
    categoryFilter,
    setCategoryFilter,
    categories,
    approvalStatus,
    setApprovalStatus,
    items,
    onSearch: () => setPage(1),
    onCreate: openCreate,
    onAdvSearch: () => setAdvOpen(true),
    selectedCount: selectedRowKeys.length,
    onBatchReview: (action) => {
      setReviewAction(action);
      setReviewOpen(true);
    },
  });

  return (
    <>
      <TorrentsTable
        loading={loading}
        items={items}
        page={page}
        limit={limit}
        total={total}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
        toolbarLeft={toolbar.left}
        toolbarRight={toolbar.right}
        onDetail={(id) => toast.info(`查看种子详情: ${id}`)}
        onRemove={remove}
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={setSelectedRowKeys}
      />

      <CreateTorrentModal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={submitCreate}
        confirmLoading={uploading}
        categories={categories}
      />

      <EditTorrentModal
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onOk={submitEdit}
        editing={editing}
        categories={categories}
      />

      <ReviewModal
        open={reviewOpen}
        onCancel={() => setReviewOpen(false)}
        onOk={async (values) => {
          await doReview(
            editing?.id ? [editing.id] : selectedRowKeys,
            reviewAction === "approve" ? ReviewDto.action.APPROVE : ReviewDto.action.REJECT,
            values.note,
          );
          setEditing(null);
        }}
        reviewAction={reviewAction as any}
      />

      <AdvancedSearchModal
        open={advOpen}
        onCancel={() => setAdvOpen(false)}
        onOk={() => {
          setAdvOpen(false);
          fetchAdminWithRules();
        }}
        rules={advRules}
        logic={advLogic}
        onChange={(nextRules, nextLogic) => {
          setAdvRules(nextRules);
          setAdvLogic(nextLogic);
        }}
      />
    </>
  );
}
