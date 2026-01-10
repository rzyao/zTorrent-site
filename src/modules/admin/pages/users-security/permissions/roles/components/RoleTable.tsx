import React from "react";
import { Card, Table, Typography, Tag, Space, Button } from "antd";
import { SafetyOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatDate } from "@/modules/admin/utils/formatDate";
import type { Role } from "../types";

interface RoleTableProps {
  roles: Role[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  setPage: (p: number) => void;
  searchText: string;
  onAssignPermissions: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}

export const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  loading,
  page,
  pageSize,
  total,
  setPage,
  searchText,
  onAssignPermissions,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "角色名称",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: "角色�?,
      dataIndex: "key",
      key: "key",
      render: (k: string) => <Typography.Text code>{k || "-"}</Typography.Text>,
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <Typography.Text type="secondary">{text}</Typography.Text>,
    },
    {
      title: "权限数量",
      dataIndex: "permissions_count",
      key: "permissions_count",
      render: (count: number) => <Tag color="blue">{count ?? 0} 项权�?/Tag>,
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      render: (t: string) => <Typography.Text>{formatDate(t)}</Typography.Text>,
    },
    {
      title: "操作",
      key: "actions",
      align: "right" as const,
      render: (_: unknown, role: Role) => (
        <Space>
          <Button type="link" icon={<SafetyOutlined />} onClick={() => onAssignPermissions(role)}>
            分配权限
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(role)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => onDelete(role.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Table
        bordered
        rowKey="id"
        columns={columns as any}
        dataSource={roles}
        loading={loading}
        pagination={{ current: page, pageSize, total, onChange: setPage }}
        locale={{
          emptyText: searchText ? "没有找到匹配的角�? : "暂无角色，点击上方按钮添�?,
        }}
      />
    </Card>
  );
};
