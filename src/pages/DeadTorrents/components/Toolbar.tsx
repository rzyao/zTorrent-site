// 工具栏组件：提供排序选择与按 Tab 切换的批量操作按钮
import { DollarSign, Filter, RefreshCw } from 'lucide-react';
import type { TabType } from '../types';
import type { SortBy } from '../hooks/useDeadTorrents';

export function Toolbar({ activeTab, sortBy, onSortChange }: { activeTab: TabType; sortBy: SortBy; onSortChange: (v: SortBy) => void }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <Filter className="w-5 h-5 text-neutral-400" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortBy)}
          className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
        >
          <option value="bounty">悬赏排序</option>
          <option value="time">断种时长排序</option>
          <option value="ratio">分享率排序</option>
        </select>
      </div>

      {activeTab === 'myDownloaded' && (
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg text-white text-sm transition-all shadow-lg shadow-amber-500/30">
          <DollarSign className="w-4 h-4" />
          批量悬赏
        </button>
      )}
      {activeTab === 'myPublished' && (
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white text-sm transition-all shadow-lg shadow-green-500/30">
          <RefreshCw className="w-4 h-4" />
          批量恢复做种
        </button>
      )}
    </div>
  );
}

