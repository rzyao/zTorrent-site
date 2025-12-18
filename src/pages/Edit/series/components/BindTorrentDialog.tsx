import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatSize } from "@/utils/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, Search, Loader2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BindTorrentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetEpisode?: {
    id: string;
    episodeNumber: number;
    title: string;
  };
  // 搜索函数，返回 Promise 结果
  searchTorrents: (query: string) => Promise<any[]>;
  // 绑定操作
  onBind: (torrentId: string, episodeNumber?: number) => Promise<void>;
  // 已绑定的种子 ID 列表
  boundTorrentIds: string[];
}

export function BindTorrentDialog({
  isOpen,
  onClose,
  targetEpisode,
  searchTorrents,
  onBind,
  boundTorrentIds,
}: BindTorrentDialogProps) {
  // 所有状态都在弹窗内部管理
  const [localQuery, setLocalQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [bindEpisode, setBindEpisode] = useState<string>("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  // 使用 ref 追踪上一次的 isOpen 状态
  const prevIsOpenRef = useRef(false);

  // 仅在弹窗从关闭变为打开时重置状态
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      // 弹窗刚打开，重置所有状态
      setLocalQuery("");
      setSearchResults([]);
      setSearchTriggered(false);
      setIsSearching(false);
      if (targetEpisode) {
        setBindEpisode(String(targetEpisode.episodeNumber));
      } else {
        setBindEpisode("");
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, targetEpisode]);

  // 手动触发搜索
  const handleSearch = useCallback(async () => {
    const query = localQuery.trim();
    if (query.length < 2) return;

    setSearchTriggered(true);
    setIsSearching(true);

    try {
      const results = await searchTorrents(query);
      setSearchResults(results);
    } catch (error) {
      console.error("[BindTorrentDialog] Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [localQuery, searchTorrents]);

  // Enter 键触发搜索
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 绑定操作
  const handleBind = async (torrentId: string) => {
    const epNum = targetEpisode
      ? targetEpisode.episodeNumber
      : bindEpisode
      ? parseInt(bindEpisode)
      : undefined;
    await onBind(torrentId, epNum);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-950 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="w-5 h-5 text-amber-500" />
            关联种子
            {targetEpisode && (
              <span className="text-neutral-400 text-sm font-normal ml-2">
                (绑定至: 第{targetEpisode.episodeNumber}集 {targetEpisode.title}
                )
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 搜索区域 */}
          <div className="space-y-2">
            <label className="text-neutral-300 text-sm">搜索种子</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入关键词搜索..."
                className="bg-gray-900 border-gray-800 flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching || localQuery.trim().length < 2}
                className="bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* 绑定到指定分集（仅当未指定 targetEpisode 时显示） */}
          {!targetEpisode && (
            <div className="space-y-1">
              <label className="text-xs text-neutral-400">
                绑定到集 (可选)
              </label>
              <Input
                type="number"
                value={bindEpisode}
                onChange={(e) => setBindEpisode(e.target.value)}
                placeholder="集号"
                className="bg-gray-900 border-gray-800 w-32"
              />
            </div>
          )}

          {/* 搜索结果 */}
          <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto">
            {isSearching && (
              <p className="text-sm text-neutral-500 text-center py-4">
                搜索中...
              </p>
            )}
            {!isSearching && searchTriggered && searchResults.length === 0 && (
              <p className="text-sm text-neutral-500 text-center py-4">
                无结果
              </p>
            )}
            {!searchTriggered && !isSearching && (
              <p className="text-sm text-neutral-500 text-center py-4">
                输入关键词并点击搜索按钮
              </p>
            )}

            {searchResults.map((item: any) => {
              const isBound = boundTorrentIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border flex justify-between items-center group transition-colors ${
                    isBound
                      ? "bg-green-900/20 border-green-800/50"
                      : "bg-neutral-900/50 border-neutral-800 hover:bg-neutral-800/50"
                  }`}
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="text-sm text-white truncate font-medium"
                        title={item.title}
                      >
                        {item.title}
                      </div>
                      {isBound && (
                        <Badge className="text-green-400 border border-green-600 text-xs bg-green-900/30">
                          <Check className="w-3 h-3 mr-1" />
                          已绑定
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {formatSize(item.size)} · {item.uploadDate}
                    </div>
                  </div>
                  {isBound ? (
                    <span className="text-xs text-green-500">已关联</span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleBind(item.id)}
                      className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black border border-amber-500/50 h-8"
                    >
                      绑定
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
