import { useState } from "react";
import { DataTable, Column } from "@/modules/admin/components/ui/data-table";
import { Tag } from "@/modules/admin/components/ui/tag";
import { Button } from "@/modules/admin/components/ui/button";
import { SearchInput } from "@/modules/admin/components/ui/search-input";
import { Modal } from "@/modules/admin/components/ui/modal";
import { Edit2, Trash2, ShieldCheck, Plus } from "lucide-react";
import { formatDate } from "@/modules/admin/utils/formatDate";
import type { Role } from "../types";

interface RoleTableProps {
  data: Role[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  searchText: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onAssignPermissions: (role: Role) => void;
}

export const RoleTable = ({
  data,
  loading,
  page,
  pageSize,
  total,
  searchText,
  onSearchChange,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
  onAssignPermissions,
}: RoleTableProps) => {
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const confirmDelete = () => {
    if (deletingRole) {
      onDelete(deletingRole);
      setDeletingRole(null);
    }
  };

  const columns: Column<Role>[] = [
    {
      key: "name",
      title: "角色名称",
      render: (_, record) => <span>{record.name}</span>,
    },
    {
      key: "key",
      title: "标识 (Key)",
      render: (_, record) => <Tag color="geekblue">{record.key}</Tag>,
    },
    {
      key: "description",
      title: "描述",
      width: 300,
      ellipsis: true,
      render: (_, record) => (
        <span className="text-muted-foreground">{record.description || "-"}</span>
      ),
    },
    {
      key: "permissions_count",
      title: "权限数",
      render: (_, record) => (
        <Tag color={record.permissions_count > 0 ? "blue" : "default"}>
          {record.permissions_count} 项
        </Tag>
      ),
    },
    {
      key: "created_at",
      title: "创建时间",
      render: (_, record) => <span>{formatDate(record.created_at)}</span>,
    },
    {
      key: "actions",
      title: "操作",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="link"
            size="sm"
            onClick={() => onAssignPermissions(record)}
            icon={<ShieldCheck className="h-4 w-4" />}
          >
            分配权限
          </Button>
          <Button
            variant="link"
            size="sm"
            onClick={() => onEdit(record)}
            icon={<Edit2 className="h-4 w-4" />}
          >
            编辑
          </Button>
          <Button
            variant="link"
            size="sm"
            danger
            onClick={() => setDeletingRole(record)}
            icon={<Trash2 className="h-4 w-4" />}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (p) => onPageChange(p),
        }}
        toolbarLeft={
          <div className="w-80">
            <SearchInput
              placeholder="搜索角色名称..."
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        }
        toolbarRight={
          <Button variant="primary" onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            添加角色
          </Button>
        }
      />

      <Modal
        title="确认删除"
        open={!!deletingRole}
        onClose={() => setDeletingRole(null)}
        onOk={confirmDelete}
        okText="确认删除"
        cancelText="取消"
        width={400}
        okButtonProps={{ danger: true }}
      >
        <div className="py-4">
          确定要删除角色 <span className="font-bold">{deletingRole?.name}</span> 吗？
          <div className="mt-2 text-sm text-red-500">此操作无法撤销。</div>
        </div>
      </Modal>
    </>
  );
};
