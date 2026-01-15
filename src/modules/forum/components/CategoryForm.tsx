import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Undo2 } from "lucide-react";
import { useForumTheme } from "../context/ForumThemeContext";
import { ColorPicker } from "@/modules/forum/components/ui/color-picker";
import { IconPicker } from "@/modules/forum/components/ui/icon-picker";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { ForumsCategoriesService, type CreateCategoryDto } from "@/api";

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
  };
  categoryId?: string; // 编辑模式下需要
  onSuccess?: (id: string) => void;
}

/**
 * 类别表单组件
 * 用于新建和编辑类别，复用相同的表单结构
 */
export function CategoryForm({ mode, initialData, categoryId, onSuccess }: CategoryFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { colors } = useForumTheme();

  // 表单状态
  const [name, setName] = useState(initialData?.name || "");
  // const [slug, setSlug] = useState(initialData?.slug || ""); // Slug 不再使用
  const [description, setDescription] = useState(initialData?.description || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [color, setColor] = useState(initialData?.color || "#6b7280");

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
      {/* 页面头部 */}

      <div className="mb-6 flex max-w-3xl items-center justify-between gap-4">
        <h1 className={`text-xl font-bold ${colors.textPrimary}`}>
          {mode === "create" ? "新建类别" : "编辑类别"}
        </h1>

        {/* 返回话题按钮 (仅在编辑模式下显示) */}
        {mode === "edit" && categoryId && (
          <button
            type="button"
            onClick={() => navigate(`/forum/category/${categoryId}`)}
            className={`flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 dark:bg-amber-500/10 dark:text-amber-500 dark:hover:bg-amber-500/20`}
            title="返回话题列表"
          >
            <Undo2 className="h-4 w-4" />
            <span>返回话题</span>
          </button>
        )}
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* 类别名称 */}
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

        {/* 类别描述 */}
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

        {/* 主题颜色 */}
        <div>
          <label className={`mb-2 block text-sm font-medium ${colors.textSecondary}`}>
            主题颜色
          </label>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        {/* 类别图标 */}
        <div>
          <label className={`mb-2 block text-sm font-medium ${colors.textSecondary}`}>
            类别图标
          </label>
          <IconPicker value={icon} onChange={setIcon} />
        </div>

        {/* 分割线 */}
        <div className={`border-t border-gray-200 dark:border-neutral-700`} />

        {/* 提交按钮 */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "create" ? "创建类别" : "保存更改"}
          </button>
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
