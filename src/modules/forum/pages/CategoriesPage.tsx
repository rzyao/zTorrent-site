import React from "react";
import { useForumsCategories } from "../hooks/useForumsCategories";
import { Link, useNavigate } from "react-router-dom";
import { useForumTheme } from "../context/ForumThemeContext";
import { MessageSquare, TrendingUp, Plus, Trash2, Pencil } from "lucide-react";
import { ActionButton } from "../components/ui/ActionButton";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { useQueryClient } from "@tanstack/react-query";
import { ForumsCategoriesService } from "@/api";
import { useAccess } from "@/context/AccessContext";

/**
 * 所有类别页面 - 参考 linux.do/categories 风格设计
 * 采用分割线布局，每个分类显示彩色边栏、描述和统计数据
 */
export function CategoriesPage() {
  const { data: categories, isLoading } = useForumsCategories();
  const { theme, colors } = useForumTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { access } = useAccess();
  // 权限判定：仅 admin 或具备相应权限的用户显示管理操作
  const canManageCategories =
    access?.username === "admin" ||
    (Array.isArray(access?.roles) && access.roles.includes("admin")) ||
    (Array.isArray(access?.permissions) &&
      (access.permissions.includes("forums:categories:delete") ||
        access.permissions.includes("forum:category:delete")));
  // 删除确认弹窗状态
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  // 待删除的类别（保存 id 与 name 仅用于确认文案显示）
  const [pendingDelete, setPendingDelete] = React.useState<{ id: string; name: string } | null>(null);
  // 通用异步操作（带 loading 与 toast），删除成功提示“删除成功”
  const { execute, loading } = useAsyncAction({
    successMessage: "删除成功",
  });

  // 加载状态
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="mb-4 h-7 w-28 animate-pulse rounded bg-neutral-700" />
        <div className="space-y-0">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-20 animate-pulse border-b border-gray-200 dark:border-neutral-700/50`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* 页面标题栏 */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className={`text-lg font-semibold ${colors.textPrimary}`}>所有类别</h1>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${colors.textMuted}`}>{categories?.length || 0} 个类别</span>
          {/* 新话题（全局） */}
          <ActionButton
            onClick={() => {
              import("../components/Composer/ComposerStore").then(({ useComposerStore }) => {
                useComposerStore.getState().open("CREATE_TOPIC");
              });
            }}
            icon={MessageSquare}
          >
            新话题
          </ActionButton>

          {/* 新增类别按钮 - TODO: 添加管理员权限判断 */}
          <ActionButton onClick={() => navigate("/forum/new-category")} icon={Plus}>
            新增类别
          </ActionButton>
        </div>
      </div>

      {/* 列表头部 - 桌面端 */}
      <div
        className={`hidden border-b pb-2 text-xs font-medium tracking-wider uppercase md:grid md:grid-cols-12 md:gap-4 ${colors.textMuted} border-gray-200 dark:border-neutral-700/50`}
      >
        <div className="col-span-7">类别</div>
        <div className="col-span-2 text-center">话题</div>
        <div className="col-span-3 text-right">本周活跃</div>
      </div>

      {/* 类别列表 */}
      <div>
        {categories?.map((category) => (
          <Link
            key={(category as any).id}
            to={`/forum/category/${(category as any).id}`}
            className={`group relative block border-b border-gray-100 hover:bg-gray-50 dark:border-neutral-700/50 dark:hover:bg-neutral-800/40`}
          >
            <div className="grid grid-cols-1 items-center gap-4 py-4 md:grid-cols-12">
              {/* 类别信息 */}
              <div className="col-span-1 flex items-start gap-3 md:col-span-7">
                {/* 左侧彩色边栏 */}
                <div
                  className="mt-1 h-10 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color || "#6b7280" }}
                />

                {/* 分类名称和描述 */}
                <div className="min-w-0 flex-1">
                  <h2
                    className={`text-[15px] font-semibold text-gray-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-amber-400`}
                  >
                    {category.name}
                  </h2>
                  <p className={`mt-0.5 line-clamp-1 text-sm ${colors.textSecondary}`}>
                    {category.description || "暂无描述"}
                  </p>
                </div>
              </div>

              {/* 话题数 - 桌面端 */}
              <div className={`col-span-2 hidden items-center justify-center md:flex`}>
                <span className={`text-sm font-medium ${colors.textSecondary}`}>--</span>
              </div>

              {/* 本周活跃 - 桌面端 */}
              <div className={`col-span-3 hidden items-center justify-end md:flex`}>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className={`h-3.5 w-3.5 text-green-600 dark:text-green-400`} />
                  <span className={`text-sm font-medium text-green-600 dark:text-green-400`}>
                    --
                  </span>
                  <span className={`text-sm ${colors.textMuted}`}>/周</span>
                </div>
              </div>

              {/* 移动端统计信息 */}
              <div className="col-span-1 flex items-center gap-4 pl-4 md:hidden">
                <div className="flex items-center gap-1">
                  <MessageSquare className={`h-3.5 w-3.5 ${colors.textMuted}`} />
                  <span className={`text-xs ${colors.textMuted}`}>--</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className={`h-3.5 w-3.5 text-green-600 dark:text-green-400`} />
                  <span className={`text-xs text-green-600 dark:text-green-400`}>--/周</span>
                </div>
                {canManageCategories && (
                  <div className="ml-auto flex items-center gap-2">
                    <ActionButton
                      color="ghost-blue"
                      size="icon"
                      icon={Pencil}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/forum/category/${(category as any).id}/edit`);
                      }}
                      title="编辑类别"
                      aria-label="编辑类别"
                    />
                    <ActionButton
                      color="ghost-red"
                      size="icon"
                      icon={Trash2}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setPendingDelete({
                          id: String((category as any).id),
                          name: String((category as any).name ?? ""),
                        });
                        setConfirmOpen(true);
                      }}
                      title="删除类别"
                      aria-label="删除类别"
                    />
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}

        {/* 空状态 */}
        {(!categories || categories.length === 0) && (
          <div className="flex h-32 items-center justify-center">
            <p className={colors.textMuted}>暂无类别</p>
          </div>
        )}
      </div>
      {/* 删除确认弹窗：确认后调用后端删除接口，并失效分类列表缓存 */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
        title="删除类别"
        content={
          <div>
            确定要删除
            <span className="mx-1 font-semibold text-gray-900 dark:text-neutral-100">
              {pendingDelete?.name ?? ""}
            </span>
            吗？此操作可能影响该类别下的话题。
          </div>
        }
        confirmText="确定删除"
        cancelText="取消"
        confirmLoading={loading}
        onConfirm={async () => {
          if (!pendingDelete?.id) return;
          await execute(async () => {
            await ForumsCategoriesService.categoriesControllerRemove({ id: pendingDelete.id });
            await queryClient.invalidateQueries({ queryKey: ["forums", "categories"] });
          });
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
