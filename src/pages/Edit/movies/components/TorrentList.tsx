import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload as UploadIcon, Download, Trash2 } from 'lucide-react';
import { formatSize } from '@/utils/format';
import type { Torrent } from '@/pages/Edit/movies/types';

interface TorrentListProps {
  torrents: Torrent[];
  onRemove: (id: string) => void;
}

export function TorrentList({ torrents, onRemove }: TorrentListProps) {
  if (torrents.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-neutral-700 rounded-xl">
        <span className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
        <p className="text-neutral-500 text-sm mb-3">还没有添加种子版本</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {torrents.map((torrent) => (
        <div key={torrent.id} className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600 transition-all group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2">
                <h4 className="text-white">{torrent.title || torrent.version}</h4>
                {torrent.subTitle && <p className="text-xs text-neutral-400 mt-0.5">{torrent.subTitle}</p>}
                <div className="flex items-center gap-2 mt-1">
                  {torrent.isFree && <Badge className="bg-green-500/20 text-green-400 text-xs">FREE</Badge>}
                  {torrent.isVip && <Badge className="bg-purple-500/20 text-purple-400 text-xs">VIP</Badge>}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-neutral-400">
                <div><span className="text-neutral-500">大小:</span> {formatSize(torrent.size)}</div>
                <div><span className="text-neutral-500">分辨率:</span> {torrent.standard}</div>
                <div><span className="text-neutral-500">来源:</span> {torrent.source}</div>
                <div><span className="text-neutral-500">编码:</span> {torrent.codec}</div>
                <div><span className="text-neutral-500">音频:</span> {torrent.audio}</div>
                <div className="flex items-center gap-1"><UploadIcon className="w-3 h-3 text-green-400" /><span className="text-green-400">{torrent.seeders}</span></div>
                <div className="flex items-center gap-1"><Download className="w-3 h-3 text-red-400" /><span className="text-red-400">{torrent.leechers}</span></div>
                <div><span className="text-neutral-500">上传:</span> {torrent.uploadDate}</div>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => onRemove(torrent.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
