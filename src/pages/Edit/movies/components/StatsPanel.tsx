interface StatsPanelProps {
  total: number;
  filmsCount: number;
  seriesCount: number;
  totalTorrents: number;
}

export function StatsPanel({ total, filmsCount, seriesCount, totalTorrents }: StatsPanelProps) {
  return (
    <div className="mt-6 bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
      <h3 className="text-neutral-400 text-xs uppercase tracking-wide mb-4">统计信息</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm">总影片数</span>
          <span className="text-white">{total}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm">电影</span>
          <span className="text-amber-400">{filmsCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm">剧集</span>
          <span className="text-amber-400">{seriesCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm">总种子数</span>
          <span className="text-green-400">{totalTorrents}</span>
        </div>
      </div>
    </div>
  );
}
