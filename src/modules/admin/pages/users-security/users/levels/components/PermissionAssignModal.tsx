import React, { useState, memo } from "react";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Button } from "@/modules/admin/components/ui/button";
import PermissionTree from "@/modules/admin/pages/users-security/PermissionsPage/components/PermissionTree";
import { usePermissionAssign } from "../hooks/usePermissionAssign";
import { LevelItem } from "../types";

interface PermissionAssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: LevelItem | null;
}

const PermissionAssignModalComponent: React.FC<PermissionAssignModalProps> = ({
  open,
  onOpenChange,
  target,
}) => {
  const [activeTab, setActiveTab] = useState<"admin" | "web">("admin");
  const {
    isLoading,
    adminTree,
    webTree,
    selectedAdminIds,
    setSelectedAdminIds,
    selectedWebIds,
    setSelectedWebIds,
    savePermissions,
  } = usePermissionAssign(target?.key);

  const handleAdminChange = async (ids: string[]) => {
    setSelectedAdminIds(ids);
    await savePermissions(ids, selectedWebIds);
  };

  const handleWebChange = async (ids: string[]) => {
    setSelectedWebIds(ids);
    await savePermissions(selectedAdminIds, ids);
  };

  return (
    <Modal
      title={
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">分配权限</span>
          {target && (
            <span className="text-sm font-normal text-neutral-500">
              等级：{target.label} ({target.key})
            </span>
          )}
        </div>
      }
      open={open}
      onClose={() => onOpenChange(false)}
      footer={null}
      width={1000}
    >
      <div className="py-2">
        {/* Tab 导航 */}
        <div className="mb-6 flex border-b border-neutral-200">
          <button
            className={`-mb-px border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "admin"
                ? "border-primary text-primary"
                : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
            }`}
            onClick={() => setActiveTab("admin")}
          >
            Admin 权限
          </button>
          <button
            className={`-mb-px border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "web"
                ? "border-primary text-primary"
                : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
            }`}
            onClick={() => setActiveTab("web")}
          >
            Web 权限
          </button>
        </div>

        {/* 权限内容 */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center text-neutral-400">
              正在加载权限数据...
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-neutral-100 bg-neutral-50/50 p-4">
              {activeTab === "admin" ? (
                <PermissionTree
                  permissions={adminTree}
                  selectedIds={selectedAdminIds}
                  onChange={handleAdminChange}
                />
              ) : (
                <PermissionTree
                  permissions={webTree}
                  selectedIds={selectedWebIds}
                  onChange={handleWebChange}
                />
              )}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Button variant="primary" onClick={() => onOpenChange(false)}>
            确认
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const PermissionAssignModal = memo(PermissionAssignModalComponent);
