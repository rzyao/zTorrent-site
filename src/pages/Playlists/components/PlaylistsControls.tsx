import { List, Heart, Film, Plus } from "lucide-react";
import { ResponsiveSortSelect } from "@/components/ResponsiveSortSelect";
import { CategoryNav, type CategoryNavItem } from "@/layouts/CategoryNav";
import { SearchInput } from "@/components/SearchInput";

interface Props {
  activeTab: "all" | "mine" | "following";
  onTabChange: (tab: "all" | "mine" | "following") => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  sortBy: "latest" | "popular" | "rating";
  onSortChange: (v: "latest" | "popular" | "rating") => void;
  onCreate: () => void;
}

const sortOptions = [
  { value: "latest", label: "最新创建" },
  { value: "popular", label: "最受欢迎" },
  { value: "rating", label: "评分最高" },
];

const navItems: CategoryNavItem[] = [
  { label: "所有片单", value: "all", icon: <List className="h-4 w-4" /> },
  { label: "我的片单", value: "mine", icon: <Film className="h-4 w-4" /> },
  {
    label: "我关注的",
    value: "following",
    icon: <Heart className="h-4 w-4" />,
  },
];

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
          placeholder="搜索片单..."
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
