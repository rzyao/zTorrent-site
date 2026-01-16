import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Undo2 } from "lucide-react";
import { useForumTheme } from "../context/ForumThemeContext";
import { ColorPicker } from "@/modules/forum/components/ui/color-picker";
import { IconPicker } from "@/modules/forum/components/ui/icon-picker";
import { ActionButton } from "@/modules/forum/components/ui/ActionButton";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { ForumsCategoriesService, type CreateCategoryDto } from "@/api";
import { useForumsTagsQuery } from "../hooks/useForumsTagsQuery";
import { useTagGroupsQuery, ForumTagGroupWithId } from "../hooks/useTagGroups";

// 将中文转为 slug（简化版，实际可能需要 pinyin 库）
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // 空格转连字符
    .replace(/[^\w\u4e00-\u9fa5-]/g, "") // 移除特殊字符，保留中文
    .replace(/--+/g, "-") // 合并多个连字符
    .replace(/^-+|-+$/g, ""); // 移除首尾连字符
}

interface CategoryFormProps {
  mode: "create" | "edit";
  initialData?: {
    name: string;
    // slug: string; // 移除 slug
    description?: string;
    icon?: string;
    color?: string;
    allowOtherTags?: boolean;
  };
  categoryId?: string; // 编辑模式下需要
  onSuccess?: (id: string) => void;
  activeSection?: "basic" | "appearance" | "visibility" | "advanced";
}

/**
 * 类别表单组件
 * 用于新建和编辑类别，复用相同的表单结构
 */
