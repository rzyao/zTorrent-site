import { useMemo } from "react";
import { Tree, Space, Typography } from "antd";
import { Tag } from "@/modules/admin/components/ui/tag";
import { Permission } from "../types";
import { getTypeTagColor, getTypeLabel } from "../constants";

interface PermissionTreeProps {
  permissions: Permission[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

/**
 * 外部组件使用的权限树 (主要用于角色权限分配)
 */
export default function PermissionTree({
  permissions,
  selectedIds,
  onChange,
}: PermissionTreeProps) {
  const treeData = useMemo(() => {
    const build = (items: Permission[]): any[] => {
      return items.map((p) => ({
        key: p.id,
        title: (
          <Space size={8}>
            <Typography.Text>{p.name}</Typography.Text>
            <Tag color={getTypeTagColor(p.type)}>{getTypeLabel(p.type)}</Tag>
            <Typography.Text code className="text-xs">
              {p.key}
            </Typography.Text>
          </Space>
        ),
        children: p.children ? build(p.children) : undefined,
      }));
    };
    return build(permissions);
  }, [permissions]);

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3">
      <Tree
        showLine={{ showLeafIcon: false }}
        blockNode
        checkable
        defaultExpandAll
        checkedKeys={selectedIds}
        onCheck={(checkedKeys) => {
          const keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
          onChange((keys as (string | number)[]).map(String));
        }}
        treeData={treeData}
        className="scroll-area max-h-[500px] overflow-auto"
      />
    </div>
  );
}
