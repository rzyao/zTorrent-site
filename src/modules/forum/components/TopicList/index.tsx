import { Pin, TrendingUp, Loader2, Square } from "lucide-react";
import { useEffect, useRef, useCallback, useMemo } from "react";
import NProgress from "nprogress";
import { useForumTheme } from "../../context/ForumThemeContext";
import { useForumsTopicsQuery, ExtendedApiTopic } from "../../hooks/useForumsTopicsQuery";
import { useForumsCategories } from "../../hooks/useForumsCategories";
import { getIconByName } from "@/modules/forum/components/ui/icon-picker";
import { ForumImage } from "@/modules/forum/components/ui/image";
import { ForumFilterBar } from "./components/ForumFilterBar";
import { ForumListSkeleton } from "./components/ForumListSkeleton";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List, ListOnItemsRenderedProps } from "react-window";

// UI 类型定义
interface Participant {
  id: string;
  avatar: string;
  name: string;
}

interface UiTopic {
  id: string;
  title: string;
  author: Participant;
  category: string;
  categoryId?: string;
  categoryColor?: string;
  tags: string[];
  excerpt: string;
  views: number;
  replies: number;
  likes: number;
  isPinned: boolean;
  isTrending: boolean;
  createdAt: string;
  lastReplyTime: string;
  participants: Participant[];
  lastReplier: Participant;
  bountyStatus?: 'open' | 'awarded' | 'expired' | 'canceled';
  bountyAmount?: string;
}

interface TopicListProps {
  selectedCategory: string;
  categoryName?: string;
  selectedTag?: string;
  searchQuery: string;
  sortBy?: "latest" | "hot";
  onTopicClick: (id: string) => void;
  titleClassName?: string;
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMs < 0 || diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 30) return `${diffDays}天前`;
  return date.toLocaleDateString();
}

