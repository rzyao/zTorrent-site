import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GenreOption, SortKey, TabKey } from "../types";

interface ToolbarProps {
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
      {/* 搜索与排序 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索影片名称、导演..."
            className="w-full input rounded-xl pl-12 pr-4 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(v) => onSortChange(v as SortKey)}
        >
          <SelectTrigger className="rounded-xl h-12 py-5 w-full md:w-auto min-w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">评分最高</SelectItem>
            <SelectItem value="latest">最新上映</SelectItem>
            <SelectItem value="popular">最受欢迎</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* 类型筛选 */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 snap-x snap-mandatory">
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
