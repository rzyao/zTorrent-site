import { ResponsiveSortSelect } from "@/modules/app/components/ResponsiveSortSelect";
import { CategoryNav } from "@/modules/app/layouts/CategoryNav";
import { SearchInput } from "@/modules/app/components/SearchInput";
import { useLanguage } from "@/hooks/useLanguage";
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



/**
 * Toolbar
 * 汇总搜索、排序与分类筛选的无状态展示组件
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
  const { t } = useLanguage();

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: "rating", label: t('movies.sortByRating') },
    { value: "year", label: t('movies.sortByYear') },
    { value: "viewsCount", label: t('movies.sortByViews') },
  ];

  return (
    <div>
      {/* 搜索与排序 */}
      <div className="mb-4 flex items-center gap-3 md:gap-4">
        <SearchInput
          value={searchQuery}
          onSearch={onSearchChange}
          placeholder={t('movies.searchPlaceholder')}
          inputClassName="md:py-5 rounded-lg focus:border-amber-500/50 focus:ring-amber-500/50"
        />

        {/* 排序选择 */}
        <ResponsiveSortSelect
          value={sortBy}
          onChange={(v) => onSortChange(v as SortKey)}
          options={sortOptions}
        />
      </div>
      {/* 分类筛选 */}
      <CategoryNav
        inline
        items={genres.map((g) => ({ label: g.label, value: g.key }))}
        active={selectedGenre}
        onSelect={(value) => onChangeGenre(value)}
        className="mb-4"
        triggerClassName="px-4 py-2 rounded-lg transition-all whitespace-nowrap snap-start "
        activeClassName="bg-amber-500/20 text-amber-400 border border-amber-500/30"
        inactiveClassName="bg-neutral-900/30 border border-neutral-700/50 text-neutral-300 whitespace-nowrap flex items-center gap-2 hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-900/30 transition-all"
      />
    </div>
  );
}