function transformTopic(apiTopic: ExtendedApiTopic): UiTopic {
  const author = apiTopic.author || { id: "unknown", username: "unknown", avatar: "" };
  const participants = (apiTopic.participants || []).map((p) => ({
    id: p.id,
    name: p.username,
    avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`,
  }));

  const lastReplierApi = apiTopic.lastReplier;
  const lastReplier = lastReplierApi
    ? {
      id: lastReplierApi.id,
      name: lastReplierApi.username,
      avatar:
        lastReplierApi.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${lastReplierApi.username}`,
    }
    : {
      id: author.id,
      name: author.username,
      avatar:
        author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`,
    };

  return {
    id: apiTopic.id,
    title: apiTopic.title,
    author: {
      id: author.id,
      name: author.username,
      avatar: author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`,
    },
    category: apiTopic.category?.name || "常规",
    categoryId: apiTopic.category?.id,
    categoryColor: apiTopic.category?.color,
    tags: apiTopic.tags?.map((t) => t.name) || [],
    excerpt: apiTopic.content
      ? apiTopic.content.substring(0, 100).replace(/[#*`]/g, "") + "..."
      : "",
    views: apiTopic.views || 0,
    replies: apiTopic.replyCount || 0,
    likes: 0,
    isPinned: !!apiTopic.isPinned,
    isTrending: !!apiTopic.isTrending,
    createdAt: formatDate(apiTopic.createdAt),
    lastReplyTime: formatDate(apiTopic.lastReplyAt || apiTopic.updatedAt),
    participants: participants.slice(0, 3),
    lastReplier: lastReplier,
    bountyStatus: apiTopic.bounty?.status,
    bountyAmount: apiTopic.bounty?.amount,
  };
}

export function TopicList({
  selectedCategory,
  categoryName,
  selectedTag,
  searchQuery,
  sortBy = "latest",
  onTopicClick,
  titleClassName,
}: TopicListProps) {
  const { colors } = useForumTheme();
  const apiSortBy = sortBy === "hot" ? "popular" : "latest";

  const { allTopics, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useForumsTopicsQuery({
      categoryId: selectedCategory,
      tag: selectedTag,
      search: searchQuery,
      limit: 20,
      sortBy: apiSortBy as "latest" | "popular" | "trending",
    });
  const { data: categories = [] } = useForumsCategories();
  const categoryMetaById = useMemo(() => {
    const map = new Map<string, { icon?: string; color?: string }>();
    categories.forEach((c: any) => {
      map.set(String(c.id), { icon: c.icon, color: c.color });
    });
    return map;
  }, [categories]);

  // NProgress 联动：仅在首屏加载时显示，分页加载采用局部轻量提示
  useEffect(() => {
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isLoading]);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  // 仅在 allTopics 变化时进行转换，减少重复计算
  const topics: UiTopic[] = useMemo(() => allTopics.map(transformTopic), [allTopics]);
  // 虚拟化相关：行高缓存（index -> height）
  const itemSizesRef = useRef<Map<number, number>>(new Map());
  const listRef = useRef<List>(null);
  const getItemSize = useCallback(
    (index: number) => itemSizesRef.current.get(index) ?? 80,
    [],
  );
  const handleItemsRendered = useCallback(
    ({ visibleStopIndex }: ListOnItemsRenderedProps) => {
      if (hasNextPage && !isFetchingNextPage && visibleStopIndex >= topics.length - 5) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, topics.length, fetchNextPage],
  );

  return (
    <div className="space-y-0">
      <ForumFilterBar
        selectedCategory={selectedCategory}
        categoryName={categoryName}
        selectedTag={selectedTag}
        sortBy={sortBy}
      />

      <div className="overflow-hidden">
        {/* Table Header */}
        <div
          className={`hidden items-center border-b px-4 py-3 md:flex ${colors.dividerColor} text-sm font-semibold ${colors.textMuted}`}
        >
          <div className="flex-1">话题</div>
          <div className="w-48 shrink-0"></div>
          <div className="ml-4 flex shrink-0 items-center gap-5">
            <div className="w-14 text-center">回复</div>
            <div className="w-14 text-center">浏览</div>
            <div className="w-16 text-right">活动</div>
          </div>
        </div>

        {/* Loading State: 使用 Skeleton 替代转圈 */}
        {isLoading && <ForumListSkeleton />}

        {/* Error State */}
        {isError && (
          <div className="p-12 text-center">
            <p className="text-red-500">加载失败: {(error as Error)?.message || "未知错误"}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
            >
              重试
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && topics.length === 0 && (
          <div className="p-12 text-center">
            <p className={colors.textMuted}>暂无相关话题</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && topics.length > 0 && (
          <div className="h-[70vh]">
            <AutoSizer>
              {({ height, width }) => {
                const H = Math.max(300, height || 0);
                const W = Math.max(300, width || 0);
                return (
                  <List
                    ref={listRef}
                    height={H}
                    width={W}
                    itemCount={topics.length}
                    itemSize={getItemSize}
                    itemKey={(index) => topics[index].id}
                    overscanCount={6}
                    onItemsRendered={handleItemsRendered}
                  >
                    {({ index, style }) => {
                      const topic = topics[index];
                      const rowRef = (node: HTMLDivElement | null) => {
                        if (!node) return;
                        const rect = node.getBoundingClientRect();
                        const prev = itemSizesRef.current.get(index) ?? 0;
                        if (Math.abs(prev - rect.height) > 1) {
                          itemSizesRef.current.set(index, rect.height);
                          listRef.current?.resetAfterIndex(index);
                        }
                      };
                      return (
                        <div
                          ref={rowRef}
                          style={style}
                          className={index < topics.length - 1 ? `border-b ${colors.dividerColor}` : ""}
                        >
                          <div
                            onClick={() => onTopicClick(topic.id)}
                            className={`group flex items-center px-4 py-4 cursor-pointer gap-3 hover:bg-gray-50 dark:hover:bg-neutral-800/50`}
                          >
                            {/* Left: Info */}
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-start gap-2">
                                {topic.isPinned && (
                                  <Pin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-amber-400" />
                                )}
                                {topic.isTrending && (
                                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                                )}
                                {topic.bountyStatus === "open" && (
                                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                    悬赏 {topic.bountyAmount}
                                  </span>
                                )}
                                {topic.bountyStatus === "awarded" && (
                                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                    已采纳
                                  </span>
                                )}
                                {topic.bountyStatus === "expired" && (
                                  <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                    已到期
                                  </span>
                                )}
                                {topic.bountyStatus === "canceled" && (
                                  <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                    已取消
                                  </span>
                                )}
                                <h3
                                  className={`line-clamp-2 ${titleClassName ?? "text-base"} font-medium ${colors.textPrimary} group-hover:text-blue-600 dark:group-hover:text-amber-400`}
                                >
                                  {topic.title}
                                </h3>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                {/* 当处于“全部分类”列表页时显示分类徽标；在具体分类页（/forum/category/:id）隐藏以避免冗余 */}
                                {selectedCategory === "all" && (() => {
                                  const meta = topic.categoryId ? categoryMetaById.get(String(topic.categoryId)) : undefined;
                                  const IconComp = meta?.icon ? getIconByName(meta.icon) : null;
                                  const color = meta?.color || topic.categoryColor || "#999999";
                                  return (
                                    <span className="inline-flex items-center gap-1.5 rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-medium text-gray-600 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400">
                                      {IconComp ? (
                                        <IconComp className="h-3.5 w-3.5" style={{ color }} />
                                      ) : (
                                        <Square className="h-3 w-3 opacity-70" style={{ color }} />
                                      )}
                                      {topic.category}
                                    </span>
                                  );
                                })()}
                                {topic.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className={colors.textMuted}>
                                    #{tag}
                                  </span>
                                ))}
                                <span className="hidden md:inline">•</span>
                                <span className={`hidden md:inline ${colors.textMuted}`}>
                                  {topic.author.name}
                                </span>
                              </div>
                            </div>

                            {/* Middle: Avatar Group (Desktop) */}
                            <div className="hidden h-8 w-48 shrink-0 items-center justify-end gap-1.5 md:flex">
                              <div
                                className="h-6 w-6 overflow-hidden rounded-full border border-white dark:border-neutral-700"
                                title={`楼主: ${topic.author.name}`}
                              >
                                <ForumImage
                                  src={topic.author.avatar}
                                  alt={topic.author.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              {topic.participants.slice(0, 3).map((p) => (
                                <div
                                  key={p.id}
                                  className="h-6 w-6 overflow-hidden rounded-full border border-white dark:border-neutral-700"
                                  title={`参与者: ${p.name}`}
                                >
                                  <ForumImage src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
                                </div>
                              ))}
                              <div
                                className="h-6 w-6 overflow-hidden rounded-full border border-white dark:border-neutral-700"
                                title={`最新回复: ${topic.lastReplier.name}`}
                              >
                                <ForumImage
                                  src={topic.lastReplier.avatar}
                                  alt={topic.lastReplier.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </div>

                            {/* Right: Stats (Desktop) */}
                            <div className="ml-4 hidden shrink-0 items-center gap-5 md:flex">
                              <div className="flex w-14 flex-col items-center">
                                <span className="text-sm font-medium text-blue-600 dark:text-amber-400">
                                  {topic.replies}
                                </span>
                              </div>
                              <div className="flex w-14 flex-col items-center">
                                <span className={`text-sm ${colors.textMuted}`}>
                                  {topic.views > 9999 ? (topic.views / 10000).toFixed(1) + "w" : topic.views}
                                </span>
                              </div>
                              <div className={`text-xs ${colors.textMuted} w-16 text-right`}>
                                {topic.lastReplyTime}
                              </div>
                            </div>

                            {/* Mobile Stats */}
                            <div className="flex shrink-0 items-center gap-2 md:hidden">
                              <ForumImage src={topic.lastReplier.avatar} alt="Last" className="h-6 w-6 rounded-full" />
                              <span className="text-sm font-bold text-blue-600 dark:text-amber-400">
                                {topic.replies}
                              </span>
                              <span className="text-xs text-neutral-500">{topic.lastReplyTime}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </List>
                );
              }}
            </AutoSizer>
          </div>
        )}

        {/* 无限滚动加载触发器 */}
        <div ref={loadMoreRef} className="py-4">
          {isFetchingNextPage && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-amber-400" />
              <span className={colors.textMuted}>加载更多...</span>
            </div>
          )}
          {!hasNextPage && topics.length > 0 && (
            <div className={`py-4 text-center text-sm ${colors.textMuted}`}>— 已加载全部话题 —</div>
          )}
        </div>
      </div>
    </div>
  );
}
