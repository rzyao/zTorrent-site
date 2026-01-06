import { Separator } from '@/components/ui/separator';
import type { Playlist } from '@/modules/app/pages/Edit/playlists/types';

interface StatsPanelProps {
  /** 用于统计的片单数组 */
  playlists: Playlist[];
}

/**
 * 统计信息面板：纯展示组件。
 */
export function StatsPanel({ playlists }: StatsPanelProps) {
  return (
    <div className="mt-6 bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
      <h3 className="text-neutral-400 text-xs uppercase tracking-wide mb-4">统计信息</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm">总片单数</span>
          <span className="text-white">{playlists.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm">公开片单</span>
          <span className="text-green-400">{playlists.filter((p) => p.visibility === 'public').length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm">私密片单</span>
          <span className="text-red-400">{playlists.filter((p) => p.visibility === 'private').length}</span>
        </div>
        <Separator className="bg-neutral-700/50" />
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm">总观看次数</span>
          <span className="text-amber-400">{playlists.reduce((sum, p) => sum + p.views, 0)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm">总点赞数</span>
          <span className="text-amber-400">{playlists.reduce((sum, p) => sum + p.likes, 0)}</span>
        </div>
      </div>
    </div>
  );
}

