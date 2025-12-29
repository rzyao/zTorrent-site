import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForumTheme } from "../../context/ForumThemeContext";
import { TopicDetailProps } from "./types";
import { topicData as mockTopicData } from "./constants";
import { Post } from "./components/Post";
import { Timeline } from "./components/Timeline";
import { TopicHeader } from "./components/TopicHeader";
import { TopicFooter } from "./components/TopicFooter";
import { SuggestedTopics } from "./components/SuggestedTopics";
import { useTopicDetail } from "./hooks/useTopicDetail";

export function TopicDetail({
  topicId: propTopicId,
  onBack: propOnBack,
}: Partial<TopicDetailProps>) {
  const { topicId: paramTopicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { theme, colors } = useForumTheme();
  const [currentPost, setCurrentPost] = useState(1);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);

  const topicId = propTopicId || paramTopicId;
  const onBack = propOnBack || (() => navigate("/forum"));

  // 从 API 获取数据
  const { topicData: apiTopicData, isLoading, isError } = useTopicDetail(topicId);

  // 使用 API 数据，如果不可用则回退到 mock 数据
  const topicData = apiTopicData || mockTopicData;

  // 计算非系统操作的真正帖子
  const regularPosts = topicData.posts.filter((p) => !p.isSmallAction);
  const totalRegularPosts = regularPosts.length;

  // Handle Timeline Change
  const handleTimelineChange = (index: number) => {
    setIsProgrammaticScroll(true);
    setCurrentPost(index);

    const scrollContainer = document.getElementById("forum-scroll-container");
    const element = document.getElementById(`post-${index}`);

    if (element && scrollContainer) {
      // 计算元素相对于滚动容器的偏移
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const headerOffset = 100; // Sticky header + padding

      // 当前滚动位置 + 元素相对于容器的位置 - header偏移
      const targetScrollTop =
        scrollContainer.scrollTop + (elementRect.top - containerRect.top) - headerOffset;

      scrollContainer.scrollTo({
        top: targetScrollTop,
        behavior: "auto", // 拖拽需要即时响应
      });

      // Reset flag after a short delay
      setTimeout(() => {
        setIsProgrammaticScroll(false);
      }, 100);
    }
  };

  // 滚动监听
  useEffect(() => {
    const scrollContainer = document.getElementById("forum-scroll-container");
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (isProgrammaticScroll) return;

      const posts = document.querySelectorAll("[data-post-index]");
      let activePostIndex: number | null = null;
      const headerOffset = 150;

      // 找到第一个顶部在视口上半部分的帖子
      let found = false;
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const rect = post.getBoundingClientRect();

        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
          const indexStr = post.getAttribute("data-post-index");
          if (indexStr) {
            activePostIndex = parseInt(indexStr, 10);
            found = true;
            break;
          }
        }
      }

      // 回退逻辑
      if (!found) {
        for (let i = posts.length - 1; i >= 0; i--) {
          const post = posts[i];
          const rect = post.getBoundingClientRect();
          if (rect.top < headerOffset) {
            const indexStr = post.getAttribute("data-post-index");
            if (indexStr) {
              activePostIndex = parseInt(indexStr, 10);
              break;
            }
          }
        }
      }

      if (activePostIndex !== null && !isNaN(activePostIndex)) {
        setCurrentPost(activePostIndex);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [isProgrammaticScroll]);

  // 页面加载时滚动到顶部
  useEffect(() => {
    const scrollContainer = document.getElementById("forum-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    }
  }, [topicId]);

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
  if (isError && !apiTopicData) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-neutral-400">
        <span>加载失败，正在使用演示数据</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 ${theme === "light" ? "bg-white" : ""}`}>
      <div className="mx-auto max-w-[1100px] px-4 pt-6 sm:px-6">
        {/* Breadcrumbs (Discourse style) */}
        <div className="flex items-center gap-2 py-4 text-sm text-[#919191]">
          <span className="cursor-pointer hover:underline" onClick={() => navigate("/forum")}>
            论坛首页
          </span>
          <span>{">"}</span>
          <span className="cursor-pointer hover:underline">{topicData.category}</span>
        </div>

        {/* Title Section */}
        <TopicHeader theme={theme} topicData={topicData} />

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
                    theme={theme}
                    colors={colors}
                  />
                );
              });
            })()}

            {/* Topic Footer: Map & Actions */}
            <TopicFooter topicData={topicData} />

            {/* Suggested Topics */}
            <SuggestedTopics theme={theme} />
          </div>

          {/* Right: Timeline (Sticky) */}
          <Timeline
            theme={theme}
            colors={colors}
            totalPosts={totalRegularPosts}
            currentPost={currentPost}
            startDate={topicData.createdAt}
            lastPostedAt={topicData.stats.lastReply}
            onChange={handleTimelineChange}
          />
        </div>
      </div>
    </div>
  );
}