export function CategoryForm({ mode, initialData, categoryId, onSuccess, activeSection = "basic" }: CategoryFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { colors } = useForumTheme();

  // 表单状态
  const [name, setName] = useState(initialData?.name || "");
  // const [slug, setSlug] = useState(initialData?.slug || ""); // Slug 不再使用
  const [description, setDescription] = useState(initialData?.description || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [color, setColor] = useState(initialData?.color || "#6b7280");
  const [allowOtherTags, setAllowOtherTags] = useState<boolean>(initialData?.allowOtherTags ?? false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const { data: tags = [] } = useForumsTagsQuery();
  const { data: tagGroupsData } = useTagGroupsQuery(1, 200);
  const tagGroups = (tagGroupsData as any)?.items || [];

  useEffect(() => {
    const run = async () => {
      if (mode !== "edit" || activeSection !== "visibility" || !categoryId) return;
      try {
        const res = await ForumsCategoriesService.categoriesControllerFindCategoryTags({
          categoryId: categoryId,
          grouped: true,
          page: 1,
          limit: 200,
        } as any);
        const d: any = res.data || {};
        let groupIds: string[] = [];
        let tagIds: string[] = [];
        if (Array.isArray(d?.groups)) {
          groupIds = d.groups.map((g: any) => String(g?.id));
          d.groups.forEach((g: any) => {
            if (Array.isArray(g?.tags)) {
              tagIds.push(
                ...g.tags.map((t: any) => String(t?.id ?? t?.name ?? "")),
              );
            }
          });
        }
        if (Array.isArray(d?.ungroupedTags)) {
          tagIds.push(...d.ungroupedTags.map((t: any) => String(t?.id ?? t?.name ?? "")));
        }
        if (tagIds.length === 0) {
          const fallbackTagIds =
            Array.isArray(d?.allowedTags) ? d.allowedTags : Array.isArray(d?.allowed_tag_ids) ? d.allowed_tag_ids : [];
          tagIds = fallbackTagIds.map(String);
        }
        if (groupIds.length === 0) {
          const fallbackGroupIds =
            Array.isArray(d?.allowedGroups)
              ? d.allowedGroups
              : Array.isArray(d?.allowed_group_ids)
                ? d.allowed_group_ids
                : [];
          groupIds = fallbackGroupIds.map(String);
        }
        if (tagIds.length > 0) setSelectedTagIds(Array.from(new Set(tagIds)));
        if (groupIds.length > 0) setSelectedGroupIds(Array.from(new Set(groupIds)));
        if (typeof d?.allowOtherTags === "boolean") setAllowOtherTags(d.allowOtherTags);
      } catch { }
    };
    run();
  }, [categoryId, activeSection, mode]);

  // 移除 slug 自动生成副作用

  // 异步操作
  const { execute, loading } = useAsyncAction({
    successMessage: mode === "create" ? "类别创建成功" : "类别保存成功",
  });

  // 表单验证
  const isValid = name.trim().length > 0;

  // 提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    const data: CreateCategoryDto = {
      name: name.trim(),
      slug: generateSlug(name), // 内部自动生成，不展示给用户
      description: description.trim() || undefined,
      icon: icon || undefined,
      color: color || undefined,
      isActive: true,
    };

    await execute(async () => {
      // 无论创建还是更新，都需要刷新侧边栏的类别列表
      // 我们在请求完成后立即刷新，确保跳转后的页面能看到最新数据
      // 注意：这里放在同一个 execute 块中，如果失败会抛出异常，不会执行后续 logic

      if (mode === "create") {
        const response = await ForumsCategoriesService.categoriesControllerCreate(data);
        const newId = (response.data as any)?.id;

        // 刷新缓存
        await queryClient.invalidateQueries({ queryKey: ["forums", "categories"] });

        onSuccess?.(newId);
        // 跳转到编辑页面
        navigate(`/forum/category/${newId}/edit`);
      } else {
        // 编辑模式
        await ForumsCategoriesService.categoriesControllerUpdate({
          id: categoryId!,
          ...data,
        });
        // 追加：更新该类别的标签可见性配置
        try {
          await ForumsCategoriesService.categoriesControllerUpdateVisibility({
            id: categoryId!,
            allowOtherTags,
            allowedTags: selectedTagIds,
            allowedGroups: selectedGroupIds,
          } as any);
        } catch (err) {
          // 保持主流程成功，但提醒用户可见性未更新
          console.error("Update visibility failed", err);
        }

        // 刷新缓存
        await queryClient.invalidateQueries({ queryKey: ["forums", "categories"] });
        // 如果我们是基于 ID 获取单个类别的（比如在 EditCategoryPage 中），
        // 最好也刷新该类别的详情缓存，虽然我们这里没直接用到，但好习惯
        if (categoryId) {
          await queryClient.invalidateQueries({
            queryKey: ["forum", "category", "by-id", categoryId],
          });
        }

        onSuccess?.(categoryId!);
      }
    });
  };

  return (
    <div className="py-6">

      {mode === "create" && (
        <div className="mb-6 flex max-w-3xl items-center justify-between gap-4">
          <h1 className={`text-xl font-bold ${colors.textPrimary}`}>新建类别</h1>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {activeSection === "basic" && (
          <div>
            <label
              htmlFor="name"
              className={`mb-2 block text-sm font-medium ${colors.textSecondary}`}
            >
              类别名称 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入类别名称..."
              maxLength={50}
              className={`h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:border-amber-500 dark:focus:ring-amber-500/30`}
            />
            {/* 自动生成的 slug 预览 (已隐藏) */}
          </div>
        )}

        {activeSection === "basic" && (
          <div>
            <label
              htmlFor="description"
              className={`mb-2 block text-sm font-medium ${colors.textSecondary}`}
            >
              类别描述
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入类别描述（可选）..."
              rows={3}
              maxLength={500}
              className={`w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:border-amber-500 dark:focus:ring-amber-500/30`}
            />
          </div>
        )}

        {/* appearance section anchor removed (route controls sections) */}
        {activeSection === "appearance" && (
          <div>
            <label className={`mb-2 block text-sm font-medium ${colors.textSecondary}`}>
              主题颜色
            </label>
            <ColorPicker value={color} onChange={setColor} />
          </div>
        )}

        {activeSection === "appearance" && (
          <div>
            <label className={`mb-2 block text-sm font-medium ${colors.textSecondary}`}>
              类别图标
            </label>
            <IconPicker value={icon} onChange={setIcon} />
          </div>
        )}



        {/* visibility section anchor removed (route controls sections) */}
        {mode === "edit" && activeSection === "visibility" && (
          <div className="space-y-4">
            <h2 className={`text-lg font-semibold ${colors.textPrimary}`}>标签可见性</h2>
            <p className={`text-sm ${colors.textMuted}`}>
              配置该分类允许使用的标签与标签组。启用“也允许其他标签”时，除白名单外还允许公共标签。
            </p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allowOtherTags}
                onChange={(e) => setAllowOtherTags(e.target.checked)}
                className="h-4 w-4"
              />
              <span className={colors.textSecondary}>也允许其他标签</span>
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className={`rounded-md border p-3 ${colors.cardBorder}`}>
                <div className={`mb-2 text-sm font-medium ${colors.textSecondary}`}>限制的标签</div>
                <ul className="max-h-[240px] overflow-auto">
                  {tags.map((t: any) => {
                    const key = String(t.id ?? t._id ?? t.name ?? "");
                    const checked = selectedTagIds.includes(key);
                    return (
                      <li
                        key={key}
                        className={`flex items-center justify-between border-b px-2 py-2 last:border-b-0 ${colors.dividerColor}`}
                      >
                        <label className="flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedTagIds((prev) =>
                                checked ? prev.filter((x) => x !== key) : [...prev, key],
                              )
                            }
                            className="h-4 w-4"
                          />
                          <span className={colors.textPrimary}>{t.name}</span>
                        </label>
                        <span className={`text-xs ${colors.textMuted}`}>{t.usageCount ?? 0} 个话题</span>
                      </li>
                    );
                  })}
                  {tags.length === 0 && (
                    <div className={`py-6 text-center text-sm ${colors.textMuted}`}>暂无标签</div>
                  )}
                </ul>
              </div>
              <div className={`rounded-md border p-3 ${colors.cardBorder}`}>
                <div className={`mb-2 text-sm font-medium ${colors.textSecondary}`}>限制的标签组</div>
                <ul className="max-h-[240px] overflow-auto">
                  {tagGroups.map((g: ForumTagGroupWithId) => {
                    const id = String((g as any).id ?? "");
                    const checked = selectedGroupIds.includes(id);
                    return (
                      <li
                        key={id}
                        className={`flex items-center justify-between border-b px-2 py-2 last:border-b-0 ${colors.dividerColor}`}
                      >
                        <label className="flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedGroupIds((prev) =>
                                checked ? prev.filter((x) => x !== id) : [...prev, id],
                              )
                            }
                            className="h-4 w-4"
                          />
                          <span className={colors.textPrimary}>{g.name}</span>
                        </label>
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block h-3 w-3 rounded"
                            style={{ backgroundColor: g.color || "#6b7280" }}
                          />
                          <span className={`text-xs ${colors.textMuted}`}>权重 {g.sortOrder ?? 0}</span>
                        </span>
                      </li>
                    );
                  })}
                  {tagGroups.length === 0 && (
                    <div className={`py-6 text-center text-sm ${colors.textMuted}`}>暂无标签组</div>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* advanced section anchor removed (route controls sections) */}
        <div className="flex items-center gap-3">
          <ActionButton type="submit" disabled={!isValid} loading={loading} className="h-11 px-6">
            {mode === "create" ? "创建类别" : "保存更改"}
          </ActionButton>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`h-11 rounded-lg px-6 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
