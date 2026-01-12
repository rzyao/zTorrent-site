import React, { useState } from "react";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Button } from "@/modules/admin/components/ui/button";
import PermissionTree from "@/modules/admin/pages/users-security/PermissionsPage/components/PermissionTree";
import { cn } from "@/utils/cn";
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
  const [activeTab, setActiveTab] = useState<"admin" | "web">("admin");

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
      title="分配权限"
      description={
        <span>
          角色：<span className="text-foreground font-medium">{selectedRole.name}</span>
          <span className="text-muted-foreground ml-2">(已选 {totalSelected} 项)</span>
        </span>
      }
      onClose={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="保存配置"
      width={900}
    >
      <div className="flex h-[600px] flex-col">
        {/* Tabs Header */}
        <div className="border-border flex border-b">
          <button
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              activeTab === "admin"
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
            onClick={() => setActiveTab("admin")}
          >
            Admin 权限 ({selectedAdminIds.length})
          </button>
          <button
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              activeTab === "web"
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
            onClick={() => setActiveTab("web")}
          >
            Web 权限 ({selectedWebIds.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-1">
          <div
            className={cn("h-full overflow-auto p-2", activeTab === "admin" ? "block" : "hidden")}
          >
            <PermissionTree
              permissions={permissionsAdmin}
              selectedIds={selectedAdminIds}
              onChange={setSelectedAdminIds}
            />
          </div>
          <div className={cn("h-full overflow-auto p-2", activeTab === "web" ? "block" : "hidden")}>
            <PermissionTree
              permissions={permissionsWeb}
              selectedIds={selectedWebIds}
              onChange={setSelectedWebIds}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
