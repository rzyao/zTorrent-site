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
  onSearch: (value?: string) => void;

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
    <div className="sticky top-0 z-30 border-b border-gray-800 bg-[#0F171E]">
      <div className="w-full px-4 pt-4 pb-3 md:px-8">
        <div className="flex flex-col flex-wrap gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          {/* 分类导航 */}
          <div className="w-full overflow-x-auto md:w-auto md:min-w-0 md:flex-auto md:pr-2">
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
          <div className="flex max-w-full flex-wrap items-center gap-2 md:justify-end md:gap-3">
            {/* 搜索框组件 */}
            <SearchInput
              value={searchQuery}
              onSearch={(val) => {
                onChangeSearch(val);
                onSearch(val);
              }}
              placeholder="搜索种子、标题..."
            />

            {/* 排序选择（移动端图标触发） */}
            <div className="relative md:hidden">
              <NativeSelect
                value={sortBy}
                onChange={(v) => onChangeSortBy(v as SortOption["value"])}
                options={sortOptions.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
                variant="cyan"
                iconOnly
                icon={<ArrowUpDown className="h-4 w-4" strokeWidth={1.75} />}
              />
            </div>

            {/* 排序选择（桌面端） */}
            <div className="relative hidden md:block">
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
              className="h-9 border border-gray-700 bg-gray-900 px-4 text-white hover:border-amber-500/50 hover:text-amber-300"
              aria-pressed={showFilters}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>

            {/* 视图切换 */}
            <div className="flex overflow-hidden rounded-md border border-gray-700">
              <Button
                onClick={() => onChangeViewMode("grid")}
                className={`h-9 px-3 transition-colors ${
                  viewMode === "grid"
                    ? "border border-amber-500/50 bg-linear-to-r from-amber-500/20 to-orange-500/20 whitespace-nowrap text-amber-300"
                    : "border border-gray-900 bg-gray-900 text-gray-400 hover:border-amber-500/50 hover:text-amber-300"
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => onChangeViewMode("list")}
                className={`h-9 px-3 transition-colors ${
                  viewMode === "list"
                    ? "border border-amber-500/50 bg-linear-to-r from-amber-500/20 to-orange-500/20 whitespace-nowrap text-amber-300"
                    : "border border-gray-900 bg-gray-900 text-gray-400 hover:border-amber-500/50 hover:text-amber-300"
                }`}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
