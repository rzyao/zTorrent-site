import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatSize } from "@/utils/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
}

export function BindTorrentDialog({
  isOpen,
  onClose,
  targetEpisode,
  searchTorrents,
  onBind,
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

    // 更新本地状态显示为已绑定
    setSearchResults((prev) =>
      prev.map((item) => (item.id === torrentId ? { ...item, isBound: true } : item)),
    );
    // 不自动关闭弹窗，允许连续操作
    // onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-gray-800 bg-gray-950 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-amber-500" />
            关联种子
            {targetEpisode && (
              <span className="ml-2 text-sm font-normal text-neutral-400">
                (绑定至: 第{targetEpisode.episodeNumber}集 {targetEpisode.title})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 搜索区域 */}
          <div className="space-y-2">
            <label className="text-sm text-neutral-300">搜索种子</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入关键词搜索..."
                className="flex-1 border-gray-800 bg-gray-900"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching || localQuery.trim().length < 2}
                className="bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* 绑定到指定分集（仅当未指定 targetEpisode 时显示） */}
          {!targetEpisode && (
            <div className="space-y-1">
              <label className="text-xs text-neutral-400">绑定到集 (可选)</label>
              <Input
                type="number"
                value={bindEpisode}
                onChange={(e) => setBindEpisode(e.target.value)}
                placeholder="集号"
                className="w-32 border-gray-800 bg-gray-900"
              />
            </div>
          )}

          {/* 搜索结果 */}
          <div className="mt-4 max-h-[300px] space-y-2 overflow-y-auto">
            {isSearching && <p className="py-4 text-center text-sm text-neutral-500">搜索中...</p>}
            {!isSearching && searchTriggered && searchResults.length === 0 && (
              <p className="py-4 text-center text-sm text-neutral-500">无结果</p>
            )}
            {!searchTriggered && !isSearching && (
              <p className="py-4 text-center text-sm text-neutral-500">输入关键词并点击搜索按钮</p>
            )}

            {searchResults.map((item: any) => {
              return (
                <div
                  key={item.id}
                  className={`group flex items-center justify-between rounded-lg border p-3 transition-colors ${
                    item.isBound
                      ? "border-green-800/50 bg-green-900/20"
                      : "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/50"
                  }`}
                >
                  <div className="mr-4 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-medium text-white" title={item.title}>
                        {item.title}
                      </div>
                      {item.isBound && (
                        <Badge className="border border-green-600 bg-green-900/30 text-xs text-green-400">
                          <Check className="mr-1 h-3 w-3" />
                          已绑定
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">
                      {formatSize(item.size)} · {item.uploadDate}
                    </div>
                  </div>
                  {item.isBound ? (
                    <span className="text-xs text-green-500">已关联</span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleBind(item.id)}
                      className="h-8 border border-amber-500/50 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black"
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
