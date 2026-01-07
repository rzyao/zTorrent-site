import React from "react";
import { Modal, Space, Typography, Tabs } from "antd";
import PermissionTree from "../../PermissionsPage/PermissionTree";
import type { Role } from "../types";
import { RolesService } from "@/api/services/RolesService";
import type { Permission } from "../../PermissionsPage/types/permission";

interface PermissionAssignModalProps {
  isPermissionModalOpen: boolean;
  selectedRole: Role | null;
  onCancel: () => void;
  getPermissionCount: () => number;
  permissionsAdmin: Permission[];
  selectedAdminIds: string[];
  permissionsWeb: Permission[];
  selectedWebIds: string[];
  setSelectedAdminIds: (ids: string[]) => void;
  setSelectedWebIds: (ids: string[]) => void;
  roleKeys: Record<string, string>;
  permissionIdToKey: Record<string, string>;
  loadRoles: () => Promise<void>;
}

export const PermissionAssignModal: React.FC<PermissionAssignModalProps> = ({
  isPermissionModalOpen,
  selectedRole,
  onCancel,
  getPermissionCount,
  permissionsAdmin,
  selectedAdminIds,
  permissionsWeb,
  selectedWebIds,
  setSelectedAdminIds,
  setSelectedWebIds,
  roleKeys,
  permissionIdToKey,
  loadRoles,
}) => {
  return (
    <Modal
      open={isPermissionModalOpen && !!selectedRole}
      title={
        <Space direction="vertical" size={4}>
          <Typography.Text>分配权限</Typography.Text>
          {selectedRole && (
            <Typography.Text type="secondary">
              角色：{selectedRole.name}
              <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                ({getPermissionCount()} 项权限)
              </Typography.Text>
            </Typography.Text>
          )}
        </Space>
      }
      onCancel={onCancel}
      footer={null}
      width={960}
      destroyOnHidden
    >
      <Tabs
        defaultActiveKey="admin"
        items={[
          {
            key: "admin",
            label: "Admin 权限",
            children: (
              <div style={{ maxHeight: "70vh", overflow: "auto" }}>
                <PermissionTree
                  permissions={permissionsAdmin}
                  selectedIds={selectedAdminIds}
                  onChange={async (ids: string[]) => {
                    setSelectedAdminIds(ids);
                    const allIds = [...ids, ...selectedWebIds];
                    const roleKey =
                      selectedRole?.key || (selectedRole ? roleKeys[selectedRole.id] : undefined);
                    const permissionKeys = allIds
                      .map((id) => permissionIdToKey[id])
                      .filter(Boolean);
                    if (roleKey) {
                      try {
                        await RolesService.rolesAclControllerSetRolePermissions({
                          roleKey,
                          permissionKeys,
                        });
                        await loadRoles();
                      } catch (error) {
                        console.error("分配权限失败:", error);
                        alert("分配失败，请重试");
                      }
                    }
                  }}
                />
              </div>
            ),
          },
          {
            key: "web",
            label: "Web 权限",
            children: (
              <div style={{ maxHeight: "70vh", overflow: "auto" }}>
                <PermissionTree
                  permissions={permissionsWeb}
                  selectedIds={selectedWebIds}
                  onChange={async (ids: string[]) => {
                    setSelectedWebIds(ids);
                    const allIds = [...selectedAdminIds, ...ids];
                    const roleKey =
                      selectedRole?.key || (selectedRole ? roleKeys[selectedRole.id] : undefined);
                    const permissionKeys = allIds
                      .map((id) => permissionIdToKey[id])
                      .filter(Boolean);
                    if (roleKey) {
                      try {
                        await RolesService.rolesAclControllerSetRolePermissions({
                          roleKey,
                          permissionKeys,
                        });
                        await loadRoles();
                      } catch (error) {
                        console.error("分配权限失败:", error);
                        alert("分配失败，请重试");
                      }
                    }
                  }}
                />
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};
