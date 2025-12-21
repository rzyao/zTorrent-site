import { TorrentStatus, TorrentStats } from '../types';
import { TORRENT_TABS } from '../constants';

interface TorrentRecordTabsProps {
  activeTab: TorrentStatus;
  stats: TorrentStats;
  onTabChange: (tab: TorrentStatus) => void;
}

export function TorrentRecordTabs({ activeTab, stats, onTabChange }: TorrentRecordTabsProps) {
  const getTabStyle = (isActive: boolean, tabId: TorrentStatus) => {
    if (!isActive) return 'text-neutral-400 hover:text-white hover:bg-neutral-800/50';

    switch (tabId) {
      case 'uploaded':
        return 'bg-linear-to-br from-purple-500/20 to-purple-600/20 text-white border border-purple-500/30';
      case 'seeding':
        return 'bg-linear-to-br from-green-500/20 to-green-600/20 text-white border border-green-500/30';
      case 'downloading':
        return 'bg-linear-to-br from-blue-500/20 to-blue-600/20 text-white border border-blue-500/30';
      case 'completed':
        return 'bg-linear-to-br from-amber-500/20 to-amber-600/20 text-white border border-amber-500/30';
      case 'incomplete':
        return 'bg-linear-to-br from-red-500/20 to-red-600/20 text-white border border-red-500/30';
      default:
        return 'bg-neutral-800 text-white';
    }
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-1 mb-6 flex flex-wrap gap-2">
      {TORRENT_TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg transition-all ${getTabStyle(activeTab === tab.id, tab.id)}`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="ml-1 text-xs">({stats[tab.id]})</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
