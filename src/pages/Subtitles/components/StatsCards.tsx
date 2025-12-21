import { Download, FileText, Star, Upload } from 'lucide-react';
import type { SubtitlesStats } from '../hooks/useSubtitlesRemote';

export function StatsCards({ stats }: { stats: SubtitlesStats | null }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">总字幕数</span>
          <FileText className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-white text-2xl">{stats?.totalSubtitles ?? 0}</p>
      </div>
      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">总下载量</span>
          <Download className="w-4 h-4 text-green-400" />
        </div>
        <p className="text-white text-2xl">{(stats?.totalDownloads ?? 0).toLocaleString()}</p>
      </div>
      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">总上传量</span>
          <Upload className="w-4 h-4 text-blue-400" />
        </div>
        <p className="text-white text-2xl">{(stats?.totalUploads ?? 0).toLocaleString()}</p>
      </div>
      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">平均评分</span>
          <Star className="w-4 h-4 text-yellow-400" />
        </div>
        <p className="text-white text-2xl">{(stats?.avgRating ?? 0).toFixed(1)}</p>
      </div>
    </div>
  );
}
