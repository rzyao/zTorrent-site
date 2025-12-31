import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronsUpDown,
  Plus,
  Tag as TagIcon,
  LayoutGrid,
  Hash,
  Square,
  Wrench,
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useForumsCategories } from "../../../hooks/useForumsCategories";
import { useForumsTagsQuery } from "../../../hooks/useForumsTagsQuery";
import { useForumTheme } from "../../../context/ForumThemeContext";
import { getIconByName } from "@/components/ui/icon-picker";

interface ForumFilterBarProps {
  selectedCategory: string; // "all" or category ID
  categoryName?: string; // Category name for display
  selectedTag?: string; // Tag name
  sortBy: "latest" | "hot";
  className?: string;
}

/**
 * 论坛筛选导航栏
 * 风格与 Sidebar.tsx 保持一致：深色模式下使用 amber-500 强调色，浅色使用 blue-600
 */
export function ForumFilterBar({
  selectedCategory,
  categoryName,
  selectedTag,
  sortBy,
  className,
}: ForumFilterBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useForumTheme();

  // Data Fetching
  const { data: categories = [] } = useForumsCategories();
  const { data: tags = [] } = useForumsTagsQuery();

  // Dropdown States
  const [openCategory, setOpenCategory] = useState(false);
  const [openTag, setOpenTag] = useState(false);

  // Computed Labels
  const currentCategoryName =
    selectedCategory === "all"
      ? "所有类别"
      : categoryName ||
        categories.find((c) => (c as any).id === selectedCategory)?.name ||
        selectedCategory;

  const currentTagName = selectedTag ? selectedTag : "所有标签";

  // Handlers
  const handleCategorySelect = (categoryId: string) => {
    setOpenCategory(false);
    if (categoryId === "all") {
      navigate("/forum");
    } else {
      navigate(`/forum/category/${categoryId}`);
    }
  };

  const handleTagSelect = (tagName: string) => {
    setOpenTag(false);
    navigate(`/forum/tag/${tagName}`);
  };

  // 共用的按钮样式 - 与 Sidebar 一致
  const filterButtonClass = cn(
    "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm",
    "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200",
  );

  // 排序标签样式
  const getSortTabClass = (isActive: boolean) =>
    cn(
      "cursor-pointer rounded-md px-3 py-1.5 text-sm",
      isActive ? colors.navItemActive : colors.navItemInactive,
    );

  // 下拉菜单项样式 - 类别和标签通用
  const getMenuItemClass = (isSelected: boolean) =>
    cn("cursor-pointer", isSelected ? colors.menuItemActive : colors.menuItemHover);

  return (
    <div
      className={cn(
        "sticky top-0 z-30 flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      {/* Left: Filters (Category & Tag) */}
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Category Dropdown */}
        <Popover open={openCategory} onOpenChange={setOpenCategory}>
          <PopoverTrigger asChild>
            <button className={filterButtonClass}>
              <LayoutGrid className="h-4 w-4 opacity-50" />
              <span className="max-w-[100px] truncate">{currentCategoryName}</span>
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "w-[220px] border p-0",
              "w-[220px] border border-gray-200 bg-white p-0 dark:border-neutral-700 dark:bg-neutral-900",
            )}
            align="start"
          >
            <Command className="bg-white dark:bg-neutral-900">
              <CommandInput placeholder="搜索类别..." className="dark:text-neutral-200" />
              <CommandList>
                <CommandEmpty className={colors.textMuted}>无结果.</CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => {
                    const isSelected = selectedCategory === (category as any).id;
                    return (
                      <CommandItem
                        key={(category as any).id}
                        value={category.name}
                        onSelect={() => handleCategorySelect((category as any).id)}
                        className={getMenuItemClass(isSelected)}
                      >
                        {(() => {
                          const IconComponent = category.icon ? getIconByName(category.icon) : null;
                          if (IconComponent) {
                            return (
                              <IconComponent
                                className="mr-2 h-3.5 w-3.5"
                                style={{ color: category.color }}
                              />
                            );
                          }
                          return category.color ? (
                            <span
                              className="mr-2 h-3 w-3 rounded-[2px]"
                              style={{ backgroundColor: category.color }}
                            />
                          ) : (
                            <Square className="mr-2 h-3 w-3 opacity-50" />
                          );
                        })()}
                        {category.name}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Tag Dropdown */}
        <Popover open={openTag} onOpenChange={setOpenTag}>
          <PopoverTrigger asChild>
            <button className={filterButtonClass}>
              <Hash className="h-4 w-4 opacity-50" />
              <span className="max-w-[80px] truncate">{currentTagName}</span>
              <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "w-[200px] border p-0",
              "w-[200px] border border-gray-200 bg-white p-0 dark:border-neutral-700 dark:bg-neutral-900",
            )}
            align="start"
          >
            <Command className="bg-white dark:bg-neutral-900">
              <CommandInput className="dark:text-neutral-200" />
              <CommandList>
                <CommandEmpty className={colors.textMuted}>无结果.</CommandEmpty>
                <CommandGroup>
                  {tags.slice(0, 50).map((tag) => {
                    const isSelected = selectedTag === tag.name;
                    return (
                      <CommandItem
                        key={tag.name}
                        value={tag.name}
                        onSelect={() => handleTagSelect(tag.name)}
                        className={getMenuItemClass(isSelected)}
                      >
                        <Hash
                          className={cn(
                            "mr-2 h-3 w-3 opacity-50",
                            isSelected && "text-blue-600 opacity-100 dark:text-amber-500",
                          )}
                        />
                        {tag.name}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {/* Divider */}
        <div className="w-1px mx-2 hidden h-4 bg-neutral-200 md:block dark:bg-neutral-700" />

        {/* Sort Tabs */}
        <div className="flex items-center gap-1">
          <button
            className={getSortTabClass(sortBy === "latest")}
            onClick={() => {
              if (selectedCategory && selectedCategory !== "all") {
                navigate(`/forum/category/${selectedCategory}/latest`);
              } else {
                navigate("/forum/latest");
              }
            }}
          >
            最新
          </button>
          <button
            className={getSortTabClass(sortBy === "hot")}
            onClick={() => {
              if (selectedCategory && selectedCategory !== "all") {
                navigate(`/forum/category/${selectedCategory}/hot`);
              } else {
                navigate("/forum/hot");
              }
            }}
          >
            热门
          </button>
        </div>
      </div>

      {/* Right: Action */}
      <div className="flex items-center gap-3">
        {/* Edit Category Button - Only show when a specific category is selected */}
        {selectedCategory && selectedCategory !== "all" && (
          <Link to={`/forum/category/${selectedCategory}/edit`}>
            <button
              className={cn(
                "flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200",
              )}
              title="编辑类别"
            >
              <Wrench className="h-4 w-4" />
            </button>
          </Link>
        )}

        {/* Create Topic Button - 使用 Composer 组件 */}
        <button
          onClick={() => {
            import("../../Composer/ComposerStore").then(({ useComposerStore }) => {
              useComposerStore.getState().open("CREATE_TOPIC", {
                categoryId: selectedCategory !== "all" ? selectedCategory : "",
              });
            });
          }}
          className={cn(
            "flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-amber-500 dark:hover:bg-amber-600",
          )}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">新建话题</span>
          <span className="sm:hidden">新建</span>
        </button>
      </div>
    </div>
  );
}
