import { ResponsiveSortSelect } from "@/components/ResponsiveSortSelect";
import { CategoryNav } from "@/layouts/CategoryNav";
import { SearchInput } from "@/components/SearchInput";
import type { GenreOption, SortKey } from "../types";

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  sortBy: SortKey;
  onSortChange: (v: SortKey) => void;
  genres: GenreOption[];
  selectedGenre: string;
  onChangeGenre: (key: string) => void;
}

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "rating", label: "评分最高" },
  { value: "latest", label: "最新上映" },
  { value: "popular", label: "最受欢迎" },
];

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
      <div className="flex items-center gap-3 md:gap-4 mb-4">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="搜索影片名称、导演..."
          inputClassName="md:py-5 rounded-lg focus:border-amber-500/50 focus:ring-amber-500/50" // 保持页面的琥珀色主题
        />

        {/* 排序选择（响应式组件） */}
        <ResponsiveSortSelect
          value={sortBy}
          onChange={(v) => onSortChange(v as SortKey)}
          options={sortOptions}
        />
      </div>
      {/* 类型筛选 */}
      <CategoryNav
        inline
        items={genres.map((g) => ({ label: g.label, value: g.key }))}
        active={selectedGenre}
        onSelect={(value) => onChangeGenre(value)}
        className="mb-4"
      />
    </div>
  );
}
