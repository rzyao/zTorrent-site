import { Filter, Upload, Vote } from 'lucide-react';

type TabKey = 'hall' | 'mySubmissions' | 'myVotes';

export function FilterTabs({
  selected,
  onChange,
  hallCount,
  submissionsCount,
  votesCount,
}: {
  selected: TabKey;
  onChange: (tab: TabKey) => void;
  hallCount: number;
  submissionsCount: number;
  votesCount: number;
}) {
  return (
    <div className="mb-6 flex items-center gap-3 overflow-x-auto">
      <button
        onClick={() => onChange('hall')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
          selected === 'hall'
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
            : 'bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-700/50'
        }`}
      >
        <Filter className="w-4 h-4" />
        候选大厅 ({hallCount})
      </button>
      <button
        onClick={() => onChange('mySubmissions')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
          selected === 'mySubmissions'
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
            : 'bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-700/50'
        }`}
      >
        <Upload className="w-4 h-4" />
        我的候选 ({submissionsCount})
      </button>
      <button
        onClick={() => onChange('myVotes')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
          selected === 'myVotes'
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
            : 'bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-700/50'
        }`}
      >
        <Vote className="w-4 h-4" />
        我的投票 ({votesCount})
      </button>
    </div>
  );
}
