import { Film, TrendingUp, Clock, Award, Search, Filter } from "lucide-react";
import type { GenreOption, SortKey, TabKey } from "../types";

interface ToolbarProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  sortBy: SortKey;
  onSortChange: (v: SortKey) => void;
  genres: GenreOption[];
  selectedGenre: string;
  onChangeGenre: (key: string) => void;
}

/**
 * Toolbar
 * 汇总页签、搜索、排序与类型筛选的无状态展示组件
 */
export function Toolbar({
  activeTab,
  onChangeTab,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  genres,
  selectedGenre,
  onChangeGenre,
}: ToolbarProps) {
  return (
    <div>
      {/* 标签页切换 */}
      <div className="sticky top-0 md:relative z-20  md:mx-0 flex items-center gap-2 mb-6 overflow-x-auto bg-[#0F171E]/95 md:bg-transparent backdrop-blur md:backdrop-blur-0 snap-x snap-mandatory">
        <button
          onClick={() => onChangeTab("all")}
          className={`px-6 py-2.5 rounded-xl transition-all whitespace-nowrap snap-start ${
            activeTab === "all"
              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
              : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4" />
            <span>全部影片</span>
          </div>
        </button>
        <button
          onClick={() => onChangeTab("trending")}
          className={`px-6 py-2.5 rounded-xl transition-all whitespace-nowrap snap-start ${
            activeTab === "trending"
              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
              : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>热门影片</span>
          </div>
        </button>
        <button
          onClick={() => onChangeTab("latest")}
          className={`px-6 py-2.5 rounded-xl transition-all whitespace-nowrap snap-start ${
            activeTab === "latest"
              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
              : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>最新上映</span>
          </div>
        </button>
        <button
          onClick={() => onChangeTab("classic")}
          className={`px-6 py-2.5 rounded-xl transition-all whitespace-nowrap snap-start ${
            activeTab === "classic"
              ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
              : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>经典影片</span>
          </div>
        </button>
      </div>

      {/* 搜索与排序 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索影片名称、导演..."
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="appearance-none bg-neutral-900 border border-neutral-700 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-amber-500/50 cursor-pointer w-full md:w-auto"
          >
            <option value="rating">评分最高</option>
            <option value="latest">最新上映</option>
            <option value="popular">最受欢迎</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
        </div>
      </div>

      {/* 类型筛选 */}
      <div className="-mx-4 px-4 md:mx-0 flex items-center gap-2 mb-8 overflow-x-auto pb-2 snap-x snap-mandatory">
        {genres.map((genre) => (
          <button
            key={genre.key}
            onClick={() => onChangeGenre(genre.key)}
            className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap snap-start ${
              selectedGenre === genre.key
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-neutral-900 text-neutral-400 border border-neutral-700 hover:bg-neutral-800 hover:text-white"
            }`}
          >
            {genre.label}
          </button>
        ))}
      </div>
    </div>
  );
}
