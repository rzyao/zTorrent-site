import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ForumsCategoriesService } from "@/api";
import { CategoryForm } from "../components/CategoryForm";
import { CategoryEditLayout } from "../components/CategoryEditLayout";
import { Undo2, Trash2, Loader2 } from "lucide-react";
import { useForumTheme } from "../context/ForumThemeContext";
import { Button } from "../components/ui/button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { useQueryClient } from "@tanstack/react-query";
import { useAccess } from "@/context/AccessContext";

/**
 * 编辑类别页面
 * 路由: /forum/category/:categoryKey/edit
 * 权限: 仅管理员可访问
 */
export function EditCategoryPage() {
  const { categoryKey, categoryId } = useParams<{ categoryKey?: string; categoryId?: string }>();
  const categoryKeyParam = categoryKey ?? categoryId;
  const { colors } = useForumTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { access } = useAccess();
  // 权限判定：仅 admin 或具备相应权限的用户显示删除入口
  const canManage =
    access?.username === "admin" ||
    (Array.isArray(access?.roles) && access.roles.includes("admin")) ||
    (Array.isArray(access?.permissions) &&
      (access.permissions.includes("forums:categories:delete") ||
        access.permissions.includes("forum:category:delete")));
  // 删除确认弹窗状态
  const [confirmOpen, setConfirmOpen] = useState(false);
  // 通用异步操作（带 loading 与 toast），删除成功提示“删除成功”
  const { execute, loading } = useAsyncAction({ successMessage: "删除成功" });
  type SectionKey = "basic" | "appearance" | "visibility" | "advanced";
  const rawSection = useParams<{ section?: string }>().section;
  const section: SectionKey =
    rawSection === "appearance" || rawSection === "visibility" || rawSection === "advanced"
      ? (rawSection as SectionKey)
      : "basic";

  // 通过 key 获取类别数据
  const {
    data: category,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["forum", "category", "by-key", categoryKeyParam],
    queryFn: async () => {
      const response = await ForumsCategoriesService.categoriesControllerFindByKey({
        key: categoryKeyParam!,
      });
      return response.data;
    },
    enabled: !!categoryKeyParam,
    // 删除后该详情会返回 404，不属于可重试的瞬时错误
    // 为避免重复请求，这里关闭 404 的自动重试
    retry: (failureCount, error: any) => {
      const status =
        error?.response?.status ||
        error?.status ||
        error?.body?.statuscode ||
        error?.data?.statuscode;
      return status !== 404 && failureCount < 2;
    },
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
        section === "basic"
          ? "basic-info"
          : section === "appearance"
            ? "appearance"
            : section === "visibility"
              ? "visibility"
              : "advanced"
      }
      onSelect={(id) => {
        const map: Record<string, string> = {
          "basic-info": "basic",
          appearance: "appearance",
          visibility: "visibility",
          advanced: "advanced",
        };
        navigate(`/forum/category/${(category as any)?.key}/edit/${map[id]}`);
      }}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className={`text-xl font-bold ${colors.textPrimary}`}>编辑类别 :</h1>
            <span className={`text-xl font-bold ${colors.textPrimary}`}>
              {(category as any)?.name}
            </span>
          </div>
          {category && (
            <Button
              type="button"
              variant="none"
              size="sm"
              onClick={() => navigate(`/forum/category/${(category as any)?.key}`)}
              className="flex items-center gap-2 bg-[#0088CC]/10 px-3 font-medium text-[#0088CC] transition-colors hover:bg-[#0088CC]/20 dark:bg-amber-500/10 dark:text-amber-500 dark:hover:bg-amber-500/20"
              title="返回话题列表"
            >
              <Undo2 className="h-4 w-4" />
              <span>返回话题</span>
            </Button>
          )}
        </div>
      }
    >
      {section === "advanced" && canManage && (
        <div className="mt-8 max-w-3xl rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20">
          <h2 className={`mb-2 text-lg font-semibold text-red-700 dark:text-red-400`}>危险操作</h2>
          <p className={`mb-4 text-sm ${colors.textSecondary}`}>
            删除此类别后，将从类别列表中移除，并可能影响其下的话题显示。请谨慎操作。
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            aria-label="删除此类别"
          >
            <Trash2 className="h-4 w-4" />
            删除此类别
          </Button>
        </div>
      )}
      <CategoryForm
        mode="edit"
        // 更新/删除等操作仍需使用内部 ID，这里从详情中提取
        categoryId={String((category as any)?.id ?? "")}
        initialData={{
          name: category.name,
          key: (category as any)?.key ?? "",
          description: category.description,
          icon: category.icon,
          color: category.color,
          allowOtherTags: (category as any)?.allowOtherTags ?? false,
          isLocked: Boolean((category as any)?.isLocked),
        }}
        activeSection={section}
      />

      {/* 删除确认弹窗：确认后删除并失效相关缓存，随后导航回类别列表 */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="删除类别"
        content={
          <div>
            确定要删除
            <span className="mx-1 font-semibold text-gray-900 dark:text-neutral-100">
              {(category as any)?.name ?? ""}
            </span>
            吗？此操作可能影响该类别下的话题。
          </div>
        }
        confirmText="确定删除"
        cancelText="取消"
        confirmLoading={loading}
        onConfirm={async () => {
          const categoryId = String((category as any)?.id ?? "");
          if (!categoryId) return;
          await execute(async () => {
            await ForumsCategoriesService.categoriesControllerRemove({ id: categoryId });
            await queryClient.invalidateQueries({ queryKey: ["forums", "categories"] });
            // 删除后不再需要此详情，直接移除缓存，避免触发不必要的 404 拉取
            await queryClient.removeQueries({
              queryKey: ["forum", "category", "by-key", categoryKeyParam],
            });
          });
          setConfirmOpen(false);
          navigate("/forum/categories");
        }}
      />
    </CategoryEditLayout>
  );
}
