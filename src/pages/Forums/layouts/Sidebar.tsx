import { Home, Users, Pencil, Hash, Square, LayoutGrid, ChevronDown } from "lucide-react";
import { useForumTheme } from "../context/ForumThemeContext";
import { useForumsCategories } from "../hooks/useForumsCategories";
import { useForumsTagsQuery } from "../hooks/useForumsTagsQuery";
import { SidebarCustomizeModal } from "./SidebarCustomizeModal";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersService, ForumCategory, ForumTag } from "@/api";
import { useNavigate, useLocation } from "react-router-dom";
import { getIconByName } from "@/components/ui/icon-picker";

// Extended types to include ID which might be missing in generated DTOs
type ExtendedForumCategory = ForumCategory & { id: string };
type ExtendedForumTag = ForumTag & { id: string };

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const NAV_ITEMS = [{ id: "topics", name: "话题", icon: Home, path: "/forum/latest" }];

/**
 * 分割线组件
 */
function Divider({ className = "" }: { className?: string }) {
  const { colors } = useForumTheme();
  return <div className={`border-t ${colors.borderColor} ${className}`} />;
}

export function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  const { theme, colors } = useForumTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // 伸缩状态（默认展开）
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);

  // 1. Fetch Data
  const { data } = useForumsCategories();
  const allCategories = (data || []) as ExtendedForumCategory[];

  const { data: tagsData } = useForumsTagsQuery();
  const allTags = (tagsData || []) as ExtendedForumTag[];

  // 2. Fetch User Customization Preferences
  const { data: userPreferences, isLoading: isPrefsLoading } = useQuery({
    queryKey: ["user", "preferences"],
    queryFn: async () => {
      try {
        const response = await UsersService.usersPreferencesControllerGet();
        return response.data;
      } catch (err) {
        // Fallback or ignore if not logged in
        return null;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  });

  // 3. Mutation to save preferences
  const savePreferencesMutation = useMutation({
    mutationFn: (data: { forumSidebarCategories?: string[]; forumSidebarTags?: string[] }) => {
      return UsersService.usersPreferencesControllerSave(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "preferences"] });
    },
  });

  // 4. Compute displayed items based on preferences
  const displayedCategories = useMemo(() => {
    // If no prefs (visitor), show top 5 or all? Let's show all for now or top 6
    // If prefs exist but empty list, maybe means "show nothing" or "default"?
    // PRD says: "If user clears selection: show default recommended".
    // Let's assume if array is undefined/null => usage default. If empty array => show nothing.

    // Default logic: Show all if no preference set
    // Also if user preferences is empty array (user unchecked everything), show default recommended
    const sidebarCategories = userPreferences?.forumSidebarCategories;
    if (!sidebarCategories || sidebarCategories.length === 0) {
      return allCategories.slice(0, 10); // Show max 10/all by default
    }

    return allCategories.filter((cat) => sidebarCategories.includes(cat.id));
  }, [allCategories, userPreferences?.forumSidebarCategories]);

  const displayedTags = useMemo(() => {
    const sidebarTags = userPreferences?.forumSidebarTags;
    if (!sidebarTags || sidebarTags.length === 0) {
      return allTags.slice(0, 20); // Show top 20 by default
    }

    return allTags.filter((tag) => sidebarTags.includes(tag.id));
  }, [allTags, userPreferences?.forumSidebarTags]);

  // Handlers
  const handleSaveCategories = (ids: string[]) => {
    // If user clears all, maybe we want to save empty array.
    savePreferencesMutation.mutate({ forumSidebarCategories: ids });
  };

  const handleSaveTags = (ids: string[]) => {
    savePreferencesMutation.mutate({ forumSidebarTags: ids });
  };

  const handleResetCategories = () => {
    // Reset means setting to undefined so it falls back to default logic?
    // Or explicitly setting the "default" ids.
    // API DTO says optional. If we send null/undefined maybe it merges?
    // Usually usersPreferencesControllerSave is a PATCH (merge).
    // To "reset" we probably need to know what the default IDs are or specific logic.
    // For now, let's just select top 10 as "Default".
    const defaultIds = allCategories.slice(0, 10).map((c) => c.id);
    savePreferencesMutation.mutate({ forumSidebarCategories: defaultIds });
    setIsCategoryModalOpen(false);
  };

  const handleResetTags = () => {
    const defaultIds = allTags.slice(0, 20).map((t) => t.id);
    savePreferencesMutation.mutate({ forumSidebarTags: defaultIds });
    setIsTagModalOpen(false);
  };

  return (
    // 整体一个大卡片
    <div className="overflow-hidden pl-5 transition-colors">
      {/* 导航模块 - 直接显示导航项 */}
      {/* 导航模块 - 直接显示导航项 */}
      <nav className="space-y-1 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          // 根据当前路径判断激活状态
          const isActive =
            location.pathname === item.path || location.pathname.startsWith(item.path + "/");

          let buttonClass: string;
          if (isActive) {
            buttonClass =
              theme === "dark" ? "bg-amber-500/10 text-amber-500" : "bg-blue-50 text-blue-600";
          } else {
            buttonClass = `${colors.textSecondary} ${colors.buttonHover}`;
          }

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors ${buttonClass}`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm leading-none font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <Divider />

      {/* 话题分类模块 */}
      <div className="group">
        {/* 可点击的模块标题 */}
        <button
          onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
          className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition-colors ${colors.textSecondary} ${colors.buttonHover}`}
        >
          <div className="flex items-center gap-2">
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isCategoriesExpanded ? "" : "-rotate-90"
              }`}
            />
            <span className="text-sm font-medium">话题分类</span>
          </div>
          {userPreferences && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setIsCategoryModalOpen(true);
              }}
              className={`rounded p-1 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-700`}
              title="编辑分类"
            >
              <Pencil className="h-3.5 w-3.5" />
            </span>
          )}
        </button>

        {/* 可折叠的内容区域 */}
        <div
          className={`space-y-0.5 overflow-hidden transition-all duration-200 ${
            isCategoriesExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {displayedCategories.map((cat) => {
            // 使用路由路径判断激活状态
            const categoryPath = `/forum/category/${cat.id}`;
            const isActive = location.pathname === categoryPath;

            let buttonClass: string;
            if (isActive) {
              buttonClass =
                theme === "dark" ? "bg-neutral-800 text-neutral-200" : "bg-gray-100 text-gray-900";
            } else {
              buttonClass = `${colors.textSecondary} ${colors.buttonHover}`;
            }

            return (
              <button
                key={cat.id}
                onClick={() => navigate(categoryPath)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition-colors ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  {/* Category Icon or Color Block */}
                  {(() => {
                    const IconComponent = cat.icon ? getIconByName(cat.icon) : null;
                    if (IconComponent) {
                      return <IconComponent className="h-3.5 w-3.5" style={{ color: cat.color }} />;
                    }
                    return cat.color ? (
                      <span
                        className="h-3 w-3 rounded-[2px]"
                        style={{ backgroundColor: cat.color }}
                      />
                    ) : (
                      <Square className="h-3 w-3 text-gray-400" />
                    );
                  })()}
                  <span className="text-sm">{cat.name}</span>
                </div>
              </button>
            );
          })}

          <button
            onClick={() => navigate("/forum/categories")}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${colors.textSecondary} ${colors.buttonHover}`}
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className="h-4 w-4" />
              <span className="text-sm">所有类别</span>
            </div>
          </button>
        </div>
      </div>

      <Divider />

      {/* 热门标签模块 */}
      <div className="group">
        {/* 可点击的模块标题 */}
        <button
          onClick={() => setIsTagsExpanded(!isTagsExpanded)}
          className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition-colors ${colors.textSecondary} ${colors.buttonHover}`}
        >
          <div className="flex items-center gap-2">
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isTagsExpanded ? "" : "-rotate-90"
              }`}
            />
            <span className="text-sm font-medium">热门标签</span>
          </div>
          {userPreferences && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setIsTagModalOpen(true);
              }}
              className={`rounded p-1 text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-700`}
              title="编辑标签"
            >
              <Pencil className="h-3.5 w-3.5" />
            </span>
          )}
        </button>

        {/* 可折叠的内容区域 */}
        <div
          className={`space-y-0.5 overflow-hidden transition-all duration-200 ${
            isTagsExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {displayedTags.map((tag) => {
            const tagPath = `/forum/tag/${tag.id}`;
            const isActive = location.pathname === tagPath;

            let buttonClass: string;
            if (isActive) {
              buttonClass =
                theme === "dark" ? "bg-neutral-800 text-neutral-200" : "bg-gray-100 text-gray-900";
            } else {
              buttonClass = `${colors.textSecondary} ${colors.buttonHover}`;
            }

            return (
              <button
                key={tag.id}
                onClick={() => navigate(tagPath)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition-colors ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  <Hash className="h-3 w-3 opacity-50" />
                  <span className="text-sm">{tag.name}</span>
                </div>
              </button>
            );
          })}

          <button
            onClick={() => navigate("/forum/tags")}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${colors.textSecondary} ${colors.buttonHover}`}
          >
            <div className="flex items-center gap-3">
              <LayoutGrid className="h-4 w-4" />
              <span className="text-sm">所有标签</span>
            </div>
          </button>
        </div>
      </div>

      <Divider />

      {/* 社区统计模块 - 统一样式 */}
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Users className={`h-4 w-4 ${theme === "dark" ? "text-amber-500" : "text-blue-600"}`} />
          <h3 className={`text-xs font-semibold tracking-wider uppercase ${colors.textMuted}`}>
            社区统计
          </h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className={colors.textSecondary}>总用户数</span>
            <span className={`font-medium ${colors.textPrimary}`}>128,456</span>
          </div>
          <div className="flex justify-between">
            <span className={colors.textSecondary}>今日活跃</span>
            <span className={`font-medium ${colors.textPrimary}`}>12,345</span>
          </div>
          <div className="flex justify-between">
            <span className={colors.textSecondary}>总帖子数</span>
            <span className={`font-medium ${colors.textPrimary}`}>456,789</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SidebarCustomizeModal
        title="编辑类别导航"
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        items={allCategories.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          color: c.color,
        }))}
        selectedIds={
          userPreferences?.forumSidebarCategories || displayedCategories.map((c) => c.id)
        }
        onSave={handleSaveCategories}
        onReset={handleResetCategories}
        isLoading={savePreferencesMutation.isPending}
      />

      <SidebarCustomizeModal
        title="编辑标签导航"
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        items={allTags.map((t) => ({
          id: t.id,
          name: t.name,
          // Tags might not have color/desc properly mapped in simple DTO but let's pass what we have
        }))}
        selectedIds={userPreferences?.forumSidebarTags || displayedTags.map((t) => t.id)}
        onSave={handleSaveTags}
        onReset={handleResetTags}
        isLoading={savePreferencesMutation.isPending}
      />
    </div>
  );
}
