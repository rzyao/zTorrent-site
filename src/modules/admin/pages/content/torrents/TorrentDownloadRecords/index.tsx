import { useDownloadRecordsLogic } from "./hooks/useDownloadRecordsLogic";
import { RecordsToolbar } from "./components/RecordsToolbar";
import { RecordsTable } from "../RecordsShared/RecordsTable";
import { RecordsTabs } from "../RecordsShared/RecordsTabs";

/**
 * 种子下载记录页面
 * 支持按种子ID、用户ID筛选，按状态Tab切换
 */
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

  // 处理搜索
  const handleSearch = () => {
    setPage(1);
    load();
  };

  // 处理分页变化
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Tab 切换 */}
      <RecordsTabs
        activeKey={tab}
        onChange={(k) => {
          setTab(k);
          setPage(1);
        }}
      />

      {/* 数据表格 (带内置 Toolbar 和 Pagination) */}
      <RecordsTable
        loading={loading}
        items={items}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        emptyText="暂无下载记录"
        toolbarSlot={
          <RecordsToolbar
            torrentId={torrentId}
            setTorrentId={setTorrentId}
            userId={userId}
            setUserId={setUserId}
            onSearch={handleSearch}
          />
        }
      />
    </div>
  );
}
