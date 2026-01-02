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
  const { topicId: paramTopicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { theme, colors } = useForumTheme();
  const [currentPost, setCurrentPost] = useState(1);
  const [scrollPercentage, setScrollPercentage] = useState(0); // 新增：基于距离的百分比
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);

  const topicId = propTopicId || paramTopicId;
  const onBack = propOnBack || (() => navigate("/forum"));

  // 从 API 获取数据
  const { topicData, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTopicDetail(topicId);

  // 计算非系统操作的真正帖子 (在渲染时进行，避免 topicData 为 null 时报错)
  const regularPosts = topicData?.posts?.filter((p) => !p.isSmallAction) ?? [];
  const totalRegularPosts = regularPosts.length;

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

    // 计算当前帖子索引
    const newIndex = Math.round(pct * (totalRegularPosts - 1)) + 1;
    if (newIndex !== currentPost && newIndex >= 1 && newIndex <= totalRegularPosts) {
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

      // 同时计算当前帖子索引（用于显示楼层号）
      const posts = document.querySelectorAll("[data-post-index]");
      const headerOffset = 150;

      for (let i = posts.length - 1; i >= 0; i--) {
        const post = posts[i];
        const rect = post.getBoundingClientRect();
        if (rect.top < headerOffset) {
          const indexStr = post.getAttribute("data-post-index");
          if (indexStr) {
            const activePostIndex = parseInt(indexStr, 10);
            if (!isNaN(activePostIndex) && activePostIndex !== currentPost) {
              setCurrentPost(activePostIndex);
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

  // 无限滚动加载更多帖子
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
      rootMargin: "200px",
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

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
            totalPosts={totalRegularPosts}
            currentPost={currentPost}
            scrollPercentage={scrollPercentage}
            startDate={topicData.createdAt}
            lastPostedAt={topicData.stats.lastReply}
            onChange={handleTimelineChange}
            onPercentageChange={handlePercentageScroll}
          />
        </div>
      </div>
    </div>
  );
}
