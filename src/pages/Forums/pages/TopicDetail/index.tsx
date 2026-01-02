import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
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
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loadMorePrevRef = useRef<HTMLDivElement>(null);

  // 滚动位置锚定 Ref
  const previousScrollHeightRef = useRef(0);
  const previousScrollTopRef = useRef(0);

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
    // 导航到目标楼层，触发数据重新加载
    navigate(`/forum/topic/${topicId}/${index}`);
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
      const posts = document.querySelectorAll("[data-post-number]");
      const headerOffset = 150;

      for (let i = posts.length - 1; i >= 0; i--) {
        const post = posts[i];
        const rect = post.getBoundingClientRect();
        if (rect.top < headerOffset) {
          const postNumberStr = post.getAttribute("data-post-number");
          if (postNumberStr) {
            const postNumber = parseInt(postNumberStr, 10);
            if (!isNaN(postNumber) && postNumber !== currentPost) {
              setCurrentPost(postNumber);
            }
            break;
          }
        }
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [isProgrammaticScroll, currentPost]);

  // 页面加载时滚动到顶部
  useEffect(() => {
    const scrollContainer = document.getElementById("forum-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    }
  }, [topicId]);

  // 无限滚动加载更多帖子 - 向下
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

  // 向上滚动观察器
  // 向上滚动观察器（仅触发加载）
  useEffect(() => {
    const element = loadMorePrevRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasPreviousPage && !isFetchingPreviousPage) {
          fetchPreviousPage();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage]);

  // 滚动锚定：记录状态
  useEffect(() => {
    if (isFetchingPreviousPage) {
      const container = document.getElementById("forum-scroll-container");
      if (container) {
        previousScrollHeightRef.current = container.scrollHeight;
        previousScrollTopRef.current = container.scrollTop;
      }
    }
  }, [isFetchingPreviousPage]);

  // 滚动锚定：恢复位置
  useLayoutEffect(() => {
    // 当加载完成（isFetchingPreviousPage 变为 false）且有记录时，调整滚动位置
    if (!isFetchingPreviousPage && previousScrollHeightRef.current > 0) {
      const container = document.getElementById("forum-scroll-container");
      if (container) {
        const newScrollHeight = container.scrollHeight;
        const diff = newScrollHeight - previousScrollHeightRef.current;

        // 只有当高度确实增加（说明由于向上加载插入了内容）时才调整
        if (diff > 0) {
          container.scrollTop = previousScrollTopRef.current + diff;
        }
        // 重置
        previousScrollHeightRef.current = 0;
      }
    }
  }, [isFetchingPreviousPage, topicData]); // 监听数据变化和状态结束

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
