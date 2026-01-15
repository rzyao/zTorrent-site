import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersService } from "@/api";
// Hooks
import { useForumsCategories } from "../hooks/useForumsCategories";
import { useForumsTagsQuery } from "../hooks/useForumsTagsQuery";
// Components
import { SidebarCustomizeModal } from "./SidebarCustomizeModal";
import { SidebarNav } from "./Sidebar/SidebarNav";
import { SidebarDivider } from "./Sidebar/SidebarDivider";
import { SidebarCategories } from "./Sidebar/SidebarCategories";
import { SidebarTags } from "./Sidebar/SidebarTags";
import { SidebarStats } from "./Sidebar/SidebarStats";
// Types
import { ExtendedForumCategory, ExtendedForumTag } from "./Sidebar/types";

interface SidebarProps {
  /** 当前选中的分类 ID */
  selectedCategory: string;
  /** 分类切换回调函数 */
  onCategoryChange: (category: string) => void;
}

/**
 * 侧边栏主容器组件
 *
 * 职责：
 * 1. 组装各个侧边栏子模块 (导航、分类、标签、统计)
 * 2. 管理侧边栏的展开/收起状态
 * 3. 处理用户自定义侧边栏显示的偏好设置 (获取与保存)
 * 4. 负责数据的过滤与展示逻辑
 */
export function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  const queryClient = useQueryClient();

  // 模态框控制状态
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // 伸缩状态（默认展开）
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);

  // 1. 获取基础数据 (分类和标签)
  const { data } = useForumsCategories();
  const allCategories = (data || []) as ExtendedForumCategory[];

  const { data: tagsData } = useForumsTagsQuery();
  const allTags = (tagsData || []) as ExtendedForumTag[];

  // 2. 获取用户自定义偏好设置
  const { data: userPreferences, isLoading: isPrefsLoading } = useQuery({
    queryKey: ["user", "preferences"],
    queryFn: async () => {
      try {
        const response = await UsersService.usersPreferencesControllerGet();
        return response.data;
      } catch (err) {
        // 未登录或获取失败时忽略，返回 null 以使用默认显示逻辑
        return null;
      }
    },
    staleTime: 1000 * 60 * 60, // 缓存 1 小时
    retry: false,
  });

  // 3. 保存偏好设置的 Mutation
  const savePreferencesMutation = useMutation({
    mutationFn: (data: { forumSidebarCategories?: string[]; forumSidebarTags?: string[] }) => {
      return UsersService.usersPreferencesControllerSave(data);
    },
    onSuccess: () => {
      // 保存成功后刷新偏好设置查询
      queryClient.invalidateQueries({ queryKey: ["user", "preferences"] });
    },
  });

  // 4. 计算最终显示的列表项
  // 4. 计算最终显示的列表项
  const displayedCategories = useMemo(() => {
    const sidebarCategories = userPreferences?.forumSidebarCategories;
    // 如果没有偏好设置（如访客）或偏好设置为空数组
    // 默认行为：显示前 10 个分类
    if (!sidebarCategories || sidebarCategories.length === 0) {
      return allCategories.slice(0, 10);
    }
    // 否则仅显示用户选中的分类，并且严格按照用户的顺序
    return sidebarCategories
      .map((id) => allCategories.find((cat) => cat.id === id))
      .filter((cat): cat is ExtendedForumCategory => !!cat);
  }, [allCategories, userPreferences?.forumSidebarCategories]);

  const displayedTags = useMemo(() => {
    const sidebarTags = userPreferences?.forumSidebarTags;
    // 如果没有偏好设置（如访客）或偏好设置为空数组
    // 默认行为：显示前 20 个热门标签
    if (!sidebarTags || sidebarTags.length === 0) {
      return allTags.slice(0, 20);
    }
    // 否则仅显示用户选中的标签，并且严格按照用户的顺序
    return sidebarTags
      .map((id) => allTags.find((tag) => tag.id === id))
      .filter((tag): tag is ExtendedForumTag => !!tag);
  }, [allTags, userPreferences?.forumSidebarTags]);

  // 事件处理函数

  /** 保存分类偏好 */
  const handleSaveCategories = (ids: string[]) => {
    savePreferencesMutation.mutate({ forumSidebarCategories: ids });
  };

  /** 保存标签偏好 */
  const handleSaveTags = (ids: string[]) => {
    savePreferencesMutation.mutate({ forumSidebarTags: ids });
  };

  /** 重置分类偏好为默认值 */
  const handleResetCategories = () => {
    // 默认选中前 10 个
    const defaultIds = allCategories.slice(0, 10).map((c) => c.id);
    savePreferencesMutation.mutate({ forumSidebarCategories: defaultIds });
    setIsCategoryModalOpen(false);
  };

  /** 重置标签偏好为默认值 */
  const handleResetTags = () => {
    // 默认选中前 20 个
    const defaultIds = allTags.slice(0, 20).map((t) => t.id);
    savePreferencesMutation.mutate({ forumSidebarTags: defaultIds });
    setIsTagModalOpen(false);
  };

  return (
    // 整体一个大卡片
    <div className="overflow-hidden">
      <SidebarNav />

      <SidebarDivider />

      <SidebarCategories
        categories={displayedCategories}
        isExpanded={isCategoriesExpanded}
        onToggleExpand={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
        showEditButton={!!userPreferences}
        onEditClick={() => setIsCategoryModalOpen(true)}
      />

      <SidebarDivider />

      <SidebarTags
        tags={displayedTags}
        isExpanded={isTagsExpanded}
        onToggleExpand={() => setIsTagsExpanded(!isTagsExpanded)}
        showEditButton={!!userPreferences}
        onEditClick={() => setIsTagModalOpen(true)}
      />

      <SidebarDivider />

      <SidebarStats />

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
