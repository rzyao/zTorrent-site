import { Button } from "@/modules/admin/components/ui/button";
import { Input } from "@/modules/admin/components/ui/input";
import { Search } from "lucide-react";

interface RecordsToolbarProps {
  torrentId: string;
  setTorrentId: (v: string) => void;
  userId: string;
  setUserId: (v: string) => void;
  onSearch: () => void;
}

/**
 * 下载记录查询工具栏
 * 支持按种子ID和用户ID筛选
 */
export const RecordsToolbar = ({
  torrentId,
  setTorrentId,
  userId,
  setUserId,
  onSearch,
}: RecordsToolbarProps) => {
  // 回车触发搜索
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <>
      {/* 种子ID 搜索框 */}
      <div className="flex">
        <Input
          placeholder="按种子ID筛选"
          value={torrentId}
          onChange={(e) => setTorrentId(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-44 rounded-r-none"
        />
        <Button variant="primary" className="-ml-px rounded-l-none" onClick={onSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* 用户ID 搜索框 */}
      <div className="flex">
        <Input
          placeholder="按用户ID筛选"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-44 rounded-r-none"
        />
        <Button variant="primary" className="-ml-px rounded-l-none" onClick={onSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
