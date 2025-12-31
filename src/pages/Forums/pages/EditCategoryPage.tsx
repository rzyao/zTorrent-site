import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ForumsCategoriesService } from "@/api";
import { CategoryForm } from "../components/CategoryForm";
import { useForumTheme } from "../context/ForumThemeContext";
import { Loader2 } from "lucide-react";

/**
 * 编辑类别页面
 * 路由: /forum/category/:categoryId/edit
 * 权限: 仅管理员可访问
 */
export function EditCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { colors } = useForumTheme();

  // 通过 ID 获取类别数据
  const {
    data: category,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["forum", "category", "by-id", categoryId],
    queryFn: async () => {
      const response = await ForumsCategoriesService.categoriesControllerFindOne({
        id: categoryId!,
      });
      return response.data;
    },
    enabled: !!categoryId,
  });

  // 加载状态
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className={`h-8 w-8 animate-spin ${colors.textMuted}`} />
      </div>
    );
  }

  // 错误状态
  if (error || !category) {
    return (
      <div className="py-6">
        <div
          className={`rounded-lg border border-gray-200 bg-gray-50 p-6 text-center dark:border-neutral-700 dark:bg-neutral-800/50`}
        >
          <p className={colors.textMuted}>{error ? "加载类别失败" : "类别不存在"}</p>
        </div>
      </div>
    );
  }

  return (
    <CategoryForm
      mode="edit"
      categoryId={categoryId}
      initialData={{
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
      }}
    />
  );
}
