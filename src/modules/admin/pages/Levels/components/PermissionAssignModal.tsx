import React from "react";
import { Modal, Space, Typography, Tabs, App } from "antd";
import PermissionTree from "@/modules/admin/pages/PermissionsPage/PermissionTree";
import { LevelsService } from "@/api/services/LevelsService";
import type { LevelItem } from "../types";

interface PermissionAssignModalProps {
  permOpen: boolean;
  setPermOpen: (open: boolean) => void;
  permTarget: LevelItem | null;
  permissionsAdmin: any[];
  selectedAdminIds: string[];
  permissionsWeb: any[];
  selectedWebIds: string[];
  setSelectedAdminIds: (ids: string[]) => void;
  setSelectedWebIds: (ids: string[]) => void;
  permissionIdToKey: Record<string, string>;
  selectedWebIdsInitial?: string[]; // Assuming logic
}

export const PermissionAssignModal: React.FC<PermissionAssignModalProps> = ({
  permOpen,
  setPermOpen,
  permTarget,
  permissionsAdmin,
  selectedAdminIds,
  permissionsWeb,
  selectedWebIds,
  setSelectedAdminIds,
  setSelectedWebIds,
  permissionIdToKey,
}) => {
  const { message } = App.useApp();

  return (
    <Modal
      open={permOpen && !!permTarget}
      title={
        <Space direction="vertical" size={4}>
          <Typography.Text>分配权限</Typography.Text>
          {permTarget && (
            <Typography.Text type="secondary">
              等级：{permTarget.label}
              <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                （{permTarget.key}）
              </Typography.Text>
            </Typography.Text>
          )}
        </Space>
      }
      onCancel={() => setPermOpen(false)}
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
                  permissions={permissionsAdmin as any}
                  selectedIds={selectedAdminIds}
                  onChange={async (ids: string[]) => {
                    setSelectedAdminIds(ids);
                    const allIds = [...ids, ...selectedWebIds];
                    const permissionKeys = allIds
                      .map((id) => permissionIdToKey[id])
                      .filter(Boolean);
                    if (permTarget) {
                      try {
                        await LevelsService.levelsPermissionsControllerSetPermissions({
                          levelKey: permTarget.key,
                          permissionKeys,
                        });
                        message.success("已保存权限");
                      } catch (e: any) {
                        message.error(e?.message || "分配权限失败");
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
                  permissions={permissionsWeb as any}
                  selectedIds={selectedWebIds}
                  onChange={async (ids: string[]) => {
                    setSelectedWebIds(ids);
                    const allIds = [...selectedAdminIds, ...ids];
                    const permissionKeys = allIds
                      .map((id) => permissionIdToKey[id])
                      .filter(Boolean);
                    if (permTarget) {
                      try {
                        await LevelsService.levelsPermissionsControllerSetPermissions({
                          levelKey: permTarget.key,
                          permissionKeys,
                        });
                        message.success("已保存权限");
                      } catch (e: any) {
                        message.error(e?.message || "分配权限失败");
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
