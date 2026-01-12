import React from "react";
import { Modal, Space, Typography, Tabs, Button } from "antd";
import PermissionTree from "@/modules/admin/pages/users-security/PermissionsPage/components/PermissionTree";
import type { Role } from "../types";
import type { Permission } from "@/modules/admin/pages/users-security/PermissionsPage/types";

interface PermissionAssignModalProps {
  isPermissionModalOpen: boolean;
  selectedRole: Role;
  onCancel: () => void;
  onSave: () => Promise<void>;

  permissionsAdmin: Permission[];
  selectedAdminIds: string[];
  setSelectedAdminIds: (ids: string[]) => void;

  permissionsWeb: Permission[];
  selectedWebIds: string[];
  setSelectedWebIds: (ids: string[]) => void;
}

export const PermissionAssignModal: React.FC<PermissionAssignModalProps> = ({
  isPermissionModalOpen,
  selectedRole,
  onCancel,
  onSave,
  permissionsAdmin,
  selectedAdminIds,
  setSelectedAdminIds,
  permissionsWeb,
  selectedWebIds,
  setSelectedWebIds,
}) => {
  const [loading, setLoading] = React.useState(false);

  // Helper to count total locally
  const totalSelected = selectedAdminIds.length + selectedWebIds.length;

  const handleOk = async () => {
    setLoading(true);
    try {
      await onSave();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isPermissionModalOpen}
      title={
        <Space orientation="vertical" size={4}>
          <Typography.Text>分配权限</Typography.Text>
          <Typography.Text type="secondary">
            角色：{selectedRole.name}
            <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
              (已选 {totalSelected} 项)
            </Typography.Text>
          </Typography.Text>
        </Space>
      }
      onCancel={onCancel}
      width={960}
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={handleOk} loading={loading}>
          保存配置
        </Button>,
      ]}
    >
      <Tabs
        defaultActiveKey="admin"
        items={[
          {
            key: "admin",
            label: `Admin 权限 (${selectedAdminIds.length})`,
            children: (
              <div style={{ maxHeight: "60vh", overflowY: "auto", overflowX: "hidden" }}>
                <PermissionTree
                  permissions={permissionsAdmin}
                  selectedIds={selectedAdminIds}
                  onChange={setSelectedAdminIds}
                />
              </div>
            ),
          },
          {
            key: "web",
            label: `Web 权限 (${selectedWebIds.length})`,
            children: (
              <div style={{ maxHeight: "60vh", overflowY: "auto", overflowX: "hidden" }}>
                <PermissionTree
                  permissions={permissionsWeb}
                  selectedIds={selectedWebIds}
                  onChange={setSelectedWebIds}
                />
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};
