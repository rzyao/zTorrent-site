import {
  Search,
  ArrowUpDown,
  Grid3x3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
              onSelect={onSelectCategory}
              items={categories.map((c) => ({
                label: c.label,
                sort: (c as any).sort,
              }))}
            />
          </div>

          {/* 搜索 / 排序 / 视图切换 / 筛选 */}
          <div className="flex items-center md:justify-end gap-2 md:gap-3 flex-wrap  max-w-full">
            {/* 搜索框（响应式：移动端占满，桌面端固定宽度） */}
            <div className="relative flex-1 min-w-0 md:min-w-[320px] md:max-w-[900px] lg:max-w-[1020px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="搜索种子、标题..."
                value={searchQuery}
                onChange={(e) => onChangeSearch(e.target.value)}
                className="w-full bg-gray-900 border-gray-700 text-white pl-4 pr-11 py-2 md:py-4 rounded-full focus:border-[#00A8E1] focus:ring-[#00A8E1] placeholder:text-gray-500"
              />
            </div>

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
              />
            </div>

            {/* 筛选按钮（行为保留，占位） */}
            <Button
              variant="outline"
              onClick={onToggleFilters}
              className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 px-4 h-9"
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
                    ? "bg-[#00A8E1] text-white"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => onChangeViewMode("list")}
                className={`h-9 px-3 transition-colors ${
                  viewMode === "list"
                    ? "bg-[#00A8E1] text-white"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800"
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
