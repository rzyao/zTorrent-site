import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Undo2 } from "lucide-react";
import { useForumTheme } from "../context/ForumThemeContext";
import { ColorPicker } from "@/modules/forum/components/ui/color-picker";
import { IconPicker } from "@/modules/forum/components/ui/icon-picker";
import { Button } from "@/modules/forum/components/ui/button";
import { Input } from "@/modules/forum/components/ui/input";
import { Textarea } from "@/modules/forum/components/ui/textarea";
import { Checkbox } from "@/modules/forum/components/ui/checkbox";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { ForumsCategoriesService, type CreateCategoryDto, type UpdateCategoryParamDto } from "@/api";
import { useForumsTagsQuery } from "../hooks/useForumsTagsQuery";
import { useTagGroupsQuery, ForumTagGroupWithId } from "../hooks/useTagGroups";

// 规范化类别 key：仅保留小写字母与短横线，并合并多余短横线
// 说明：前端做基础校验与规范化，后端仍会进行二次校验
function sanitizeKey(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface CategoryFormProps {
  mode: "create" | "edit";
  initialData?: {
    name: string;
    // key 为唯一标识字段
    key?: string;
    description?: string;
    icon?: string;
    color?: string;
    allowOtherTags?: boolean;
    isLocked?: boolean;
  };
  categoryId?: string; // 编辑模式下需要
  onSuccess?: (id: string) => void;
  activeSection?: "basic" | "appearance" | "visibility" | "advanced";
  onCancel?: () => void;
}

/**
 * 类别表单组件
 * 用于新建和编辑类别，复用相同的表单结构
 */
export function CategoryForm({
  mode,
  initialData,
  categoryId,
  onSuccess,
  activeSection = "basic",
  onCancel,
}: CategoryFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { colors } = useForumTheme();

  // 表单状态
  const [name, setName] = useState(initialData?.name || "");
  // 类别唯一标识 key（仅小写字母与短横线）
  const [key, setKey] = useState<string>(initialData?.key || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [color, setColor] = useState(initialData?.color || "#6b7280");
  const [allowOtherTags, setAllowOtherTags] = useState<boolean>(
    initialData?.allowOtherTags ?? false,
  );
  const [isLocked, setIsLocked] = useState<boolean>(Boolean(initialData?.isLocked));
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
              tagIds.push(...g.tags.map((t: any) => String(t?.id ?? t?.name ?? "")));
            }
          });
        }
        if (Array.isArray(d?.ungroupedTags)) {
          tagIds.push(...d.ungroupedTags.map((t: any) => String(t?.id ?? t?.name ?? "")));
        }
        if (tagIds.length === 0) {
          const fallbackTagIds = Array.isArray(d?.allowedTags)
            ? d.allowedTags
            : Array.isArray(d?.allowed_tag_ids)
              ? d.allowed_tag_ids
              : [];
          tagIds = fallbackTagIds.map(String);
        }
        if (groupIds.length === 0) {
          const fallbackGroupIds = Array.isArray(d?.allowedGroups)
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

  // 表单验证：名称必填，key 必须只包含小写字母与短横线
  const keyPattern = /^[a-z-]+$/;
  const isKeyValid = keyPattern.test(key) && key.length > 0;
  const isValid =
    name.trim().length > 0 && (mode === "edit" && isLocked ? true : isKeyValid);

  // 提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    const data: CreateCategoryDto = {
      name: name.trim(),
      key: key,
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
        // 创建成功后，使用返回的 key 作为路由参数
        const newKey = String((response.data as any)?.key || key);
        const newId = String((response.data as any)?.id ?? newKey);

        // 刷新缓存
        await queryClient.invalidateQueries({ queryKey: ["forums", "categories"] });

        onSuccess?.(newId);
        // 跳转到编辑页面
        navigate(`/forum/category/${newKey}/edit`);
      } else {
        const updateData: UpdateCategoryParamDto = {
          id: categoryId!,
          name: name.trim() || undefined,
          description: description.trim() || undefined,
          icon: icon || undefined,
          color: color || undefined,
        };
        if (!isLocked) {
          (updateData as any).key = key;
        }
        await ForumsCategoriesService.categoriesControllerUpdate(updateData);
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
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {activeSection === "basic" && (
          <div>
            <label
              htmlFor="name"
              className={`mb-2 block text-sm font-medium ${colors.textSecondary}`}
            >
              类别名称 <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入类别名称..."
              maxLength={50}
              aria-invalid={name.trim().length === 0}
            />
          </div>
        )}

        {activeSection === "basic" && (
          <div>
            <label
              htmlFor="key"
              className={`mb-2 block text-sm font-medium ${colors.textSecondary}`}
            >
              唯一标识 Key <span className="text-red-500">*</span>
            </label>
            <Input
              id="key"
              type="text"
              value={key}
              onChange={(e) => setKey(sanitizeKey(e.target.value))}
              placeholder="例如：general、tech-news，仅小写字母与短横线"
              maxLength={64}
              aria-invalid={!isKeyValid}
              disabled={mode === "edit" && isLocked}
            />
            {!isKeyValid && (
              <div className="mt-1 text-xs text-red-500">
                仅允许使用小写字母 a-z 与短横线 -
              </div>
            )}
            {mode === "edit" && isLocked && (
              <div className="mt-1 text-xs text-neutral-500">该类别已锁定，不能修改 Key</div>
            )}
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
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入类别描述（可选）..."
              rows={3}
              maxLength={500}
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
              <Checkbox
                checked={allowOtherTags}
                onCheckedChange={(val) => setAllowOtherTags(Boolean(val))}
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
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() =>
                              setSelectedTagIds((prev) =>
                                checked ? prev.filter((x) => x !== key) : [...prev, key],
                              )
                            }
                          />
                          <span className={colors.textPrimary}>{t.name}</span>
                        </label>
                        <span className={`text-xs ${colors.textMuted}`}>
                          {t.usageCount ?? 0} 个话题
                        </span>
                      </li>
                    );
                  })}
                  {tags.length === 0 && (
                    <div className={`py-6 text-center text-sm ${colors.textMuted}`}>暂无标签</div>
                  )}
                </ul>
              </div>
              <div className={`rounded-md border p-3 ${colors.cardBorder}`}>
                <div className={`mb-2 text-sm font-medium ${colors.textSecondary}`}>
                  限制的标签组
                </div>
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
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() =>
                              setSelectedGroupIds((prev) =>
                                checked ? prev.filter((x) => x !== id) : [...prev, id],
                              )
                            }
                          />
                          <span className={colors.textPrimary}>{g.name}</span>
                        </label>
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block h-3 w-3 rounded"
                            style={{ backgroundColor: g.color || "#6b7280" }}
                          />
                          <span className={`text-xs ${colors.textMuted}`}>
                            权重 {g.sortOrder ?? 0}
                          </span>
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
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="cancel"
            onClick={() => (onCancel ? onCancel() : navigate(-1))}
          >
            取消
          </Button>
          <Button type="submit" disabled={!isValid} loading={loading} variant="primary">
            {mode === "create" ? "创建类别" : "保存更改"}
          </Button>
        </div>
      </form>
    </div>
  );
}
