import { Button } from '@/components/ui/button';
import { Video, X, Upload as UploadIcon, Download } from 'lucide-react';
import { formatSize } from '@/utils/format';

interface TorrentSearchPanelProps {
  visible: boolean;
  query: string;
  onQueryChange: (v: string) => void;
  isSearching: boolean;
  searchError: string | null;
  results: any[];
  onBind: (id: string) => void;
  onClose: () => void;
}

export function TorrentSearchPanel({ visible, query, onQueryChange, isSearching, searchError, results, onBind, onClose }: TorrentSearchPanelProps) {
  if (!visible) return null;
  return (
    <div className="mb-6 p-6 rounded-xl bg-neutral-900/30 border border-amber-500/30 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white">选择已有种子</h4>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-400 hover:text-white">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div>
        <label className="text-neutral-300 text-sm">搜索种子（ID或关键词）</label>
        <input type="text" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="例如：4K / BluRay / 种子ID" className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 mt-2" />
        <p className="text-xs text-neutral-500 mt-1">输入≥2个字符后开始搜索，已绑定到当前影片的种子会被排除</p>
      </div>
      {isSearching && <p className="text-sm text-neutral-400">正在搜索...</p>}
      {searchError && <p className="text-sm text-red-400">{searchError}</p>}
      <div className="space-y-3">
        {results.length === 0 && !isSearching ? (
          <div className="text-center py-8 border border-dashed border-neutral-700 rounded-xl">
            <Video className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">暂无结果，请输入更具体的关键词</p>
          </div>
        ) : (
          results.map((item: any) => {
            const id = String(item?.id ?? item?.torrentId ?? '');
            const title = item?.title ?? '';
            const subTitle = item?.subTitle ?? '';
            const version = item?.version ?? item?.quality ?? '';
            const size = item?.size ?? '';
            const standard = item?.standard ?? '';
            const source = item?.source ?? '';
            const codec = item?.codec ?? item?.videoCodec ?? '';
            const audio = item?.audio ?? item?.audioCodec ?? '';
            const seeders = item?.seeders ?? 0;
            const leechers = item?.leechers ?? 0;
            return (
              <div key={id} className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1">
                      <h4 className="text-white">{title || version || '未命名种子'}</h4>
                      {subTitle && <p className="text-xs text-neutral-400 mt-0.5">{subTitle}</p>}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-neutral-400">
                      <div><span className="text-neutral-500">大小:</span> {formatSize(size)}</div>
                      <div><span className="text-neutral-500">分辨率:</span> {standard}</div>
                      <div><span className="text-neutral-500">来源:</span> {source}</div>
                      <div><span className="text-neutral-500">编码:</span> {codec}</div>
                      <div><span className="text-neutral-500">音频:</span> {audio}</div>
                      <div className="flex items-center gap-1"><UploadIcon className="w-3 h-3 text-green-400" /><span className="text-green-400">{seeders}</span></div>
                      <div className="flex items-center gap-1"><Download className="w-3 h-3 text-red-400" /><span className="text-red-400">{leechers}</span></div>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => onBind(id)} className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">绑定到当前影片</Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
