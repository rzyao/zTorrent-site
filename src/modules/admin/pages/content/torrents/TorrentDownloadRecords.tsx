import { useEffect, useMemo, useState } from "react";
import { App, Card, Space, Typography, Table, Tag, Input, Pagination, Tabs, Button } from "antd";
import { TorrentsRecordService } from "@/api/services/TorrentsRecordService";

type RecordItem = Record<string, any>;

export default function TorrentDownloadRecordsPage() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RecordItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState<
    "published" | "seeding" | "downloading" | "completed" | "incomplete"
  >("published");
  const [torrentId, setTorrentId] = useState("");
  const [userId, setUserId] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const q = {
        limit: pageSize,
        page,
        torrentId: torrentId || undefined,
        userId: userId || undefined,
      } as any;

      let resp: any;
      if (tab === "published") {
        resp = await TorrentsRecordService.torrentRecordControllerFindPublished(q);
      } else if (tab === "seeding") {
        resp = await TorrentsRecordService.torrentRecordControllerFindSeeding(q);
      } else if (tab === "downloading") {
        resp = await TorrentsRecordService.torrentRecordControllerFindDownloading(q);
      } else if (tab === "completed") {
        resp = await TorrentsRecordService.torrentRecordControllerFindCompleted(q);
      } else {
        resp = await TorrentsRecordService.torrentRecordControllerFindIncomplete(q);
      }

      const data = resp?.data ?? resp;
      const list = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
          ? data
          : Array.isArray(resp?.items)
            ? resp.items
            : [];
      setItems(list);
      setTotal(Number(resp?.data?.total ?? resp?.total ?? list.length));
    } catch (e: any) {
      message.error(e?.message || "加载记录失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [tab, page, pageSize]);

  const filtered = useMemo(() => items, [items]);

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
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Space>
            <Typography.Text type="secondary">下载记录</Typography.Text>
            <Input
              size="large"
              allowClear
              placeholder="按种子ID"
              value={torrentId}
              onChange={(e) => {
                setTorrentId(e.target.value);
                setPage(1);
              }}
              style={{ width: 180 }}
            />
            <Input
              size="large"
              allowClear
              placeholder="按用户ID"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setPage(1);
              }}
              style={{ width: 180 }}
            />
            <Button
              type="primary"
              onClick={() => {
                setPage(1);
                load();
              }}
            >
              查询
            </Button>
          </Space>
        </Space>
      </Card>

      <Tabs
        activeKey={tab}
        onChange={(k) => {
          setTab(k as any);
          setPage(1);
        }}
        items={[
          { key: "published", label: "已发布" },
          { key: "seeding", label: "做种中" },
          { key: "downloading", label: "下载中" },
          { key: "completed", label: "已完成" },
          { key: "incomplete", label: "未完成" },
        ]}
      />

      <Card>
        <Table
          bordered
          rowKey={(it) =>
            String(it.tid || it.torrentId || it.infoHash || it.createdAt || Math.random())
          }
          columns={columns as any}
          dataSource={filtered}
          loading={loading}
          pagination={false}
          expandable={{
            expandedRowRender: (record) => (
              <pre style={{ margin: 0, maxHeight: "40vh", overflow: "auto" }}>
                {JSON.stringify(record, null, 2)}
              </pre>
            ),
          }}
          locale={{ emptyText: "暂无记录" }}
        />
        <div style={{ height: 12 }} />
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total || items.length}
          showSizeChanger
          onChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
        />
      </Card>
    </Space>
  );
}
