import { ReviewDto } from "@/api/models/ReviewDto";
import { useTorrentsLogic } from "./hooks/useTorrentsLogic";
import { TorrentsToolbar } from "./components/TorrentsToolbar";
import { TorrentsTable } from "./components/TorrentsTable";
import { CreateTorrentModal } from "./components/CreateTorrentModal";
import { EditTorrentModal } from "./components/EditTorrentModal";
import { ReviewModal } from "./components/ReviewModal";
import { AdvancedSearchModal } from "./components/AdvancedSearchModal";

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
    createForm,
    editForm,
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
    reviewForm,
    selectedRowKeys,
    setSelectedRowKeys,
    openCreate,
    submitCreate,
    openEdit,
    submitEdit,
    remove,
    doReview,
    fetchAdminWithRules,
    msg,
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
      reviewForm.resetFields();
    },
  });

  return (
    <>
      {/* 使用 DataTable，自带边框、分页等 */}
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
        onDetail={(id) => msg.info(`查看种子详情: ${id}`)}
        onRemove={remove}
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={setSelectedRowKeys}
      />

      {/* 弹窗组件 */}
      <CreateTorrentModal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={submitCreate}
        confirmLoading={uploading}
        form={createForm}
        categories={categories}
      />

      <EditTorrentModal
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onOk={submitEdit}
        form={editForm}
        editing={editing}
        categories={categories}
      />

      <ReviewModal
        open={reviewOpen}
        onCancel={() => setReviewOpen(false)}
        onOk={async () => {
          const v = await reviewForm.validateFields().catch(() => null);
          setReviewOpen(false);
          await doReview(
            editing?.id ? [editing.id] : selectedRowKeys,
            reviewAction as any,
            v?.note,
          );
          setEditing(null);
          setSelectedRowKeys([]); // 批量操作后重置选中状态
        }}
        form={reviewForm}
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
