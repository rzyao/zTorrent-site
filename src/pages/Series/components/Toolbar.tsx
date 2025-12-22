import { ResponsiveSortSelect } from "@/components/ResponsiveSortSelect";
import { CategoryNav } from "@/layouts/CategoryNav";
import { SearchInput } from "@/components/SearchInput";
import type { GenreOption, SortKey, SeriesStatus } from "../types";
import { STATUS_OPTIONS } from "../types";

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  sortBy: SortKey;
  onSortChange: (v: SortKey) => void;
  genres: GenreOption[];
  selectedGenre: string;
  onChangeGenre: (key: string) => void;
  selectedStatus: SeriesStatus | "all";
  onChangeStatus: (key: SeriesStatus | "all") => void;
}

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "rating", label: "评分最高" },
  { value: "year", label: "最新上映" },
  { value: "viewsCount", label: "最受欢迎" },
];

/**
 * Toolbar
 * 剧集页工具栏，包含搜索、排序、分类和状态筛选
 */
export function Toolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  genres,
  selectedGenre,
  onChangeGenre,
  selectedStatus,
  onChangeStatus,
}: ToolbarProps) {
  return (
    <div>
      {/* 搜索与排序 */}
      <div className="mb-4 flex items-center gap-3 md:gap-4">
        <SearchInput
          value={searchQuery}
          onSearch={onSearchChange}
          placeholder="搜索剧集名称..."
          inputClassName="md:py-5 rounded-lg focus:border-purple-500/50 focus:ring-purple-500/50"
        />

        {/* 排序选择 */}
        <ResponsiveSortSelect
          value={sortBy}
          onChange={(v) => onSortChange(v as SortKey)}
          options={sortOptions}
        />
      </div>

      {/* 播出状态筛选 */}
      <CategoryNav
        inline
        items={STATUS_OPTIONS.map((s) => ({ label: s.label, value: s.key }))}
        active={selectedStatus}
        onSelect={(value) => onChangeStatus(value as SeriesStatus | "all")}
        className="mb-3"
        triggerClassName="px-3 py-1.5 rounded-lg transition-all whitespace-nowrap snap-start text-sm"
        activeClassName="bg-purple-500/20 text-purple-400 border border-purple-500/30"
        inactiveClassName="bg-neutral-900/30 border border-neutral-700/50 text-neutral-300 hover:border-purple-500/50 hover:text-purple-300 transition-all"
      />

      {/* 分类筛选 */}
      <CategoryNav
        inline
        items={genres.map((g) => ({ label: g.label, value: g.key }))}
        active={selectedGenre}
        onSelect={(value) => onChangeGenre(value)}
        className="mb-4"
        triggerClassName="px-4 py-2 rounded-lg transition-all whitespace-nowrap snap-start"
        activeClassName="bg-purple-500/20 text-purple-400 border border-purple-500/30"
        inactiveClassName="bg-neutral-900/30 border border-neutral-700/50 text-neutral-300 whitespace-nowrap flex items-center gap-2 hover:border-purple-500/50 hover:text-purple-300 hover:bg-neutral-900/30 transition-all"
      />
    </div>
  );
}
