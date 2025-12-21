import { Sparkles, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { BonusOverview } from '../hooks/useBonusOverview';

export function OverviewCards({ overview }: { overview: BonusOverview }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-linear-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">当前魔力值</span>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <div className="text-white text-3xl mb-1">{(overview?.current ?? 0).toLocaleString()}</div>
        <div className="text-amber-400 text-sm flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>排名第 {overview?.rank ?? '-'}</span>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-green-500/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">累计获得</span>
          <ArrowUpRight className="w-5 h-5 text-green-400" />
        </div>
        <div className="text-white text-3xl mb-1">{(overview?.totalEarned ?? 0).toLocaleString()}</div>
        <div className="text-green-400 text-sm">历史总收入</div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-red-500/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">累计消耗</span>
          <ArrowDownRight className="w-5 h-5 text-red-400" />
        </div>
        <div className="text-white text-3xl mb-1">{(overview?.totalSpent ?? 0).toLocaleString()}</div>
        <div className="text-red-400 text-sm">历史总支出</div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">净收益</span>
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-white text-3xl mb-1">{((overview?.totalEarned ?? 0) - (overview?.totalSpent ?? 0)).toLocaleString()}</div>
        <div className="text-blue-400 text-sm">收入 - 支出</div>
      </div>
    </div>
  );
}

