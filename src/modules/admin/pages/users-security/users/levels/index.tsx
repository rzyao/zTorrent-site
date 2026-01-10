import { Space } from "antd";
import { useLevelManagement } from "./hooks/useLevelManagement";
import { LevelSearch } from "./components/LevelSearch";
import { LevelTable } from "./components/LevelTable";
import { LevelDetailModal } from "./components/LevelDetailModal";
import { LevelEditModal } from "./components/LevelEditModal";
import { PermissionAssignModal } from "./components/PermissionAssignModal";

export default function LevelsPage() {
  const {
    levels,
    loading,
    searchKey,
    setSearchKey,
    searchLabel,
    setSearchLabel,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    can,
    detailOpen,
    setDetailOpen,
    detailData,
    editOpen,
    setEditOpen,
    editing,
    form,
    permOpen,
    setPermOpen,
    permTarget,
    permissionsAdmin,
    permissionsWeb,
    permissionIdToKey,
    selectedAdminIds,
    setSelectedAdminIds,
    selectedWebIds,
    setSelectedWebIds,
    handleAdd,
    handleEdit,
    submitEdit,
    confirmDelete,
    openAssignPermissions,
    handleShowDetail,
  } = useLevelManagement();

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <LevelSearch
          searchKey={searchKey}
          setSearchKey={setSearchKey}
          searchLabel={searchLabel}
          setSearchLabel={setSearchLabel}
          setPage={setPage}
          can={can}
          onAdd={handleAdd}
          loading={loading}
        />

        <LevelTable
          levels={levels}
          loading={loading}
          page={page}
          pageSize={pageSize}
          total={total}
          setPage={setPage}
          setPageSize={setPageSize}
          searchKey={searchKey}
          searchLabel={searchLabel}
          can={can}
          onShowDetail={handleShowDetail}
          onEdit={handleEdit}
          onAssignPermissions={openAssignPermissions}
          onDelete={confirmDelete}
        />

        <LevelDetailModal
          detailOpen={detailOpen}
          setDetailOpen={setDetailOpen}
          detailData={detailData}
        />

        <LevelEditModal
          editOpen={editOpen}
          setEditOpen={setEditOpen}
          editing={editing}
          form={form}
          onFinish={submitEdit}
          levels={levels}
        />

        <PermissionAssignModal
          permOpen={permOpen}
          setPermOpen={setPermOpen}
          permTarget={permTarget}
          permissionsAdmin={permissionsAdmin}
          selectedAdminIds={selectedAdminIds}
          permissionsWeb={permissionsWeb}
          selectedWebIds={selectedWebIds}
          setSelectedAdminIds={setSelectedAdminIds}
          setSelectedWebIds={setSelectedWebIds}
          permissionIdToKey={permissionIdToKey}
        />
      </Space>
    </div>
  );
}
