import React from "react";
import { Card, Table, Pagination, Tag, Typography, Space, Button } from "antd";
import { EditOutlined, SafetyOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatDate } from "@/modules/admin/utils/formatDate";
import type { LevelItem } from "../types";

interface LevelTableProps {
  levels: LevelItem[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  setPage: (p: number) => void;
  setPageSize: (ps: number) => void;
  searchKey: string;
  searchLabel: string;
  can: (perm: string) => boolean;
  onShowDetail: (id: string) => void;
  onEdit: (it: LevelItem) => void;
  onAssignPermissions: (it: LevelItem) => void;
  onDelete: (id: string) => void;
}

export const LevelTable: React.FC<LevelTableProps> = ({
  levels,
  loading,
  page,
  pageSize,
  total,
  setPage,
  setPageSize,
  searchKey,
  searchLabel,
  can,
  onShowDetail,
  onEdit,
  onAssignPermissions,
  onDelete,
}) => {
  const columns = [
    {
      title: "等级键",
      dataIndex: "key",
      key: "key",
      render: (k: string) => <Typography.Text code>{k}</Typography.Text>,
    },
    { title: "显示名称", dataIndex: "label", key: "label" },
    {
      title: "排序权重",
      dataIndex: "rank",
      key: "rank",
      render: (r: number) => r ?? "-",
    },
    {
      title: "状态",
      dataIndex: "isActive",
      key: "isActive",
      render: (v: boolean) => <Tag color={v ? "green" : "red"}>{v ? "启用" : "停用"}</Tag>,
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      render: (t: string) => <Typography.Text type="secondary">{t || "-"}</Typography.Text>,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (t: string) => <Typography.Text>{formatDate(t)}</Typography.Text>,
    },
    {
      title: "操作",
      key: "actions",
      align: "right" as const,
      render: (_: unknown, it: LevelItem) => (
        <Space>
          <Button type="link" onClick={() => onShowDetail(it.id)}>
            详情
          </Button>
          {can("admin/levels/update") ? (
            <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(it)}>
              编辑
            </Button>
          ) : (
            <Button type="link" disabled icon={<EditOutlined />}>
              编辑
            </Button>
          )}
          <Button type="link" icon={<SafetyOutlined />} onClick={() => onAssignPermissions(it)}>
            分配权限
          </Button>
          {can("admin/levels/delete") ? (
            <Button type="link" danger icon={<DeleteOutlined />} onClick={() => onDelete(it.id)}>
              删除
            </Button>
          ) : (
            <Button type="link" danger disabled icon={<DeleteOutlined />}>
              删除
            </Button>
          )}
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
        dataSource={levels}
        loading={loading}
        pagination={false}
        locale={{
          emptyText: searchKey || searchLabel ? "没有找到匹配的等级" : "暂无等级，点击上方按钮添加",
        }}
      />
      <div style={{ height: 12 }} />
      <Pagination
        current={page}
        pageSize={pageSize}
        total={total}
        showSizeChanger
        onChange={(p, ps) => {
          setPage(p);
          setPageSize(ps);
        }}
      />
    </Card>
  );
};
