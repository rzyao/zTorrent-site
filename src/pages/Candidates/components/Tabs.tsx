import { Filter, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { Tab } from '../types';

export function Tabs({
  selectedTab,
  setSelectedTab,
  counts,
}: {
  selectedTab: Tab;
  setSelectedTab: (t: Tab) => void;
  counts: { all: number; voting: number; approved: number; rejected: number };
}) {
  return (
    <div className="mb-6 flex items-center gap-3 overflow-x-auto">
      <button
        onClick={() => setSelectedTab('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedTab === 'all'
          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
          : 'bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-700/50'
          }`}
      >
        <Filter className="w-4 h-4" />
        全部 ({counts.all})
      </button>
      <button
        onClick={() => setSelectedTab('voting')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedTab === 'voting'
          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
          : 'bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-700/50'
          }`}
      >
        <Clock className="w-4 h-4" />
        投票中 ({counts.voting})
      </button>
      <button
        onClick={() => setSelectedTab('approved')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedTab === 'approved'
          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
          : 'bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-700/50'
          }`}
      >
        <CheckCircle2 className="w-4 h-4" />
        已通过 ({counts.approved})
      </button>
      <button
        onClick={() => setSelectedTab('rejected')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${selectedTab === 'rejected'
          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
          : 'bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-700/50'
          }`}
      >
        <XCircle className="w-4 h-4" />
        已驳回 ({counts.rejected})
      </button>
    </div>
  );
}
