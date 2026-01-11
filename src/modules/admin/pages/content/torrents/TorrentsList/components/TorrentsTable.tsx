import { useState, useMemo } from "react";
import { AdminListTorrentsDto } from "@/api/models/AdminListTorrentsDto";
import { formatBytes } from "@/modules/admin/utils/formatBytes";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { DataTable, Column, SortOrder } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { Tag } from "tag";
import { ConfirmModal } from "@/modules/admin/components/ui/modal";
import { TorrentItem } from "../types";

interface TorrentsTableProps {
  loading: boolean;
  items: TorrentItem[];
  page: number;
  limit: number;
  total: number;
  sortBy: AdminListTorrentsDto["sortBy"] | undefined;
  sortOrder: AdminListTorrentsDto["order"] | undefined;
  onSortChange: (
    sortBy: AdminListTorrentsDto["sortBy"] | undefined,
    order: AdminListTorrentsDto["order"] | undefined,
  ) => void;
  onPageChange: (page: number, pageSize: number) => void;
  /** 工具栏左侧内容 */
  toolbarLeft?: React.ReactNode;
  /** 工具栏右侧内容 */
  toolbarRight?: React.ReactNode;
  onDetail: (id: string) => void;
  onRemove: (id: string) => void;
  /** 行选择配置 */
  selectedRowKeys: string[];
  onSelectionChange: (keys: string[]) => void;
}

// 将 API 排序参数映射到列 key
const sortByToColumnKey: Record<string, string> = {
  [AdminListTorrentsDto.sortBy.SIZE]: "size",
  [AdminListTorrentsDto.sortBy.SEEDERS]: "seeders",
  [AdminListTorrentsDto.sortBy.DOWNLOADS]: "completed",
  [AdminListTorrentsDto.sortBy.UPLOADED_AT]: "createdAt",
};

// 将列 key 映射回 API 排序参数
const columnKeyToSortBy: Record<string, AdminListTorrentsDto["sortBy"]> = {
  size: AdminListTorrentsDto.sortBy.SIZE,
  seeders: AdminListTorrentsDto.sortBy.SEEDERS,
  completed: AdminListTorrentsDto.sortBy.DOWNLOADS,
  createdAt: AdminListTorrentsDto.sortBy.UPLOADED_AT,
};

/**
 * 种子列表表格组件
 * 使用项目标准的 DataTable 组件，完全移除 AntD 依赖
 */
export const TorrentsTable = ({
  loading,
  items,
  page,
  limit,
  total,
  sortBy,
  sortOrder,
  onSortChange,
  onPageChange,
  toolbarLeft,
  toolbarRight,
  onDetail,
  onRemove,
  selectedRowKeys,
  onSelectionChange,
}: TorrentsTableProps) => {
  // 删除确认弹窗状态
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // 处理删除确认
  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onRemove(deleteTarget);
      setDeleteTarget(null);
      setDeleteModalOpen(false);
    }
  };

  // 获取列的当前排序方向
  const getColumnSortOrder = (columnKey: string): SortOrder => {
    if (!sortBy) return null;
    const currentKey = sortByToColumnKey[sortBy];
    if (currentKey !== columnKey) return null;
    if (sortOrder === "ASC") return "asc";
    if (sortOrder === "DESC") return "desc";
    return null;
  };

  // 处理排序变化
  const handleSortChange = (columnKey: string, order: SortOrder) => {
    if (order === null) {
      onSortChange(undefined, undefined);
    } else {
      const apiSortBy = columnKeyToSortBy[columnKey];
      const apiOrder =
        order === "asc" ? AdminListTorrentsDto.order.ASC : AdminListTorrentsDto.order.DESC;
      onSortChange(apiSortBy, apiOrder);
    }
  };

  // 表格列定义
  const columns = useMemo<Column<TorrentItem>[]>(
    () => [
      {
        key: "id",
        title: "ID",
        dataIndex: "id",
        width: 140,
      },
      {
        key: "category",
        title: "分类",
        dataIndex: "category",
        width: 100,
        render: (text: string) => <Tag>{text || "-"}</Tag>,
      },
      {
        key: "title",
        title: "标题",
        dataIndex: "title",
        width: 200,
      },
      {
        key: "size",
        title: "大小",
        dataIndex: "size",
        width: 100,
        sorter: true,
        sortOrder: getColumnSortOrder("size"),
        render: (size: number) => formatBytes(size || 0),
      },
      {
        key: "seeders",
        title: "做种",
        dataIndex: "seeders",
        width: 80,
        align: "center",
        sorter: true,
        sortOrder: getColumnSortOrder("seeders"),
      },
      {
        key: "completed",
        title: "完成",
        dataIndex: "completed",
        width: 80,
        align: "center",
        sorter: true,
        sortOrder: getColumnSortOrder("completed"),
      },
      {
        key: "createdAt",
        title: "添加时间",
        dataIndex: "createdAt",
        width: 160,
        sorter: true,
        sortOrder: getColumnSortOrder("createdAt"),
        render: (date: string) => formatDate(date),
      },
      {
        key: "uploader",
        title: "发布者",
        dataIndex: "uploader",
        width: 120,
      },
      {
        key: "approvalStatus",
        title: "审核状态",
        dataIndex: "approvalStatus",
        width: 100,
        render: (text: string) => {
          const variantMap: Record<string, "success" | "error" | "gold"> = {
            approved: "success",
            rejected: "error",
            pending: "gold",
          };
          const labelMap: Record<string, string> = {
            approved: "已通过",
            rejected: "已驳回",
            pending: "待审核",
          };
          return <Tag variant={variantMap[text] || "default"}>{labelMap[text] || text || "-"}</Tag>;
        },
      },
      {
        key: "approvedAt",
        title: "通过时间",
        dataIndex: "approvedAt",
        width: 160,
        render: (date: string) => formatDate(date),
      },
      {
        key: "visible",
        title: "可见",
        dataIndex: "visible",
        width: 70,
        render: (v: boolean) => <Tag variant={v ? "success" : "error"}>{v ? "是" : "否"}</Tag>,
      },
      {
        key: "actions",
        title: "操作",
        width: 100,
        render: (_: any, record: TorrentItem) => (
          <div className="flex items-center gap-1">
            <Button variant="link" onClick={() => onDetail(record.id!)}>
              详情
            </Button>
            <Button
              variant="link"
              danger
              onClick={() => {
                setDeleteTarget(record.id!);
                setDeleteModalOpen(true);
              }}
            >
              删除
            </Button>
          </div>
        ),
      },
    ],
    [sortBy, sortOrder, onDetail],
  );

  return (
    <>
      <DataTable
        columns={columns}
        dataSource={items}
        rowKey="id"
        loading={loading}
        toolbarLeft={toolbarLeft}
        toolbarRight={toolbarRight}
        onSortChange={handleSortChange}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectionChange,
        }}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          onChange: onPageChange,
        }}
      />

      {/* 删除确认弹窗 */}
      <ConfirmModal
        open={deleteModalOpen}
        title="确认删除"
        content="确定要删除该种子吗？此操作不可撤销。"
        okText="删除"
        cancelText="取消"
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
      />
    </>
  );
};
