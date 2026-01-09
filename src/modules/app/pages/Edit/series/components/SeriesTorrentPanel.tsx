import { Button } from "@/modules/app/components/ui/button";
import { Trash2, Link } from "lucide-react";
import { formatSize } from "@/utils/format";
import type { SeriesTorrent } from "../types";

interface SeriesTorrentPanelProps {
  seriesId: string;
  torrents: SeriesTorrent[];
  onUnbind: (id: string) => void;
  onOpenBindDialog: () => void;
}

export function SeriesTorrentPanel({
  seriesId,
  torrents,
  onUnbind,
  onOpenBindDialog,
}: SeriesTorrentPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Link className="w-5 h-5 text-amber-500" />
          关联种子
        </h3>
        <Button
          size="sm"
          onClick={onOpenBindDialog}
          className="bg-amber-500 text-black hover:bg-amber-400"
        >
          绑定新种子
        </Button>
      </div>

      {/* Bound List */}
      <div className="space-y-3">
        {torrents.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-neutral-700 rounded-xl text-neutral-500 text-sm">
            暂无关联种子
          </div>
        ) : (
          torrents.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50 flex items-start justify-between group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white text-sm font-medium truncate">
                    {t.title || "未命名种子"}
                  </h4>
                </div>
                <div className="flex gap-3 text-xs text-neutral-400">
                  <span>{formatSize(t.size)}</span>
                  <span>{t.seeders}做种</span>
                  <span>{t.leechers}下载</span>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onUnbind(t.torrentId)}
                className="text-neutral-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
