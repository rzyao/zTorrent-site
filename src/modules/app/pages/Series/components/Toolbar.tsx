import { ResponsiveSortSelect } from "@/modules/app/components/ResponsiveSortSelect";
import { CategoryNav } from "@/modules/app/layouts/CategoryNav";
import { SearchInput } from "@/modules/app/components/SearchInput";
import { useLanguage } from "@/hooks/useLanguage";
import type { GenreOption, SortKey, SeriesStatus } from "../types";

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
  const { t } = useLanguage();

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: "rating", label: t('series.sortByRating') },
    { value: "year", label: t('series.sortByYear') },
    { value: "viewsCount", label: t('series.sortByViews') },
  ];

  const statusOptions = [
    { key: 'all' as const, label: t('series.statusAll') },
    { key: 'airing' as SeriesStatus, label: t('series.statusAiring') },
    { key: 'ended' as SeriesStatus, label: t('series.statusEnded') },
    { key: 'upcoming' as SeriesStatus, label: t('series.statusUpcoming') },
  ];

  return (
    <div>
      {/* 搜索与排序 */}
      <div className="mb-4 flex items-center gap-3 md:gap-4">
        <SearchInput
          value={searchQuery}
          onSearch={onSearchChange}
          placeholder={t('series.searchPlaceholder')}
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
        items={statusOptions.map((s) => ({ label: s.label, value: s.key }))}
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
