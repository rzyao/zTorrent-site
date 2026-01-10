import { formatDate } from "@/modules/admin/utils/formatDate";
import { Button, Popconfirm, Space, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { CategoryItem } from "./types";

interface GetCategoryColumnsProps {
  onEdit: (record: CategoryItem) => void;
  onAddSub: (id: string) => void;
  onRemove: (id: string) => void;
  onToggleEnabled: (record: CategoryItem, v: boolean) => void;
  onToggleDefault: (record: CategoryItem, v: boolean) => void;
}

export const getCategoryColumns = (props: GetCategoryColumnsProps): ColumnsType<CategoryItem> => {
  return [
    {
      title: "键",
      dataIndex: "key",
    },
    {
      title: "名称",
      dataIndex: "label",
    },
    {
      title: "描述",
      dataIndex: "description",
    },
    {
      title: "启用",
      dataIndex: "enabled",
      width: 80,
      render: (_: any, record: CategoryItem) => {
        return (
          <Switch
            checked={Boolean(record.enabled)}
            onChange={(v: boolean) => props.onToggleEnabled(record, v)}
          />
        );
      },
    },
    {
      title: "默认显示",
      dataIndex: "isDefault",
      width: 100,
      render: (_: any, record: CategoryItem) => {
        return (
          <Switch
            checked={Boolean(record.isDefault)}
            onChange={(v: boolean) => props.onToggleDefault(record, v)}
          />
        );
      },
    },
    {
      title: "排序",
      dataIndex: "sort",
      width: 80,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      width: 180,
      render: (t: string) => formatDate(t),
    },
    {
      title: "操作",
      width: 200,
      fixed: "right",
      render: (_: any, record: CategoryItem) => {
        return (
          <Space>
            <Button type="link" size="small" onClick={() => props.onEdit(record)}>
              编辑
            </Button>
            <Button type="link" size="small" onClick={() => props.onAddSub(record.id!)}>
              子类
            </Button>
            <Popconfirm title="确认删除该分类？" onConfirm={() => props.onRemove(record.id!)}>
              <Button type="link" size="small" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
};
