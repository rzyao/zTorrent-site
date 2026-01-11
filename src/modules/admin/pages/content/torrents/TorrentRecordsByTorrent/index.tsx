import { Button, Card, Input, Pagination, Space, Typography } from "antd";
import { useTorrentRecordsLogic } from "./hooks/useTorrentRecordsLogic";
import { RecordsTable } from "../RecordsShared/RecordsTable";
import { RecordsTabs } from "../RecordsShared/RecordsTabs";

export default function TorrentRecordsByTorrent() {
  const {
    torrentId,
    setTorrentId,
    loading,
    items,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    tab,
    setTab,
    load,
  } = useTorrentRecordsLogic();

  const tabItems = [
    { key: "completed", label: "已下载种子" },
    { key: "published", label: "已发布" },
    { key: "seeding", label: "做种中" },
    { key: "downloading", label: "下载中" },
    { key: "incomplete", label: "未完成" },
  ] as any;

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Space>
            <Typography.Text>种子ID：</Typography.Text>
            <Input
              size="large"
              value={torrentId}
              onChange={(e) => setTorrentId(e.target.value)}
              style={{ width: 220 }}
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

      <RecordsTabs
        activeKey={tab}
        onChange={(k) => {
          setTab(k);
          setPage(1);
        }}
        items={tabItems}
      />

      <Card>
        <RecordsTable
          loading={loading}
          items={items}
          emptyText={torrentId ? "暂无下载记录" : "请输入种子ID后查询"}
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
