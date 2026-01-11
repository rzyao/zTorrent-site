import { Table, Tag } from "antd";
import { RecordItem } from "./types";

interface RecordsTableProps {
  loading: boolean;
  items: RecordItem[];
  emptyText?: string;
}

export const RecordsTable = ({ loading, items, emptyText = "暂无记录" }: RecordsTableProps) => {
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      render: (_: any, it: any) => String(it.username || it.user?.username || it.userName || "-"),
    },
    {
      title: "种子标题",
      dataIndex: "title",
      key: "title",
      render: (_: any, it: any) =>
        String(it.title || it.torrentTitle || it.name || it.torrentName || "-"),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (_: any, it: any) => {
        const s = String(it.status || it.state || it.phase || "");
        const color =
          s === "completed"
            ? "green"
            : s === "downloading"
              ? "blue"
              : s === "seeding"
                ? "geekblue"
                : s
                  ? "gold"
                  : "default";
        return <Tag color={color}>{s || "-"}</Tag>;
      },
    },
    {
      title: "进度",
      dataIndex: "progress",
      key: "progress",
      render: (_: any, it: any) => {
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
      title: "上传",
      dataIndex: "uploaded",
      key: "uploaded",
      render: (_: any, it: any) => String(it.uploaded || it.up || "-"),
    },
    {
      title: "下载",
      dataIndex: "downloaded",
      key: "downloaded",
      render: (_: any, it: any) => String(it.downloaded || it.down || "-"),
    },
    {
      title: "速度",
      dataIndex: "speed",
      key: "speed",
      render: (_: any, it: any) => String(it.speed || it.downloadSpeed || it.uploadSpeed || "-"),
    },
    {
      title: "客户端",
      dataIndex: "client",
      key: "client",
      render: (_: any, it: any) => String(it.client || it.clientName || "-"),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: any, it: any) => String(it.createdAt || it.created_at || "-"),
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (_: any, it: any) => String(it.updatedAt || it.updated_at || "-"),
    },
  ];

  return (
    <Table
      bordered
      rowKey={(it) =>
        String(it.tid || it.torrentId || it.infoHash || it.createdAt || Math.random())
      }
      columns={columns as any}
      dataSource={items}
      loading={loading}
      pagination={false}
      expandable={{
        expandedRowRender: (record) => (
          <pre style={{ margin: 0, maxHeight: "40vh", overflow: "auto" }}>
            {JSON.stringify(record, null, 2)}
          </pre>
        ),
      }}
      locale={{ emptyText }}
    />
  );
};
