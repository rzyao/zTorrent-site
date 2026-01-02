import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForumTheme } from "../../context/ForumThemeContext";
import { cn } from "@/components/ui/utils";
import { TopicDetailProps } from "./types";
import { Post } from "./components/Post";
import { Timeline } from "./components/Timeline";
import { TopicHeader } from "./components/TopicHeader";
import { TopicFooter } from "./components/TopicFooter";
import { SuggestedTopics } from "./components/SuggestedTopics";
import { useTopicDetail } from "./hooks/useTopicDetail";
import { Loader2 } from "lucide-react";

export function TopicDetail({
  topicId: propTopicId,
  onBack: propOnBack,
}: Partial<TopicDetailProps>) {
  const { topicId: paramTopicId, postNumber: paramPostNumber } = useParams<{
    topicId: string;
    postNumber?: string;
  }>();
  const navigate = useNavigate();
  const { theme, colors } = useForumTheme();
  const [currentPost, setCurrentPost] = useState(1);
  const [scrollPercentage, setScrollPercentage] = useState(0); // 新增：基于距离的百分比
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [hasJumpedToPost, setHasJumpedToPost] = useState(false); // 防止重复跳转

  const topicId = propTopicId || paramTopicId;
  const targetPostNumber = paramPostNumber ? parseInt(paramPostNumber, 10) : undefined;
  const onBack = propOnBack || (() => navigate("/forum"));

  // 从 API 获取数据，传入 nearPost 以加载包含目标楼层的数据
  const {
    topicData,
    isLoading,
    isError,
    error,
    totalPostsCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useTopicDetail(topicId, { nearPost: targetPostNumber });

  // 计算当前加载的帖子中的非系统操作帖子
  const regularPosts = topicData?.posts?.filter((p) => !p.isSmallAction) ?? [];

  // Discourse 风格跳转：数据加载后跳转到目标楼层
  useEffect(() => {
    if (targetPostNumber && topicData && !hasJumpedToPost && !isLoading) {
      const jumpToPost = () => {
        const postElement = document.getElementById(`post-${targetPostNumber}`);
        if (postElement) {
          postElement.scrollIntoView({ behavior: "smooth", block: "center" });
          // 高亮效果
          postElement.classList.add("ring-2", "ring-amber-400", "transition-all");
          setTimeout(() => {
            postElement.classList.remove("ring-2", "ring-amber-400");
          }, 2000);
          setHasJumpedToPost(true);
          setCurrentPost(targetPostNumber);
          return true;
        }
        return false;
      };

      // 多次尝试跳转，因为 DOM 可能还没渲染完成
      const attemptJump = (attemptsLeft: number) => {
        if (attemptsLeft <= 0) return;

        requestAnimationFrame(() => {
          setTimeout(() => {
            if (!jumpToPost() && attemptsLeft > 1) {
              // 如果没找到元素，继续尝试
              attemptJump(attemptsLeft - 1);
            }
          }, 200);
        });
      };

      attemptJump(5); // 尝试 5 次
    }
  }, [targetPostNumber, topicData, hasJumpedToPost, isLoading]);

  // 当 URL 中的 postNumber 变化时，重置跳转状态
  useEffect(() => {
    if (targetPostNumber) {
      setHasJumpedToPost(false);
    }
  }, [paramPostNumber]); // 使用原始字符串参数，确保检测到变化

  // Handle Timeline Change (用于点击跳转到特定帖子)
  const handleTimelineChange = (index: number) => {
    setCurrentPost(index);
  };

  // 处理百分比滚动 (用于平滑拖拽)
  const handlePercentageScroll = (pct: number) => {
    const scrollContainer = document.getElementById("forum-scroll-container");
    if (!scrollContainer) return;

    setIsProgrammaticScroll(true);

    // 计算可滚动的总高度
    const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    const targetScrollTop = pct * scrollHeight;

    // 直接设置 scrollTop，无动画延迟
    scrollContainer.scrollTop = targetScrollTop;

    // 同时更新百分比状态
    setScrollPercentage(pct);

    // 计算当前帖子索引（使用后端返回的总数）
    const total = totalPostsCount || 1;
    const newIndex = Math.round(pct * (total - 1)) + 1;
    if (newIndex !== currentPost && newIndex >= 1 && newIndex <= total) {
      setCurrentPost(newIndex);
    }

    setTimeout(() => {
      setIsProgrammaticScroll(false);
    }, 50);
  };

  // 滚动监听 - 基于距离的百分比计算
  useEffect(() => {
    const scrollContainer = document.getElementById("forum-scroll-container");
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (isProgrammaticScroll) return;

      // 直接计算滚动百分比
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const pct = scrollHeight > 0 ? scrollContainer.scrollTop / scrollHeight : 0;
      setScrollPercentage(pct);

      // 计算当前帖子的楼层号（使用 data-post-number 而非数组索引）
      // 修正：找到视口中最靠近顶部的帖子（无论滚动方向）
      const posts = document.querySelectorAll("[data-post-number]");
      const headerOffset = 150;

      let activePostNumber: number | null = null;

      // 正向遍历，找到第一个 bottom > headerOffset 的帖子
      // 这样无论向上还是向下滚动都能正确检测
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const rect = post.getBoundingClientRect();
        // 帖子的底部超过 headerOffset 表示帖子在视口中可见
        if (rect.bottom > headerOffset) {
          const postNumberStr = post.getAttribute("data-post-number");
          if (postNumberStr) {
            activePostNumber = parseInt(postNumberStr, 10);
          }
          break;
        }
      }

      // 更新当前帖子（只在值变化时更新）
      if (
        activePostNumber !== null &&
        !isNaN(activePostNumber) &&
        activePostNumber !== currentPost
      ) {
        setCurrentPost(activePostNumber);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [isProgrammaticScroll, currentPost]);

  // 注意：移除了加载时 scrollTo(0,0) 的逻辑
  // 因为当从中间位置加载时（如 /150），我们不应该滚动到顶部
  // 这会导致向上加载的 sentinel 立即可见，触发连续加载

  // 无限滚动加载更多帖子 - 向下
  const loadMoreRef = useRef<HTMLDivElement>(null);
  // 无限滚动加载更多帖子 - 向上
  const loadMorePrevRef = useRef<HTMLDivElement>(null);

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
      rootMargin: "200px",
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  // 向上滚动观察器 - 使用防抖避免连续触发
  const isPrevLoadingRef = useRef(false);

  const handlePrevObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      // 添加 isPrevLoadingRef 检查，避免在滚动位置调整期间再次触发
      if (
        target.isIntersecting &&
        hasPreviousPage &&
        !isFetchingPreviousPage &&
        !isPrevLoadingRef.current
      ) {
        isPrevLoadingRef.current = true;

        // 记住当前滚动位置，加载后恢复
        const scrollContainer = document.getElementById("forum-scroll-container");
        const prevScrollHeight = scrollContainer?.scrollHeight || 0;

        fetchPreviousPage().then(() => {
          // 使用双重 requestAnimationFrame 确保 DOM 完全更新
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (scrollContainer) {
                const newScrollHeight = scrollContainer.scrollHeight;
                const diff = newScrollHeight - prevScrollHeight;
                scrollContainer.scrollTop += diff;
              }
              // 延迟重置标志，给滚动位置足够时间稳定
              setTimeout(() => {
                isPrevLoadingRef.current = false;
              }, 300);
            });
          });
        });
      }
    },
    [fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage],
  );

  useEffect(() => {
    const element = loadMorePrevRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handlePrevObserver, {
      root: null,
      rootMargin: "50px", // 减小 rootMargin，避免过早触发
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handlePrevObserver]);

  // 话题不存在
  if (!topicId) {
    return <div className="flex h-64 items-center justify-center text-neutral-400">话题不存在</div>;
  }

  // 加载中状态
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // 错误状态
  if (isError || !topicData) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-neutral-400">
        <span>{(error as any)?.message || "加载失败，请重试"}</span>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 ${colors.pageBg}`}>
      <div className="mx-auto max-w-[1100px] px-4 pt-6 sm:px-6">
        {/* Title Section */}
        <TopicHeader topicData={topicData} />

        {/* Header Divider */}
        <div className={cn("mt-2 mb-2 border-t", colors.dividerColor)}></div>

        {/* Main Layout: Posts Stream + Timeline */}
        <div className="flex items-start">
          {/* Left: Posts Stream */}
          <div className="min-w-0 flex-1">
            {/* 向上加载触发器 */}
            {hasPreviousPage && (
              <div ref={loadMorePrevRef} className="h-px w-full">
                {isFetchingPreviousPage && (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-amber-400" />
                    <span className={colors.textMuted}>加载更早的回复...</span>
                  </div>
                )}
              </div>
            )}

            {(() => {
              let regularPostIndex = 0;

              return topicData.posts.map((post, index) => {
                // 非系统操作帖子才分配索引
                if (!post.isSmallAction) {
                  regularPostIndex++;
                }

                return (
                  <Post
                    key={post.id}
                    post={post}
                    postIndex={post.isSmallAction ? -1 : regularPostIndex}
                    isLast={index === topicData.posts.length - 1}
                    colors={colors}
                    topicTitle={topicData.title}
                    topicId={topicId}
                    // 直接使用后端返回的引用关系，无需前端计算
                    incomingReplies={post.incomingReplies}
                  />
                );
              });
            })()}

            {/* 无限滚动加载更多帖子 */}
            <div ref={loadMoreRef} className="h-px w-full">
              {isFetchingNextPage && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-amber-400" />
                  <span className={colors.textMuted}>加载更多回复...</span>
                </div>
              )}
              {!hasNextPage && topicData.posts.length > 20 && (
                <div className={`py-4 text-center text-sm ${colors.textMuted}`}>
                  — 已加载全部回复 —
                </div>
              )}
            </div>

            {/* Topic Footer: Map & Actions */}
            <TopicFooter topicData={topicData} />

            {/* Suggested Topics */}
            <SuggestedTopics />
          </div>

          {/* Right: Timeline (Sticky) */}
          <Timeline
            colors={colors}
            totalPosts={totalPostsCount || regularPosts.length}
            currentPost={currentPost}
            scrollPercentage={scrollPercentage}
            startDate={topicData.createdAt}
            lastPostedAt={topicData.stats.lastReply}
            onChange={handleTimelineChange}
            onPercentageChange={handlePercentageScroll}
            topicId={topicId}
            topicTitle={topicData.title}
          />
        </div>
      </div>
    </div>
  );
}
