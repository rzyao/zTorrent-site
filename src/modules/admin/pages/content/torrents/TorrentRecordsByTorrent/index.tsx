import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { Search } from "lucide-react";
import { useTorrentRecordsLogic } from "./hooks/useTorrentRecordsLogic";
import { RecordsTable } from "../RecordsShared/RecordsTable";
import { RecordsTabs } from "../RecordsShared/RecordsTabs";

/**
 * 按种子查询下载记录页面
 * 输入种子ID查看该种子的下载/做种记录
 */
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

  // Tab 自定义项
  const tabItems = [
    { key: "completed", label: "已下载种子" },
    { key: "published", label: "已发布" },
    { key: "seeding", label: "做种中" },
    { key: "downloading", label: "下载中" },
    { key: "incomplete", label: "未完成" },
  ] as const;

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

  // 回车触发搜索
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
        items={tabItems as any}
      />

      {/* 数据表格 (带内置 Toolbar 和 Pagination) */}
      <RecordsTable
        loading={loading}
        items={items}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        emptyText={torrentId ? "暂无下载记录" : "请输入种子ID后查询"}
        toolbarSlot={
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">种子ID：</span>
            <div className="flex">
              <Input
                placeholder="输入种子ID"
                value={torrentId}
                onChange={(e) => setTorrentId(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-52 rounded-r-none"
              />
              <Button variant="primary" className="-ml-px rounded-l-none" onClick={handleSearch}>
                <Search className="mr-1 h-4 w-4" />
                查询
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}
