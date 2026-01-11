import { Card, Pagination, Space } from "antd";
import { useDownloadRecordsLogic } from "./hooks/useDownloadRecordsLogic";
import { RecordsToolbar } from "./components/RecordsToolbar";
import { RecordsTable } from "../RecordsShared/RecordsTable";
import { RecordsTabs } from "../RecordsShared/RecordsTabs";

export default function TorrentDownloadRecords() {
  const {
    loading,
    items,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    tab,
    setTab,
    torrentId,
    setTorrentId,
    userId,
    setUserId,
    load,
  } = useDownloadRecordsLogic();

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <RecordsToolbar
        torrentId={torrentId}
        setTorrentId={setTorrentId}
        userId={userId}
        setUserId={setUserId}
        onSearch={() => {
          setPage(1);
          load();
        }}
      />

      <RecordsTabs
        activeKey={tab}
        onChange={(k) => {
          setTab(k);
          setPage(1);
        }}
      />

      <Card>
        <RecordsTable loading={loading} items={items} />
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
