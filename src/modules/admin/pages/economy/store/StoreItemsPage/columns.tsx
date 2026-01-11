import { Popconfirm } from "antd";
import { StoreItem } from "@/modules/admin/types/store";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { Column } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { Tag } from "@/modules/admin/components/ui/tag";

interface GetColumnsProps {
  openEdit: (record: StoreItem) => void;
  handleDelete: (record: StoreItem) => void;
  handleToggle: (record: StoreItem, toActive: boolean) => void;
}

export function getColumns({
  openEdit,
  handleDelete,
  handleToggle,
}: GetColumnsProps): Column<StoreItem>[] {
  return [
    { key: "key", title: "Key", dataIndex: "key", width: 160 },
    { key: "title", title: "名称", dataIndex: "title" },
    {
      key: "type",
      title: "类型",
      dataIndex: "type",
      width: 140,
      render: (t: StoreItem["type"]) => <Tag>{t || "unknown"}</Tag>,
    },
    { key: "pricePoints", title: "价格(魔力)", dataIndex: "pricePoints", width: 140 },
    { key: "stock", title: "库存", dataIndex: "stock", width: 120, render: (v) => v ?? "-" },
    {
      key: "status",
      title: "状态",
      dataIndex: "status",
      width: 120,
      render: (s: StoreItem["status"]) => (
        <Tag variant={s === "active" ? "success" : "default"}>
          {s === "active" ? "已上架" : "已下架"}
        </Tag>
      ),
    },
    {
      key: "updatedAt",
      title: "更新时间",
      dataIndex: "updatedAt",
      width: 200,
      render: (t: string) => formatDate(t),
    },
    {
      key: "actions",
      title: "操作",
      width: 220,
      align: "center",
      render: (_, record: StoreItem) => (
        <div className="flex items-center justify-center space-x-2">
          <Button variant="link" size="sm" className="h-auto p-0" onClick={() => openEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title={`确认删除商品 ${record.title}？`}
            onConfirm={() => handleDelete(record)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button
              variant="link"
              size="sm"
              className="text-destructive hover:text-destructive/80 h-auto p-0"
            >
              删除
            </Button>
          </Popconfirm>
          {record.status === "active" ? (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => handleToggle(record, false)}
            >
              下架
            </Button>
          ) : (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => handleToggle(record, true)}
            >
              上架
            </Button>
          )}
        </div>
      ),
    },
  ];
}
