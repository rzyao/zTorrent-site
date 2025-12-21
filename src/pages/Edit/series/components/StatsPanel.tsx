interface StatsPanelProps {
  total: number;
}

export function StatsPanel({ total }: StatsPanelProps) {
  return (
    <div className="mt-6 bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
      <h3 className="text-neutral-400 text-xs uppercase tracking-wide mb-4">
        统计信息
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm">总剧集数</span>
          <span className="text-white">{total}</span>
        </div>
      </div>
    </div>
  );
}
