import { useMemo } from "react";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AdminListTorrentsDto } from "@/api/models/AdminListTorrentsDto";
import { ReviewDto } from "@/api/models/ReviewDto";
import { formatBytes } from "@/modules/admin/utils/formatBytes";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { TorrentItem, SortOrderLocal } from "../types";

interface TorrentsTableProps {
  loading: boolean;
  items: TorrentItem[];
  sortBy: AdminListTorrentsDto["sortBy"] | undefined;
  sortOrder: AdminListTorrentsDto["order"] | undefined;
  onSortChange: (
    sortBy: AdminListTorrentsDto["sortBy"] | undefined,
    order: AdminListTorrentsDto["order"] | undefined,
  ) => void;
  tableScrollY: number | undefined;
  onDetail: (id: string) => void;
  onDownload: (id: string) => void;
  onEdit: (record: TorrentItem) => void;
  onRemove: (id: string) => void;
  onReview: (ids: string[], action: ReviewDto.action) => void;
  onRejectReview: (record: TorrentItem) => void;
}

export const TorrentsTable = ({
  loading,
  items,
  sortBy,
  sortOrder,
  onSortChange,
  tableScrollY,
  onDetail,
  onDownload,
  onEdit,
  onRemove,
  onReview,
  onRejectReview,
}: TorrentsTableProps) => {
  const columns = useMemo<ColumnsType<TorrentItem>>(
    () => [
      { title: "ID", dataIndex: "id", width: 80, ellipsis: true },
      {
        title: "分类",
        dataIndex: "category",
        width: 100,
        render: (text: string) => <Tag>{text}</Tag>,
      },
      { title: "标题", dataIndex: "title", ellipsis: true },
      {
        title: "大小",
        dataIndex: "size",
        width: 100,
        render: (size: number) => formatBytes(size || 0),
        sorter: true,
        sortOrder: (sortBy === AdminListTorrentsDto.sortBy.SIZE
          ? sortOrder === "ASC"
            ? "ascend"
            : sortOrder === "DESC"
              ? "descend"
              : null
          : null) as SortOrderLocal,
      },
      {
        title: "做种",
        dataIndex: "seeders",
        width: 80,
        align: "center" as const,
        sorter: true,
        sortOrder: (sortBy === AdminListTorrentsDto.sortBy.SEEDERS
          ? sortOrder === "ASC"
            ? "ascend"
            : sortOrder === "DESC"
              ? "descend"
              : null
          : null) as SortOrderLocal,
      },
      {
        title: "完成",
        dataIndex: "completed",
        width: 80,
        align: "center" as const,
        sorter: true,
        sortOrder: (sortBy === AdminListTorrentsDto.sortBy.DOWNLOADS
          ? sortOrder === "ASC"
            ? "ascend"
            : sortOrder === "DESC"
              ? "descend"
              : null
          : null) as SortOrderLocal,
      },
      {
        title: "添加时间",
        dataIndex: "createdAt",
        width: 160,
        render: (date: string) => formatDate(date),
        sorter: true,
        sortOrder: (sortBy === AdminListTorrentsDto.sortBy.UPLOADED_AT
          ? sortOrder === "ASC"
            ? "ascend"
            : sortOrder === "DESC"
              ? "descend"
              : null
          : null) as SortOrderLocal,
      },
      { title: "发布者", dataIndex: "uploader", width: 120 },
      {
        title: "审核状态",
        dataIndex: "approvalStatus",
        width: 120,
        render: (text: string) => (
          <Tag color={text === "approved" ? "green" : text === "rejected" ? "red" : "gold"}>
            {text || "-"}
          </Tag>
        ),
      },
      {
        title: "通过时间",
        dataIndex: "approvedAt",
        width: 160,
        render: (date: string) => formatDate(date),
        sorter: true,
        sortOrder: (sortBy === (AdminListTorrentsDto as any).sortBy.APPROVED_AT
          ? sortOrder === "ASC"
            ? "ascend"
            : sortOrder === "DESC"
              ? "descend"
              : null
          : null) as SortOrderLocal,
      },
      {
        title: "可见",
        dataIndex: "visible",
        width: 80,
        render: (v: boolean) => <Tag color={v ? "green" : "red"}>{String(v)}</Tag>,
      },
      {
        title: "操作",
        width: 200,
        render: (_: any, record: TorrentItem) => (
          <Space>
            <Button type="link" onClick={() => onDetail(record.id!)}>
              详情
            </Button>
            <Button type="link" onClick={() => onDownload(record.id!)}>
              下载
            </Button>
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Popconfirm title="确认删除该种子？" onConfirm={() => onRemove(record.id!)}>
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
            <Button type="link" onClick={() => onReview([record.id!], ReviewDto.action.APPROVE)}>
              通过
            </Button>
            <Button type="link" danger onClick={() => onRejectReview(record)}>
              驳回
            </Button>
          </Space>
        ),
      },
    ],
    [sortBy, sortOrder, onDetail, onDownload, onEdit, onRemove, onReview, onRejectReview],
  );

  return (
    <Table
      bordered
      rowKey="id"
      loading={loading}
      dataSource={items}
      pagination={false}
      scroll={{ x: "max-content", y: tableScrollY }}
      tableLayout="fixed"
      onChange={(_, __, sorter: any) => {
        const field = sorter?.field as string | undefined;
        const order = sorter?.order as "ascend" | "descend" | undefined;
        const fieldMap: Record<string, AdminListTorrentsDto["sortBy"]> = {
          createdAt: AdminListTorrentsDto.sortBy.UPLOADED_AT,
          size: AdminListTorrentsDto.sortBy.SIZE,
          seeders: AdminListTorrentsDto.sortBy.SEEDERS,
          completed: AdminListTorrentsDto.sortBy.DOWNLOADS,
        };
        const nextSortBy = field ? fieldMap[field] : undefined;
        const nextOrder: AdminListTorrentsDto["order"] | undefined = order
          ? order === "ascend"
            ? AdminListTorrentsDto.order.ASC
            : AdminListTorrentsDto.order.DESC
          : undefined;
        onSortChange(nextSortBy, nextOrder);
      }}
      columns={columns}
    />
  );
};
