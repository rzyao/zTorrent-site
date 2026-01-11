import { formatDate } from "@/modules/admin/utils/formatDate";
import { Button } from "@/modules/admin/components/ui/button";
import { Switch } from "@/modules/admin/components/ui/switch";
import { ConfirmModal } from "@/modules/admin/components/ui/modal";
import { TreeColumn } from "@/modules/admin/components/ui/tree-table";
import type { CategoryItem } from "./types";
import { useState } from "react";

interface GetCategoryColumnsProps {
  onEdit: (record: CategoryItem) => void;
  onAddSub: (id: string) => void;
  onRemove: (id: string) => void;
  onToggleEnabled: (record: CategoryItem, v: boolean) => void;
  onToggleDefault: (record: CategoryItem, v: boolean) => void;
}

/**
 * 删除确认按钮组件
 * 使用 Admin UI 的 ConfirmModal 替代 AntD Popconfirm
 */
function DeleteButton({
  record,
  onRemove,
}: {
  record: CategoryItem;
  onRemove: (id: string) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Button variant="link" size="sm" danger onClick={() => setConfirmOpen(true)}>
        删除
      </Button>
      <ConfirmModal
        open={confirmOpen}
        title="确认删除"
        content={`确定要删除分类 "${record.label}" 吗？此操作不可撤销。`}
        onClose={() => setConfirmOpen(false)}
        onOk={() => {
          onRemove(record.id!);
          setConfirmOpen(false);
        }}
        okText="删除"
        cancelText="取消"
      />
    </>
  );
}

export const getCategoryColumns = (props: GetCategoryColumnsProps): TreeColumn<CategoryItem>[] => {
  return [
    {
      title: "键",
      dataIndex: "key",
      key: "key",
      width: 200,
    },
    {
      title: "名称",
      dataIndex: "label",
      key: "label",
      width: 150,
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: 200,
      render: (val: string | null) => val || "-",
    },
    {
      title: "启用",
      dataIndex: "enabled",
      key: "enabled",
      width: 80,
      align: "center",
      render: (_: any, record: CategoryItem) => (
        <Switch
          checked={Boolean(record.enabled)}
          onCheckedChange={(v: boolean) => props.onToggleEnabled(record, v)}
        />
      ),
    },
    {
      title: "默认显示",
      dataIndex: "isDefault",
      key: "isDefault",
      width: 100,
      align: "center",
      render: (_: any, record: CategoryItem) => (
        <Switch
          checked={Boolean(record.isDefault)}
          onCheckedChange={(v: boolean) => props.onToggleDefault(record, v)}
        />
      ),
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
      width: 80,
      align: "center",
      render: (val: number) => <span className="font-mono text-neutral-600">{val ?? 0}</span>,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (t: string) => <span className="text-neutral-500">{formatDate(t)}</span>,
    },
    {
      title: "操作",
      key: "actions",
      width: 180,
      fixed: "right",
      align: "center",
      render: (_: any, record: CategoryItem) => (
        <div className="flex items-center justify-center gap-1">
          <Button variant="link" size="sm" onClick={() => props.onEdit(record)}>
            编辑
          </Button>
          <Button variant="link" size="sm" onClick={() => props.onAddSub(record.id!)}>
            子类
          </Button>
          <DeleteButton record={record} onRemove={props.onRemove} />
        </div>
      ),
    },
  ];
};
