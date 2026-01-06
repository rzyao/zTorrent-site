import { Search, Filter } from 'lucide-react';

interface TorrentRecordFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TorrentRecordFilters({ searchQuery, onSearchChange }: TorrentRecordFiltersProps) {
  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl mb-6 flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
        <input
          type="text"
          placeholder="搜索种子名称或分类..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition-colors"
        />
      </div>
      <button className="px-4 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-lg text-neutral-400 hover:text-white hover:border-amber-500/50 transition-all flex items-center gap-2">
        <Filter className="w-5 h-5" />
        <span>筛选</span>
      </button>
    </div>
  );
}
