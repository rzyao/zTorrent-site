import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, Download, Trash2 } from "lucide-react";
import { formatSize, formatDate } from "@/utils/format";
import type { Torrent } from "@/modules/app/pages/Edit/movies/types";

interface TorrentListProps {
  torrents: Torrent[];
  onRemove: (id: string) => void;
}

export function TorrentList({ torrents, onRemove }: TorrentListProps) {
  if (torrents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-700 py-12 text-center">
        <span className="mx-auto mb-3 h-12 w-12 text-neutral-600" />
        <p className="mb-3 text-sm text-neutral-500">还没有添加种子版本</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {torrents.map((torrent) => (
        <div
          key={torrent.id}
          className="group rounded-xl border border-neutral-700/50 bg-neutral-900/30 p-4 transition-all hover:border-neutral-600"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2">
                <h4 className="text-white">{torrent.title || torrent.version}</h4>
                {torrent.subTitle && (
                  <p className="mt-0.5 text-xs text-neutral-400">{torrent.subTitle}</p>
                )}
                <div className="mt-1 flex items-center gap-2">
                  {torrent.isFree && (
                    <Badge className="bg-green-500/20 text-xs text-green-400">FREE</Badge>
                  )}
                  {torrent.isVip && (
                    <Badge className="bg-purple-500/20 text-xs text-purple-400">VIP</Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-neutral-400 md:grid-cols-4">
                <div>
                  <span className="text-neutral-500">大小:</span> {formatSize(torrent.size)}
                </div>
                <div>
                  <span className="text-neutral-500">分辨率:</span> {torrent.standard}
                </div>
                <div>
                  <span className="text-neutral-500">来源:</span> {torrent.source}
                </div>
                <div>
                  <span className="text-neutral-500">编码:</span> {torrent.codec}
                </div>
                <div>
                  <span className="text-neutral-500">音频:</span> {torrent.audio}
                </div>
                <div className="flex items-center gap-1">
                  <UploadIcon className="h-3 w-3 text-green-400" />
                  <span className="text-green-400">{torrent.seeders}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3 text-red-400" />
                  <span className="text-red-400">{torrent.leechers}</span>
                </div>
                <div>
                  <span className="text-neutral-500">上传:</span> {formatDate(torrent.uploadDate)}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(torrent.id)}
              className="text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
