import { ArrowUpDown, Grid3x3, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/SearchInput";
import { CategoryNav } from "@/layouts/CategoryNav";
import { NativeSelect } from "@/components/ui/native-select";
import type { CategoryItem, SortOption, ViewMode } from "../types";

interface ToolbarProps {
  /** 分类导航数据（已映射中文标签） */
  categories: CategoryItem[];
  /** 当前选中的分类标签 */
  selectedCategory: string;
  /** 选择分类回调 */
  onSelectCategory: (label: string) => void;

  /** 排序字段 */
  sortBy: SortOption["value"];
  /** 更改排序回调 */
  onChangeSortBy: (v: SortOption["value"]) => void;

  /** 搜索关键字 */
  searchQuery: string;
  /** 更改搜索关键字回调 */
  onChangeSearch: (v: string) => void;
  /** 提交搜索回调（点击图标或按 Enter） */
  onSearch: () => void;

  /** 视图模式 */
  viewMode: ViewMode;
  /** 更改视图模式回调 */
  onChangeViewMode: (mode: ViewMode) => void;

  /** 是否显示筛选面板（占位，保留行为） */
  showFilters: boolean;
  /** 切换筛选开关 */
  onToggleFilters: () => void;
}

const sortOptions: SortOption[] = [
  { value: "latest", label: "最新发布" },
  { value: "seeders", label: "最多做种" },
  { value: "completed", label: "最多完成" },
  { value: "rating", label: "最高评分" },
];

/**
 * Toolbar
 * 职责：分类导航、搜索输入、排序选择、视图切换、筛选开关
 * 说明：纯UI组件，不包含业务副作用；所有数据与事件由容器传入。
 */
export function Toolbar(props: ToolbarProps) {
  const {
    categories,
    selectedCategory,
    onSelectCategory,
    sortBy,
    onChangeSortBy,
    searchQuery,
    onChangeSearch,
    onSearch,
    viewMode,
    onChangeViewMode,
    showFilters,
    onToggleFilters,
  } = props;

  return (
    <div className="sticky top-0 bg-[#0F171E] border-b border-gray-800 z-30">
      <div className="w-full px-4 md:px-8 pt-4 pb-3">
        <div className="flex flex-col flex-wrap md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          {/* 分类导航 */}
          <div className="w-full md:flex-auto md:w-auto md:min-w-0 md:pr-2 overflow-x-auto">
            <CategoryNav
              inline
              active={selectedCategory}
              onSelect={(value) => onSelectCategory(value)}
              items={categories.map((c) => ({
                label: c.label,
                value: c.label, // 保持 value 与 label 一致，因为上层逻辑使用 label 作为 key
                sort: (c as any).sort,
              }))}
            />
          </div>

          {/* 搜索 / 排序 / 视图切换 / 筛选 */}
          <div className="flex items-center md:justify-end gap-2 md:gap-3 flex-wrap  max-w-full">
            {/* 搜索框组件 */}
            <SearchInput
              value={searchQuery}
              onChange={onChangeSearch}
              onSearch={onSearch}
              placeholder="搜索种子、标题..."
            />

            {/* 排序选择（移动端图标触发） */}
            <div className="md:hidden relative">
              <NativeSelect
                value={sortBy}
                onChange={(v) => onChangeSortBy(v as SortOption["value"])}
                options={sortOptions.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
                variant="cyan"
                iconOnly
                icon={<ArrowUpDown className="w-4 h-4" strokeWidth={1.75} />}
              />
            </div>

            {/* 排序选择（桌面端） */}
            <div className="hidden md:block relative">
              <NativeSelect
                value={sortBy}
                onChange={(v) => onChangeSortBy(v as SortOption["value"])}
                options={sortOptions.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
                placeholder="选择排序方式"
                className="w-[140px]"
                variant="cyan"
                triggerClassName="rounded-full text-neutral-300"
              />
            </div>

            {/* 筛选按钮（行为保留，占位） */}
            <Button
              variant="outline"
              onClick={onToggleFilters}
              className="bg-gray-900 border-gray-700 text-white border border-gray-700 hover:text-amber-300 hover:border-amber-500/50 px-4 h-9"
              aria-pressed={showFilters}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>

            {/* 视图切换 */}
            <div className="flex border border-gray-700 rounded-md overflow-hidden">
              <Button
                onClick={() => onChangeViewMode("grid")}
                className={`h-9 px-3 transition-colors ${
                  viewMode === "grid"
                    ? "bg-linear-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 text-amber-300 whitespace-nowrap"
                    : "bg-gray-900 text-gray-400 border border-gray-900 hover:text-amber-300 hover:border-amber-500/50"
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => onChangeViewMode("list")}
                className={`h-9 px-3 transition-colors ${
                  viewMode === "list"
                    ? "bg-linear-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 text-amber-300 whitespace-nowrap"
                    : "bg-gray-900 text-gray-400 border border-gray-900 hover:text-amber-300 hover:border-amber-500/50"
                }`}
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
