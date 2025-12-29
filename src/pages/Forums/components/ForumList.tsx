import { MessageSquare, ThumbsUp, Eye, Clock, Pin, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useForumTheme } from "../context/ForumThemeContext";

interface ForumListProps {
  selectedCategory: string;
  searchQuery: string;
  onTopicClick: (id: string) => void;
}

const mockTopics = [
  {
    id: "1",
    title: "React 19 新特性深度解析 - Server Components 实战指南",
    author: "前端架构师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    category: "tech",
    tags: ["React", "TypeScript", "前端开发"],
    excerpt: "React 19 带来了革命性的 Server Components，本文将深入探讨其实现原理和最佳实践...",
    views: 12456,
    replies: 234,
    likes: 567,
    isPinned: true,
    isTrending: true,
    createdAt: "2小时前",
    lastReply: "5分钟前",
  },
  {
    id: "2",
    title: "如何设计一个现代化的用户界面？分享我的设计心得",
    author: "UI设计师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    category: "design",
    tags: ["UI设计", "Figma", "用户体验"],
    excerpt: "好的设计不仅仅是美观，更重要的是用户体验。今天分享一些我在实际项目中的设计经验...",
    views: 8934,
    replies: 156,
    likes: 423,
    isPinned: false,
    isTrending: true,
    createdAt: "5小时前",
    lastReply: "15分钟前",
  },
  {
    id: "3",
    title: "Python 数据分析入门教程 - 从零开始学习 Pandas",
    author: "数据科学家",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    category: "tech",
    tags: ["Python", "数据分析", "Pandas"],
    excerpt: "Pandas 是 Python 数据分析的核心库，本教程将带你从零开始掌握数据处理技能...",
    views: 15678,
    replies: 289,
    likes: 789,
    isPinned: true,
    isTrending: false,
    createdAt: "1天前",
    lastReply: "30分钟前",
  },
  {
    id: "4",
    title: "2024年最值得玩的独立游戏推荐",
    author: "游戏玩家",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    category: "gaming",
    tags: ["游戏", "独立游戏", "推荐"],
    excerpt: "今年涌现了很多优秀的独立游戏，让我来为大家推荐几款不容错过的佳作...",
    views: 6543,
    replies: 98,
    likes: 234,
    isPinned: false,
    isTrending: true,
    createdAt: "8小时前",
    lastReply: "1小时前",
  },
  {
    id: "5",
    title: "分享一些提升编程效率的 VS Code 插件",
    author: "全栈工程师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    category: "tech",
    tags: ["VSCode", "工具", "效率"],
    excerpt: "工欲善其事必先利其器，这些插件可以让你的开发效率提升数倍...",
    views: 9876,
    replies: 187,
    likes: 456,
    isPinned: false,
    isTrending: false,
    createdAt: "12小时前",
    lastReply: "2小时前",
  },
  {
    id: "6",
    title: "AI绘画工具对比：Midjourney vs Stable Diffusion",
    author: "AI爱好者",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
    category: "design",
    tags: ["人工智能", "AI绘画", "设计"],
    excerpt: "详细对比两款最流行的AI绘画工具，帮助你选择最适合自己的工具...",
    views: 11234,
    replies: 203,
    likes: 567,
    isPinned: false,
    isTrending: true,
    createdAt: "1天前",
    lastReply: "45分钟前",
  },
  {
    id: "7",
    title: "如何准备前端面试？我的面试经验分享",
    author: "资深开发",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
    category: "learning",
    tags: ["面试", "前端", "求职"],
    excerpt: "最近面试了多家大厂，总结了一些面试经验和常见问题，希望能帮到大家...",
    views: 23456,
    replies: 445,
    likes: 1234,
    isPinned: false,
    isTrending: false,
    createdAt: "2天前",
    lastReply: "10分钟前",
  },
  {
    id: "8",
    title: "音乐制作入门：如何用 Logic Pro 创作你的第一首歌",
    author: "音乐制作人",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8",
    category: "music",
    tags: ["音乐制作", "Logic Pro", "教程"],
    excerpt: "音乐制作并不难，跟着这个教程，你也能创作出属于自己的音乐...",
    views: 5432,
    replies: 76,
    likes: 189,
    isPinned: false,
    isTrending: false,
    createdAt: "1天前",
    lastReply: "3小时前",
  },
];

export function ForumList({ selectedCategory, searchQuery, onTopicClick }: ForumListProps) {
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "trending">("latest");
  const { theme, colors } = useForumTheme();

  const filteredTopics = mockTopics.filter((topic) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "trending" && topic.isTrending) ||
      selectedCategory === "new" ||
      topic.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div
        className={`${colors.cardBg} rounded-xl p-4 ${colors.shadow} border ${colors.cardBorder} transition-colors`}
      >
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
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
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

      {/* Topics List */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div
            className={`${colors.cardBg} rounded-xl p-12 ${colors.shadow} border ${colors.cardBorder} text-center transition-colors`}
          >
            <p className={colors.textMuted}>暂无相关话题</p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <article
              key={topic.id}
              onClick={() => onTopicClick(topic.id)}
              className={`${colors.cardBg} rounded-xl p-5 ${colors.shadow} border ${colors.cardBorder} ${colors.cardHover} group cursor-pointer transition-all`}
            >
              {/* Header */}
              <div className="flex items-start gap-4">
                <img
                  src={topic.avatar}
                  alt={topic.author}
                  className="h-12 w-12 shrink-0 rounded-full"
                />
                <div className="min-w-0 flex-1">
                  {/* Title */}
                  <div className="mb-2 flex items-start gap-2">
                    {topic.isPinned && (
                      <Pin
                        className={`mt-1 h-4 w-4 shrink-0 ${theme === "dark" ? "text-amber-400" : "text-blue-600"}`}
                      />
                    )}
                    {topic.isTrending && (
                      <TrendingUp className="mt-1 h-4 w-4 shrink-0 text-red-500" />
                    )}
                    <h3
                      className={`flex-1 transition-colors ${colors.textPrimary} ${colors.accentHover}`}
                    >
                      {topic.title}
                    </h3>
                  </div>

                  {/* Author and Time */}
                  <div className={`flex items-center gap-3 text-sm ${colors.textMuted} mb-3`}>
                    <span className={`font-medium ${colors.textSecondary}`}>{topic.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {topic.createdAt}
                    </span>
                  </div>

                  {/* Excerpt */}
                  <p className={`${colors.textSecondary} mb-3 line-clamp-2 text-sm`}>
                    {topic.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded px-2 py-1 text-xs transition-colors ${theme === "dark" ? "bg-neutral-700/50 text-neutral-300" : "bg-gray-100 text-gray-700"}`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer Stats */}
                  <div
                    className={`flex items-center justify-between border-t pt-3 ${colors.dividerColor}`}
                  >
                    <div className={`flex items-center gap-4 text-sm ${colors.textMuted}`}>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {topic.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {topic.replies}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {topic.likes}
                      </span>
                    </div>
                    <span className={`text-xs ${colors.textMuted}`}>
                      最后回复: {topic.lastReply}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
