import { Search, Filter, ChevronDown, Film, List, Package } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import type { ReviewStatus, ReviewType } from '../types';

interface Props {
  typeFilter: ReviewType | 'all';
  setTypeFilter: (v: ReviewType | 'all') => void;
  statusFilter: ReviewStatus | 'all';
  setStatusFilter: (v: ReviewStatus | 'all') => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  timeRange: 'today' | 'week' | 'month' | 'all';
  setTimeRange: (v: 'today' | 'week' | 'month' | 'all') => void;
}

export function FiltersBar(props: Props) {
  const { typeFilter, setTypeFilter, statusFilter, setStatusFilter, searchQuery, setSearchQuery, showFilters, setShowFilters, timeRange, setTimeRange } = props;

  return (
    <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="搜索标题或提交人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-neutral-200 text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTypeFilter('all')} className={`px-4 py-2 rounded-lg text-sm transition-all ${typeFilter === 'all' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25' : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'}`}>
            全部
          </button>
          <button onClick={() => setTypeFilter('movie')} className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${typeFilter === 'movie' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25' : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'}`}>
            <Film className="w-4 h-4" />
            影片
          </button>
          <button onClick={() => setTypeFilter('playlist')} className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${typeFilter === 'playlist' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25' : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'}`}>
            <List className="w-4 h-4" />
            片单
          </button>
          <button onClick={() => setTypeFilter('torrent')} className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${typeFilter === 'torrent' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25' : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'}`}>
            <Package className="w-4 h-4" />
            种子
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setStatusFilter('pending')} className={`px-4 py-2 rounded-lg text-sm transition-all ${statusFilter === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'}`}>待审核</button>
          <button onClick={() => setStatusFilter('approved')} className={`px-4 py-2 rounded-lg text-sm transition-all ${statusFilter === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'}`}>已通过</button>
          <button onClick={() => setStatusFilter('rejected')} className={`px-4 py-2 rounded-lg text-sm transition-all ${statusFilter === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'}`}>已驳回</button>
          <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-lg text-sm transition-all ${statusFilter === 'all' ? 'bg-neutral-600 text-neutral-200' : 'bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700'}`}>全部</button>
        </div>

        <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 rounded-lg text-sm bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700 transition-all flex items-center gap-2">
          <Filter className="w-4 h-4" />
          更多筛选
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-neutral-700/50 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-neutral-400 text-sm mb-2 block">时间范围</label>
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="选择时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部时间</SelectItem>
                <SelectItem value="today">今天</SelectItem>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-neutral-400 text-sm mb-2 block">评分区间（影片）</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="选择评分区间" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部评分</SelectItem>
                <SelectItem value="9+">9.0+</SelectItem>
                <SelectItem value="8+">8.0+</SelectItem>
                <SelectItem value="7+">7.0+</SelectItem>
                <SelectItem value="below7">7.0以下</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-neutral-400 text-sm mb-2 block">提交人信誉</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="选择信誉级别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="high">高信誉 (90+)</SelectItem>
                <SelectItem value="medium">中等 (70-89)</SelectItem>
                <SelectItem value="low">低信誉 (&lt;70)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
