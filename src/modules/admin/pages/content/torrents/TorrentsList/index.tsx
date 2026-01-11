import { Pagination } from "antd";
import { ReviewDto } from "@/api/models/ReviewDto";
import { useTorrentsLogic } from "./hooks/useTorrentsLogic";
import { TorrentsToolbar } from "./components/TorrentsToolbar";
import { TorrentsTable } from "./components/TorrentsTable";
import { CreateTorrentModal } from "./components/CreateTorrentModal";
import { EditTorrentModal } from "./components/EditTorrentModal";
import { ReviewModal } from "./components/ReviewModal";
import { AdvancedSearchModal } from "./components/AdvancedSearchModal";

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
    tableContainerRef,
    tableScrollY,
    loadList,
    openCreate,
    submitCreate,
    openEdit,
    submitEdit,
    remove,
    doReview,
    fetchAdminWithRules,
    msg,
  } = useTorrentsLogic();

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <TorrentsToolbar
        searchText={searchText}
        setSearchText={setSearchText}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
        approvalStatus={approvalStatus}
        setApprovalStatus={setApprovalStatus}
        items={items}
        onSearch={() => {
          setPage(1);
        }}
        onCreate={openCreate}
        onAdvSearch={() => setAdvOpen(true)}
        onBatchReview={(action) => {
          setReviewAction(action);
          setReviewOpen(true);
          reviewForm.resetFields();
        }}
      />

      <div
        ref={tableContainerRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TorrentsTable
          loading={loading}
          items={items}
          sortBy={sortBy}
          sortOrder={sortOrder}
          tableScrollY={tableScrollY}
          onSortChange={(nextSortBy, nextOrder) => {
            setSortBy(nextSortBy);
            setSortOrder(nextOrder);
            setPage(1);
          }}
          onDetail={(id) => msg.info(`查看种子详情: ${id}`)}
          onDownload={(id) => msg.info(`下载种子: ${id}`)}
          onEdit={openEdit}
          onRemove={remove}
          onReview={doReview}
          onRejectReview={(record) => {
            setReviewAction("reject");
            setReviewOpen(true);
            reviewForm.resetFields();
            setEditing({ id: record.id } as any);
          }}
        />
      </div>

      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pagination
          current={page}
          pageSize={limit}
          total={total}
          showSizeChanger
          onChange={(p, ps) => {
            setPage(p);
            setLimit(ps);
          }}
        />
      </div>

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
            editing?.id ? [editing.id] : items.map((i) => i.id!).filter(Boolean),
            reviewAction as any,
            v?.note,
          );
          setEditing(null);
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
    </div>
  );
}
