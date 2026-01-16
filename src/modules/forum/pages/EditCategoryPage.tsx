import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ForumsCategoriesService } from "@/api";
import { CategoryForm } from "../components/CategoryForm";
import { CategoryEditLayout } from "../components/CategoryEditLayout";
import { Undo2 } from "lucide-react";
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
  const navigate = useNavigate();
  type SectionKey = "basic" | "appearance" | "visibility" | "advanced";
  const rawSection = useParams<{ section?: string }>().section;
  const section: SectionKey =
    rawSection === "appearance" || rawSection === "visibility" || rawSection === "advanced"
      ? (rawSection as SectionKey)
      : "basic";

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
    <CategoryEditLayout
      navItems={[
        { id: "basic-info", label: "基本信息" },
        { id: "appearance", label: "外观设置" },
        { id: "visibility", label: "标签可见性" },
        { id: "advanced", label: "高级设置" },
      ]}
      activeId={
        section === "basic" ? "basic-info" : section === "appearance" ? "appearance" : section === "visibility" ? "visibility" : "advanced"
      }
      onSelect={(id) => {
        const map: Record<string, string> = {
          "basic-info": "basic",
          appearance: "appearance",
          visibility: "visibility",
          advanced: "advanced",
        };
        navigate(`/forum/category/${categoryId}/edit/${map[id]}`);
      }}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className={`text-xl font-bold ${colors.textPrimary}`}>编辑类别 :</h1>
            <span className={`text-xl font-bold ${colors.textPrimary}`}>{(category as any)?.name}</span>
          </div>
          {categoryId && (
            <button
              type="button"
              onClick={() => navigate(`/forum/category/${categoryId}`)}
              className={`flex items-center gap-2 rounded-lg bg-[#0088CC]/10 px-3 py-2 text-sm font-medium text-[#0088CC] transition-colors hover:bg-[#0088CC]/20 dark:bg-amber-500/10 dark:text-amber-500 dark:hover:bg-amber-500/20`}
              title="返回话题列表"
            >
              <Undo2 className="h-4 w-4" />
              <span>返回话题</span>
            </button>
          )}
        </div>
      }
    >
      <CategoryForm
        mode="edit"
        categoryId={categoryId}
        initialData={{
          name: category.name,
          description: category.description,
          icon: category.icon,
          color: category.color,
          allowOtherTags: (category as any)?.allowOtherTags ?? false,
        }}
        activeSection={section}
      />
    </CategoryEditLayout>
  );
}
