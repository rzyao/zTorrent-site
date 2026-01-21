import { useMemo } from "react";
import { DataTable, Column } from "@/modules/admin/components/ui/data-table";
import { Tag } from "@/modules/admin/components/ui/tag";
import { RecordItem } from "./types";

interface RecordsTableProps {
  loading: boolean;
  items: RecordItem[];
  emptyText?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  /** 工具栏插槽 (放置于 DataTable 的 toolbarLeft) */
  toolbarSlot?: React.ReactNode;
}

/**
 * 下载记录表格组件 (使用 Admin UI DataTable)
 * 用于展示种子下载/做种/上传等记录
 */
export const RecordsTable = ({
  loading,
  items,
  emptyText = "暂无记录",
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  toolbarSlot,
}: RecordsTableProps) => {
  // 表格列配置
  const columns = useMemo<Column<RecordItem>[]>(
    () => [
      {
        key: "username",
        title: "用户名",
        width: 120,
        render: (_, it) => String(it.username || it.user?.username || it.userName || "-"),
      },
      {
        key: "title",
        title: "种子标题",
        render: (_, it) => String(it.title || it.torrentTitle || it.name || it.torrentName || "-"),
      },
      {
        key: "status",
        title: "状态",
        width: 100,
        align: "center",
        render: (_, it) => {
          const s = String(it.status || it.state || it.phase || "");
          const variant =
            s === "completed"
              ? "success"
              : s === "downloading"
                ? "primary"
                : s === "seeding"
                  ? "cyan"
                  : s
                    ? "warning"
                    : "default";
          return <Tag color={variant}>{s || "-"}</Tag>;
        },
      },
      {
        key: "progress",
        title: "进度",
        width: 80,
        align: "center",
        render: (_, it) => {
          const v =
            typeof it.progress === "number"
              ? it.progress
              : typeof it.percent === "number"
                ? it.percent
                : undefined;
          return v === undefined ? "-" : `${Math.round(v * (v <= 1 ? 100 : 1))}%`;
        },
      },
      {
        key: "uploaded",
        title: "上传",
        width: 100,
        align: "right",
        render: (_, it) => String(it.uploaded || it.up || "-"),
      },
      {
        key: "downloaded",
        title: "下载",
        width: 100,
        align: "right",
        render: (_, it) => String(it.downloaded || it.down || "-"),
      },
      {
        key: "speed",
        title: "速度",
        width: 100,
        align: "right",
        render: (_, it) => String(it.speed || it.downloadSpeed || it.uploadSpeed || "-"),
      },
      {
        key: "client",
        title: "客户端",
        width: 120,
        render: (_, it) => String(it.client || it.clientName || "-"),
      },
      {
        key: "createdAt",
        title: "创建时间",
        width: 160,
        render: (_, it) => String(it.createdAt || it.created_at || "-"),
      },
      {
        key: "updatedAt",
        title: "更新时间",
        width: 160,
        render: (_, it) => String(it.updatedAt || it.updated_at || "-"),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      dataSource={items}
      rowKey={(it) =>
        String(it.tid || it.torrentId || it.infoHash || it.createdAt || Math.random())
      }
      loading={loading}
      emptyText={emptyText}
      toolbarLeft={toolbarSlot}
      pagination={
        onPageChange
          ? {
              current: page,
              pageSize: pageSize,
              total: total || items.length,
              onChange: onPageChange,
            }
          : undefined
      }
    />
  );
};
