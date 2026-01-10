import { Space } from "antd";
import { useRoleManagement } from "./hooks/useRoleManagement";
import { RoleSearch } from "./components/RoleSearch";
import { RoleTable } from "./components/RoleTable";
import { RoleEditModal } from "./components/RoleEditModal";
import { PermissionAssignModal } from "./components/PermissionAssignModal";

export default function RoleManagement() {
  const {
    roles,
    permissionsAdmin,
    permissionsWeb,
    isModalOpen,
    setIsModalOpen,
    isPermissionModalOpen,
    setIsPermissionModalOpen,
    editingRole,
    selectedRole,
    loading,
    searchText,
    setSearchText,
    page,
    setPage,
    pageSize,
    total,
    form,
    roleKeys,
    permissionIdToKey,
    selectedAdminIds,
    setSelectedAdminIds,
    selectedWebIds,
    setSelectedWebIds,
    handleAdd,
    handleEdit,
    confirmDelete,
    handleSubmit,
    handleAssignPermissions,
    getPermissionCount,
    loadRoles,
  } = useRoleManagement();

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <RoleSearch
          searchText={searchText}
          setSearchText={setSearchText}
          setPage={setPage}
          loading={loading}
          onAdd={handleAdd}
        />

        <RoleTable
          roles={roles}
          loading={loading}
          page={page}
          pageSize={pageSize}
          total={total}
          setPage={setPage}
          searchText={searchText}
          onAssignPermissions={handleAssignPermissions}
          onEdit={handleEdit}
          onDelete={confirmDelete}
        />

        <RoleEditModal
          isModalOpen={isModalOpen}
          editingRole={editingRole}
          onCancel={() => setIsModalOpen(false)}
          form={form}
          loading={loading}
          onFinish={handleSubmit}
          roleKeys={roleKeys}
        />

        <PermissionAssignModal
          isPermissionModalOpen={isPermissionModalOpen}
          selectedRole={selectedRole}
          onCancel={() => setIsPermissionModalOpen(false)}
          getPermissionCount={getPermissionCount}
          permissionsAdmin={permissionsAdmin}
          selectedAdminIds={selectedAdminIds}
          permissionsWeb={permissionsWeb}
          selectedWebIds={selectedWebIds}
          setSelectedAdminIds={setSelectedAdminIds}
          setSelectedWebIds={setSelectedWebIds}
          roleKeys={roleKeys}
          permissionIdToKey={permissionIdToKey}
          loadRoles={loadRoles}
        />
      </Space>
    </div>
  );
}
