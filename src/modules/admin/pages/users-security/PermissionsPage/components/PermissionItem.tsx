import { Button, Typography, Popconfirm, Space } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  RightOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { Tag } from "@/modules/admin/components/ui/tag";
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
        "group flex items-center gap-2 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50/50",
      )}
      style={{ paddingLeft: indent + 16 }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {showExpand ? (
          hasChildren ? (
            <Button
              type="text"
              size="small"
              className="flex h-6 w-6 items-center justify-center p-0"
              icon={
                expanded ? (
                  <DownOutlined className="text-xs" />
                ) : (
                  <RightOutlined className="text-xs" />
                )
              }
              onClick={() => onToggleExpand(permission.id)}
            />
          ) : (
            <div className="w-6" />
          )
        ) : null}

        <FolderOutlined className="flex-shrink-0 text-lg text-gray-400" />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-900">{permission.name}</span>
            <Tag color={getTypeTagColor(permission.type)}>{getTypeLabel(permission.type)}</Tag>
            <Typography.Text code className="text-xs">
              {permission.key}
            </Typography.Text>
          </div>
          {permission.description && (
            <div className="truncate text-xs text-gray-500" title={permission.description}>
              {permission.description}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button type="link" size="small" icon={<PlusOutlined />} onClick={() => onAdd(permission)}>
          子权限
        </Button>
        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(permission)}>
          编辑
        </Button>
        <Popconfirm
          title="确定删除这个权限吗？"
          description="所有关联的子权限也会被永久删除。"
          onConfirm={() => onDelete(permission.id)}
          okText="确认删除"
          cancelText="取消"
          okButtonProps={{ danger: true }}
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
}
