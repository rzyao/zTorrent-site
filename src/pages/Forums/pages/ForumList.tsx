import { MessageSquare, Eye, Pin, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useForumTheme } from "../context/ForumThemeContext";
import { useForumsTopicsQuery, ExtendedApiTopic } from "../hooks/useForumsTopicsQuery";
import { useNavigate } from "react-router-dom";

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
}

interface ForumListProps {
  selectedCategory: string;
  searchQuery: string;
  onTopicClick: (id: string) => void;
}

/**
 * 格式化日期 (简化版)
 */
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 30) return `${diffDays}天前`;
  return date.toLocaleDateString();
}

/**
 * 将 API 数据转换为 UI 数据
 */
function transformTopic(apiTopic: ExtendedApiTopic): UiTopic {
  const author = apiTopic.author || { id: "unknown", username: "unknown", avatar: "" };
  const participants = (apiTopic.participants || []).map((p) => ({
    id: p.id,
    name: p.username,
    avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`,
  }));

  const lastReplierApi = apiTopic.last_replier;
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
    tags: apiTopic.tags?.map((t) => t.name) || [],
    excerpt: apiTopic.content
      ? apiTopic.content.substring(0, 100).replace(/[#*`]/g, "") + "..."
      : "",
    views: apiTopic.views || 0,
    replies: apiTopic.reply_count || 0,
    likes: 0,
    isPinned: apiTopic.is_pinned,
    isTrending: apiTopic.is_trending,
    createdAt: formatDate(apiTopic.created_at),
    lastReplyTime: formatDate(apiTopic.last_reply_at || apiTopic.updated_at),
    participants: participants.slice(0, 3),
    lastReplier: lastReplier,
  };
}

