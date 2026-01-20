// 统计卡片组件：展示当前视图下的总数、总悬赏、平均悬赏与示例时长
import { Award, Clock, Coins, XCircle } from 'lucide-react';
import type { TabStats, TabType } from '../types';
import { useLanguage } from '@/hooks/useLanguage';

export function StatsCards({ activeTab, stats }: { activeTab: TabType; stats: TabStats }) {
  const { t } = useLanguage();

  const getFirstCardLabel = () => {
    if (activeTab === 'hall') return t('deadTorrents.stats.total');
    if (activeTab === 'myPublished') return t('deadTorrents.stats.myPublished');
    return t('deadTorrents.stats.myDownloaded');
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">
            {getFirstCardLabel()}
          </span>
          <XCircle className="w-4 h-4 text-red-400" />
        </div>
        <p className="text-white text-2xl">{stats.total}</p>
      </div>

      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">{t('deadTorrents.stats.totalBounty')}</span>
          <Coins className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-white text-2xl">{stats.totalBounty.toFixed(1)}</p>
      </div>

      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">{t('deadTorrents.stats.avgBounty')}</span>
          <Award className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-white text-2xl">{stats.avgBounty.toFixed(1)}</p>
      </div>

      <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-neutral-400 text-sm">{t('deadTorrents.stats.avgDuration')}</span>
          <Clock className="w-4 h-4 text-red-400" />
        </div>
        {/* 示例静态值，真实场景可由后端或额外计算提供 */}
        <p className="text-white text-2xl">{t('deadTorrents.stats.durationDays', { days: 13 })}</p>
      </div>
    </div>
  );
}

