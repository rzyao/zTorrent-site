// 警告提示组件：根据当前 Tab 展示不同的提醒文案
import { AlertTriangle } from 'lucide-react';
import type { TabStats, TabType } from '../types';

export function WarningAlert({ activeTab, stats }: { activeTab: TabType; stats: TabStats }) {
  return (
    <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-600/10 border border-red-500/30">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h3 className="text-red-400 mb-2">断种警告</h3>
          {activeTab === 'hall' && (
            <p className="text-neutral-300 text-sm leading-relaxed">
              当前有 <span className="text-red-400">{stats.total}</span> 个种子处于断种状态。
              下载者悬赏总额: <span className="text-amber-400">{stats.totalBounty.toFixed(1)}</span> 金币。
              恢复做种可获得全部悬赏！
            </p>
          )}
          {activeTab === 'myPublished' && (
            <p className="text-neutral-300 text-sm leading-relaxed">
              您有 <span className="text-red-400">{stats.total}</span> 个发布的种子已断种。
              下载者悬赏总额: <span className="text-amber-400">{stats.totalBounty.toFixed(1)}</span> 金币。
              请尽快恢复做种以维护声誉。
            </p>
          )}
          {activeTab === 'myDownloaded' && (
            <p className="text-neutral-300 text-sm leading-relaxed">
              您有 <span className="text-red-400">{stats.total}</span> 个下载的种子已断种。
              断种期间将无法获得保种奖励。您可以提供悬赏吸引其他做种者。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

