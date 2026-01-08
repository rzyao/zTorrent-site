import { useMemo } from 'react';
import { Tree, Tag, Typography, Space } from 'antd';
import type { Permission, PermissionType } from './types/permission';

interface PermissionTreeProps {
  permissions: Permission[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export default function PermissionTree({ permissions, selectedIds, onChange }: PermissionTreeProps) {
  const getTypeColor = (type: PermissionType) => {
    switch (type) {
      case 'page': return 'blue';
      case 'button': return 'green';
      case 'api': return 'purple';
      default: return 'default';
    }
  };

  const treeData = useMemo(() => {
    const build = (items: Permission[]): any[] => {
      return items.map((p) => ({
        key: p.id,
        title: (
          <Space size={8}>
            <Typography.Text>{p.name}</Typography.Text>
            <Tag color={getTypeColor(p.type)}>{p.type === 'page' ? '页面' : p.type === 'button' ? '按钮' : p.type === 'api' ? '接口' : p.type}</Tag>
            <Typography.Text code>{p.key}</Typography.Text>
          </Space>
        ),
        children: p.children ? build(p.children) : undefined,
      }));
    };
    return build(permissions);
  }, [permissions]);

  return (
    <div>
      <Tree
        showLine
        blockNode
        checkable
        defaultExpandAll
        checkedKeys={selectedIds}
        onCheck={(checkedKeys) => {
          const keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
          onChange((keys as (string | number)[]).map(String));
        }}
        treeData={treeData}
        style={{ maxHeight: 500, overflow: 'auto', background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #eee' }}
      />
    </div>
  );
}
