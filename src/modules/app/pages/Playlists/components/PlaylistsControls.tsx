import { List, Heart, Film, Plus } from "lucide-react";
import { ResponsiveSortSelect } from "@/modules/app/components/ResponsiveSortSelect";
import { CategoryNav, type CategoryNavItem } from "@/modules/app/layouts/CategoryNav";
import { SearchInput } from "@/modules/app/components/SearchInput";
import { useLanguage } from "@/hooks/useLanguage";

interface Props {
  activeTab: "all" | "mine" | "following";
  onTabChange: (tab: "all" | "mine" | "following") => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  sortBy: "latest" | "popular" | "rating";
  onSortChange: (v: "latest" | "popular" | "rating") => void;
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
  const { t } = useLanguage();

  const sortOptions = [
    { value: "latest", label: t('playlists.sortLatest') },
    { value: "popular", label: t('playlists.sortPopular') },
    { value: "rating", label: t('playlists.sortRating') },
  ];

  const navItems: CategoryNavItem[] = [
    { label: t('playlists.allPlaylists'), value: "all", icon: <List className="h-4 w-4" /> },
    { label: t('playlists.myPlaylists'), value: "mine", icon: <Film className="h-4 w-4" /> },
    {
      label: t('playlists.followingPlaylists'),
      value: "following",
      icon: <Heart className="h-4 w-4" />,
    },
  ];

  return (
    <>
      <CategoryNav
        inline
        items={navItems}
        active={activeTab}
        onSelect={(val) => onTabChange(val as any)}
        className="mb-4" // 微调左对齐
        triggerClassName="rounded-xl px-4 md:px-4 py-4.5" // 覆盖默认样式以匹配原设计
        inactiveClassName="border border-neutral-700/50 text-neutral-300 whitespace-nowrap flex items-center gap-2 hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-900/30 transition-all"
      />
      <div className="mb-4 flex items-center gap-3 md:gap-4">
        <SearchInput
          value={searchQuery}
          onSearch={onSearchChange}
          placeholder={t('playlists.searchPlaceholder')}
          inputClassName="md:py-5 rounded-lg focus:border-amber-500/50 focus:ring-amber-500/50" // 保持页面的琥珀色主题
        />

        {/* 响应式排序组件 */}
        <ResponsiveSortSelect
          value={sortBy}
          onChange={(v) => onSortChange(v as any)}
          options={sortOptions}
        />
      </div>
    </>
  );
}
