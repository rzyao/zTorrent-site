import { useForumsCategories } from "../hooks/useForumsCategories";
import { Link } from "react-router-dom";
import { useForumTheme } from "../context/ForumThemeContext";
import { MessageSquare, TrendingUp, Plus } from "lucide-react";

/**
 * 所有类别页面 - 参考 linux.do/categories 风格设计
 * 采用分割线布局，每个分类显示彩色边栏、描述和统计数据
 */
export function CategoriesPage() {
  const { data: categories, isLoading } = useForumsCategories();
  const { theme, colors } = useForumTheme();

  // 加载状态
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="mb-4 h-7 w-28 animate-pulse rounded bg-neutral-700" />
        <div className="space-y-0">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-20 animate-pulse border-b ${
                theme === "dark" ? "border-neutral-700/50" : "border-gray-200"
              }`}
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
          <button
            onClick={() => {
              import("../../components/Composer/ComposerStore").then(({ useComposerStore }) => {
                useComposerStore.getState().open("CREATE_TOPIC");
              });
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              theme === "dark"
                ? "bg-amber-600 text-white hover:bg-amber-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            新话题
          </button>

          {/* 新增类别按钮 - TODO: 添加管理员权限判断 */}
          <Link
            to="/forum/new-category"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              theme === "dark"
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Plus className="h-4 w-4" />
            新增类别
          </Link>
        </div>
      </div>

      {/* 列表头部 - 桌面端 */}
      <div
        className={`hidden border-b pb-2 text-xs font-medium tracking-wider uppercase md:grid md:grid-cols-12 md:gap-4 ${colors.textMuted} ${
          theme === "dark" ? "border-neutral-700/50" : "border-gray-200"
        }`}
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
            className={`group relative block border-b transition-colors ${
              theme === "dark"
                ? "border-neutral-700/50 hover:bg-neutral-800/40"
                : "border-gray-100 hover:bg-gray-50"
            }`}
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
                    className={`text-[15px] font-semibold transition-colors ${
                      theme === "dark"
                        ? "text-neutral-100 group-hover:text-amber-400"
                        : "text-gray-900 group-hover:text-blue-600"
                    }`}
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
                  <TrendingUp
                    className={`h-3.5 w-3.5 ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  >
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
                  <TrendingUp
                    className={`h-3.5 w-3.5 ${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  />
                  <span
                    className={`text-xs ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                  >
                    --/周
                  </span>
                </div>
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
    </div>
  );
}
