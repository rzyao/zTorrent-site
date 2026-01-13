import { useRolesLogic } from "./hooks/useRolesLogic";
import { RoleTable } from "./components/RoleTable";
import { RoleEditModal } from "./components/RoleEditModal";
import { PermissionAssignModal } from "./components/PermissionAssignModal";

export default function RolesPage() {
  const {
    // Data
    roles,
    total,
    loading,
    permissionTree,

    // State
    page,
    setPage,
    pageSize,
    searchText,
    setSearchText,

    // Modal controls
    isEditModalOpen,
    setIsEditModalOpen,
    editingRole,

    isPermissionModalOpen,
    setIsPermissionModalOpen,

    selectedRoleForPerms,
    selectedAdminIds,
    setSelectedAdminIds,
    selectedWebIds,
    setSelectedWebIds,

    // Actions
    handleCreate,
    handleEdit,
    handleDelete,
    handleSubmitRole,
    handleOpenPermissions,
    handleSavePermissions,
    isSavingRole,
  } = useRolesLogic();

  return (
    <div className="flex h-full flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">角色管理</h1>
        <p className="text-muted-foreground mt-1 text-sm">管理系统角色及其功能权限分配</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <RoleTable
          data={roles}
          loading={loading}
          page={page}
          pageSize={pageSize}
          total={total}
          searchText={searchText}
          onSearchChange={setSearchText}
          onPageChange={setPage}
          onAdd={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAssignPermissions={handleOpenPermissions}
        />
      </div>

      {isEditModalOpen && (
        <RoleEditModal
          isModalOpen={isEditModalOpen}
          editingRole={editingRole}
          onCancel={() => setIsEditModalOpen(false)}
          loading={isSavingRole}
          onFinish={handleSubmitRole}
          // We pass the existing roles to check for duplicates client-side if needed,
          // though the server logic is better. The original component used roleKeys.
          // We'll pass a map or list if the component strictly needs it for sync validation.
          // The logic hook provides `roleKeysMap`.
        />
      )}

      {isPermissionModalOpen && selectedRoleForPerms && (
        <PermissionAssignModal
          isPermissionModalOpen={isPermissionModalOpen}
          selectedRole={selectedRoleForPerms}
          onCancel={() => setIsPermissionModalOpen(false)}
          onSave={handleSavePermissions}
          permissionsAdmin={permissionTree.admin}
          selectedAdminIds={selectedAdminIds}
          setSelectedAdminIds={setSelectedAdminIds}
          permissionsWeb={permissionTree.web}
          selectedWebIds={selectedWebIds}
          setSelectedWebIds={setSelectedWebIds}
        />
      )}
    </div>
  );
}
