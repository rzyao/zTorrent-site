import { List, Heart, Film, Plus, Search, Filter } from 'lucide-react';

interface Props {
  activeTab: 'all' | 'mine' | 'following';
  onTabChange: (tab: 'all' | 'mine' | 'following') => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  sortBy: 'latest' | 'popular' | 'rating';
  onSortChange: (v: 'latest' | 'popular' | 'rating') => void;
  onCreate: () => void;
}

export function PlaylistsControls({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onCreate,
}: Props) {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <List className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white text-3xl">影片片单</h1>
        </div>
        <p className="text-neutral-400 ml-13">浏览和创建精选影片合集</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange('all')}
            className={`px-6 py-2.5 rounded-xl transition-all ${activeTab === 'all'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
          >
            <div className="flex items-center gap-2">
              <List className="w-4 h-4" />
              <span>所有片单</span>
            </div>
          </button>
          <button
            onClick={() => onTabChange('mine')}
            className={`px-6 py-2.5 rounded-xl transition-all ${activeTab === 'mine'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
          >
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              <span>我的片单</span>
            </div>
          </button>
          <button
            onClick={() => onTabChange('following')}
            className={`px-6 py-2.5 rounded-xl transition-all ${activeTab === 'following'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>我关注的</span>
            </div>
          </button>
        </div>
        <button onClick={onCreate} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>创建片单</span>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索片单..."
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="appearance-none bg-neutral-900 border border-neutral-700 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
          >
            <option value="latest">最新创建</option>
            <option value="popular">最受欢迎</option>
            <option value="rating">评分最高</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
        </div>
      </div>
    </>
  );
}

