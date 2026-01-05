import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ForumsBookmarksService } from "@/api";
import { useForumTheme } from "../context/ForumThemeContext";
import { Loader2, Bookmark, User, Clock, MessageSquare, Eye } from "lucide-react";
import { cn } from "@/components/ui/utils";

/**
 * 我的收藏页面
 */
export function BookmarksPage() {
  const { colors } = useForumTheme();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["forums", "bookmarks", "list"],
    queryFn: async () => {
      const res = await ForumsBookmarksService.bookmarksControllerList({
        page: 1,
        limit: 50,
      });
      return res.data as any; // { items: [], total: 0, ... }
    },
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className={cn("h-8 w-8 animate-spin", colors.textMuted)} />
      </div>
    );
  }

  const items = data?.items || [];

  return (
    <div className="flex flex-col">
      <div className="mb-6 px-4">
        <h1 className={cn("flex items-center gap-2 text-2xl font-bold", colors.textPrimary)}>
          <Bookmark className="h-6 w-6 text-blue-500" />
          我的收藏
        </h1>
        <p className={cn("mt-1 text-sm", colors.textMuted)}>共 {data?.total || 0} 个收藏的话题</p>
      </div>

      <div className="space-y-0">
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <p className={colors.textMuted}>暂无收藏的话题</p>
          </div>
        ) : (
          items.map((item: any) => {
            const topic = item.topic;
            if (!topic) return null;

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/forum/topic/${topic.id}`)}
                className={cn(
                  "group flex cursor-pointer flex-col border-b px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/50",
                  colors.dividerColor,
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3
                      className={cn(
                        "line-clamp-1 text-lg font-medium group-hover:text-blue-500",
                        colors.textPrimary,
                      )}
                    >
                      {topic.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
                      {/* 分类 */}
                      <span
                        className="rounded px-1.5 py-0.5 text-white"
                        style={{ backgroundColor: topic.category?.color || "#999" }}
                      >
                        {topic.category?.name || "常规"}
                      </span>

                      {/* 作者 */}
                      <span className={cn("flex items-center gap-1", colors.textMuted)}>
                        <User className="h-3 w-3" />
                        {topic.author?.username}
                      </span>

                      {/* 收藏时间 */}
                      <span className={cn("flex items-center gap-1", colors.textMuted)}>
                        <Clock className="h-3 w-3" />
                        收藏于 {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* 统计数据 */}
                  <div className="hidden shrink-0 items-center gap-4 sm:flex">
                    <div className="flex flex-col items-center">
                      <span className="flex items-center gap-1 text-sm font-semibold text-blue-500">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {topic.replyCount || 0}
                      </span>
                      <span className={cn("text-[10px] uppercase", colors.textMuted)}>回复</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={cn("flex items-center gap-1 text-sm", colors.textPrimary)}>
                        <Eye className="h-3.5 w-3.5" />
                        {topic.views || 0}
                      </span>
                      <span className={cn("text-[10px] uppercase", colors.textMuted)}>浏览</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
