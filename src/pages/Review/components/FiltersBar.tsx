import { Search, Filter, ChevronDown, Film, List, Package } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { ReviewStatus, ReviewType } from "../types";

interface Props {
  typeFilter: ReviewType;
  setTypeFilter: (v: ReviewType) => void;
  statusFilter: ReviewStatus;
  setStatusFilter: (v: ReviewStatus) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  timeRange: "today" | "week" | "month" | "all";
  setTimeRange: (v: "today" | "week" | "month" | "all") => void;
}

export function FiltersBar(props: Props) {
  const {
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    timeRange,
    setTimeRange,
  } = props;

  return (
    <div className="mb-6 rounded-xl border border-neutral-700/50 bg-neutral-800/50 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-[200px] flex-1">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="搜索标题或提交人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 py-2 pr-4 pl-10 text-sm text-neutral-200 placeholder-neutral-500 focus:border-amber-500/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTypeFilter("torrent")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all ${typeFilter === "torrent" ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25" : "bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700"}`}
          >
            <Package className="h-4 w-4" />
            种子
          </button>
          <button
            onClick={() => setTypeFilter("movie")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all ${typeFilter === "movie" ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25" : "bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700"}`}
          >
            <Film className="h-4 w-4" />
            电影
          </button>
          <button
            onClick={() => setTypeFilter("series")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all ${typeFilter === "series" ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25" : "bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700"}`}
          >
            <Film className="h-4 w-4" />
            剧集
          </button>
          <button
            onClick={() => setTypeFilter("playlist")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all ${typeFilter === "playlist" ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25" : "bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700"}`}
          >
            <List className="h-4 w-4" />
            片单
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter("pending")}
            className={`rounded-lg px-4 py-2 text-sm transition-all ${statusFilter === "pending" ? "border border-amber-500/50 bg-amber-500/20 text-amber-400" : "bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700"}`}
          >
            待审核
          </button>
          <button
            onClick={() => setStatusFilter("approved")}
            className={`rounded-lg px-4 py-2 text-sm transition-all ${statusFilter === "approved" ? "border border-green-500/50 bg-green-500/20 text-green-400" : "bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700"}`}
          >
            已通过
          </button>
          <button
            onClick={() => setStatusFilter("rejected")}
            className={`rounded-lg px-4 py-2 text-sm transition-all ${statusFilter === "rejected" ? "border border-red-500/50 bg-red-500/20 text-red-400" : "bg-neutral-700/50 text-neutral-300 hover:bg-neutral-700"}`}
          >
            已驳回
          </button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-lg bg-neutral-700/50 px-4 py-2 text-sm text-neutral-300 transition-all hover:bg-neutral-700"
        >
          <Filter className="h-4 w-4" />
          更多筛选
          <ChevronDown
            className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-neutral-700/50 pt-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm text-neutral-400">时间范围</label>
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
            <label className="mb-2 block text-sm text-neutral-400">评分区间（影片）</label>
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
            <label className="mb-2 block text-sm text-neutral-400">提交人信誉</label>
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
