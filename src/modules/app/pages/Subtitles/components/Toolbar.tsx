import { Filter, Globe, Search } from 'lucide-react';
import type { FilterLanguage, SortBy } from '../types';

export function Toolbar({
  searchQuery,
  filterLanguage,
  sortBy,
  onSearchChange,
  onFilterChange,
  onSortChange,
}: {
  searchQuery: string;
  filterLanguage: FilterLanguage;
  sortBy: SortBy;
  onSearchChange: (v: string) => void;
  onFilterChange: (v: FilterLanguage) => void;
  onSortChange: (v: SortBy) => void;
}) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索字幕名称、种子、上传者..."
          className="w-full pl-12 pr-4 py-3 bg-neutral-800/40 border border-neutral-700/50 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      <div className="flex items-center gap-2 bg-neutral-800/40 border border-neutral-700/50 rounded-xl px-4 py-2">
        <Globe className="w-5 h-5 text-neutral-400" />
        <select
          value={filterLanguage}
          onChange={(e) => onFilterChange(e.target.value as FilterLanguage)}
          className="bg-transparent text-white focus:outline-none cursor-pointer"
        >
          <option value="all">全部语言</option>
          <option value="zh">简体中文</option>
          <option value="en">English</option>
          <option value="jp">日本語</option>
          <option value="kr">한국어</option>
        </select>
      </div>

      <div className="flex items-center gap-2 bg-neutral-800/40 border border-neutral-700/50 rounded-xl px-4 py-2">
        <Filter className="w-5 h-5 text-neutral-400" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortBy)}
          className="bg-transparent text-white focus:outline-none cursor-pointer"
        >
          <option value="latest">最新发布</option>
          <option value="downloads">下载最多</option>
          <option value="uploads">上传最多</option>
          <option value="rating">评分最高</option>
        </select>
      </div>
    </div>
  );
}

