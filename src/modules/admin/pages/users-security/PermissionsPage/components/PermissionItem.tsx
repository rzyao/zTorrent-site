import { Button } from "@/modules/admin/components/ui/button";
import { Tag } from "@/modules/admin/components/ui/tag";
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, FolderOpen } from "lucide-react";
import { Permission } from "../types";
import { getTypeTagColor, getTypeLabel } from "../constants";
import { cn } from "@/utils/cn";

interface PermissionItemProps {
  permission: Permission;
  level: number;
  expanded: boolean;
  onToggleExpand: (id: string) => void;
  onAdd: (parent: Permission) => void;
  onEdit: (item: Permission) => void;
  onDelete: (id: string) => void;
  showExpand?: boolean;
}

export function PermissionItem({
  permission,
  level,
  expanded,
  onToggleExpand,
  onAdd,
  onEdit,
  onDelete,
  showExpand = true,
}: PermissionItemProps) {
  const hasChildren = permission.children && permission.children.length > 0;
  const indent = level * 24;

  return (
    <div
      className={cn(
        "group flex items-center gap-2 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-900/50",
      )}
      style={{ paddingLeft: indent + 16 }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {showExpand ? (
          hasChildren ? (
            <Button
              variant="text"
              size="sm"
              className="text-muted-foreground flex h-6 w-6 items-center justify-center p-0"
              onClick={() => onToggleExpand(permission.id)}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-6" />
          )
        ) : null}

        <FolderOpen className="h-5 w-5 shrink-0 text-gray-400" />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-foreground font-medium">{permission.name}</span>
            <Tag color={getTypeTagColor(permission.type)} className="h-5 px-1 text-[10px]">
              {getTypeLabel(permission.type)}
            </Tag>
            <span className="text-muted-foreground bg-muted rounded px-1 font-mono text-xs">
              {permission.key}
            </span>
          </div>
          {permission.description && (
            <div className="text-muted-foreground truncate text-xs" title={permission.description}>
              {permission.description}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="link" size="sm" onClick={() => onAdd(permission)}>
          <Plus className="mr-1 h-3 w-3" />
          子权限
        </Button>
        <Button variant="link" size="sm" onClick={() => onEdit(permission)}>
          <Edit2 className="mr-1 h-3 w-3" />
          编辑
        </Button>
        <Button variant="link" size="sm" danger onClick={() => onDelete(permission.id)}>
          <Trash2 className="mr-1 h-3 w-3" />
          删除
        </Button>
      </div>
    </div>
  );
}