export function ForumList({ selectedCategory, searchQuery, onTopicClick }: ForumListProps) {
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "trending">("latest");
  const { theme, colors } = useForumTheme();
  const navigate = useNavigate();

  // 查询 API
  const { data, isLoading, isError, error } = useForumsTopicsQuery({
    categoryId: selectedCategory,
    search: searchQuery,
    page: 1, // 暂时固定第一页，后续可加分页组件
    limit: 20,
    sortBy,
  });

  const topics: UiTopic[] = data?.items?.map(transformTopic) || [];

  return (
    <div className="space-y-4">
      {/* 统一卡片容器：排序控件 + 话题列表 */}
      <div className="overflow-hidden">
        {/* Sort Controls */}
        <div className={`border-b p-4 ${colors.dividerColor} transition-colors`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className={`font-semibold ${colors.textPrimary}`}>
              {selectedCategory === "all" && "全部话题"}
              {selectedCategory === "trending" && "热门话题"}
              {selectedCategory === "new" && "最新发布"}
              {selectedCategory === "tech" && "技术讨论"}
              {selectedCategory === "design" && "设计创意"}
              {selectedCategory === "gaming" && "游戏娱乐"}
              {selectedCategory === "music" && "音乐分享"}
              {selectedCategory === "learning" && "学习成长"}
              {selectedCategory === "competition" && "竞赛活动"}
              {![
                "all",
                "trending",
                "new",
                "tech",
                "design",
                "gaming",
                "music",
                "learning",
                "competition",
              ].includes(selectedCategory) && "话题列表"}
            </h2>
            <div className="flex gap-2">
              {[
                { id: "latest", label: "最新" },
                { id: "popular", label: "最热" },
                { id: "trending", label: "趋势" },
              ].map((sort) => (
                <button
                  key={sort.id}
                  onClick={() => setSortBy(sort.id as any)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    sortBy === sort.id
                      ? theme === "dark"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-blue-100 text-blue-700"
                      : `${colors.buttonSecondary}`
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Header (Desktop) */}
        <div
          className={`hidden items-center border-b px-4 py-3 md:flex ${colors.dividerColor} text-sm font-semibold ${colors.textMuted}`}
        >
          <div className="flex-1">话题</div>
          {/* Middle Spacer for Avatar Group alignment - same width as avatar group (w-48) */}
          <div className="w-48 shrink-0"></div>
          {/* Stats Header */}
          <div className="ml-4 flex shrink-0 items-center gap-5">
            <div className="w-14 text-center">回复</div>
            <div className="w-14 text-center">浏览</div>
            <div className="w-16 text-right">活动</div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent text-blue-600 dark:text-amber-400"></div>
            <p className={`mt-4 ${colors.textMuted}`}>加载中...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-12 text-center">
            <p className="text-red-500">加载失败: {(error as any)?.message || "未知错误"}</p>
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
        {!isLoading &&
          !isError &&
          topics.length > 0 &&
          topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onTopicClick(topic.id)}
              className={`group flex items-start border-b px-4 py-4 ${colors.dividerColor} cursor-pointer gap-3 transition-all last:border-0 ${theme === "dark" ? "hover:bg-neutral-800/50" : "hover:bg-gray-50"}`}
            >
              {/* Left: Info (Flex-1) */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-start gap-2">
                  {topic.isPinned && (
                    <Pin
                      className={`mt-0.5 h-4 w-4 shrink-0 ${theme === "dark" ? "text-amber-400" : "text-blue-600"}`}
                    />
                  )}
                  {topic.isTrending && (
                    <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  )}
                  <h3
                    className={`line-clamp-2 text-sm font-medium transition-colors ${colors.textPrimary} ${theme === "dark" ? "group-hover:text-amber-400" : "group-hover:text-blue-600"}`}
                  >
                    {topic.title}
                  </h3>
                </div>

                {/* Tags + Author */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`rounded px-1.5 py-0.5 font-medium transition-colors ${theme === "dark" ? "border border-blue-500/30 bg-blue-500/20 text-blue-400" : "bg-gray-100 text-gray-600"}`}
                  >
                    {topic.category}
                  </span>
                  {topic.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className={`${colors.textMuted}`}>
                      #{tag}
                    </span>
                  ))}
                  <span className="hidden md:inline">•</span>
                  <span className={`hidden md:inline ${colors.textMuted}`}>
                    {topic.author.name}
                  </span>
                </div>
              </div>

              {/* Middle: Avatar Group (Desktop Only) */}
              <div className="hidden h-8 w-48 shrink-0 items-center justify-end gap-1.5 md:flex">
                {/* Slot 1: Author */}
                <div
                  className={`h-6 w-6 overflow-hidden rounded-full border ${theme === "dark" ? "border-neutral-700" : "border-white"}`}
                  title={`楼主: ${topic.author.name}`}
                >
                  <img
                    src={topic.author.avatar}
                    alt={topic.author.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Slots 2-4: Participants */}
                {topic.participants.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className={`h-6 w-6 overflow-hidden rounded-full border ${theme === "dark" ? "border-neutral-700" : "border-white"}`}
                    title={`参与者: ${p.name}`}
                  >
                    <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                ))}
                {/* Slot 5: Last Replier */}
                <div
                  className={`h-6 w-6 overflow-hidden rounded-full border ${theme === "dark" ? "border-neutral-700" : "border-white"}`}
                  title={`最新回复: ${topic.lastReplier.name}`}
                >
                  <img
                    src={topic.lastReplier.avatar}
                    alt={topic.lastReplier.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Right: Stats (Desktop) */}
              <div className="ml-4 hidden shrink-0 items-center gap-5 md:flex">
                <div className="flex w-14 flex-col items-center">
                  <span
                    className={`text-sm font-medium ${theme === "dark" ? "text-amber-400" : "text-blue-600"}`}
                  >
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

              {/* Mobile Stats (Right side - horizontal layout like linux.do) */}
              <div className="flex shrink-0 items-center gap-2 md:hidden">
                <img src={topic.lastReplier.avatar} alt="Last" className="h-6 w-6 rounded-full" />
                <span
                  className={`text-sm font-bold ${theme === "dark" ? "text-amber-400" : "text-blue-600"}`}
                >
                  {topic.replies}
                </span>
                <span className="text-xs text-neutral-500">{topic.lastReplyTime}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
