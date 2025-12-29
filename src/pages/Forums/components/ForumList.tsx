import { MessageSquare, Eye, Clock, Pin, TrendingUp, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useForumTheme } from "../context/ForumThemeContext";

interface Participant {
  id: string;
  avatar: string;
  name: string;
}

interface Topic {
  id: string;
  title: string;
  author: Participant;
  category: string;
  tags: string[];
  excerpt: string;
  views: number;
  replies: number;
  likes: number; // Keep in interface but don't display in list
  isPinned: boolean;
  isTrending: boolean;
  createdAt: string;
  lastReplyTime: string;
  participants: Participant[]; // Frequent repliers (Slot 2-4)
  lastReplier: Participant; // Slot 5
}

interface ForumListProps {
  selectedCategory: string;
  searchQuery: string;
  onTopicClick: (id: string) => void;
}

const mockParticipants = [
  { id: "p1", name: "User1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=p1" },
  { id: "p2", name: "User2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=p2" },
  { id: "p3", name: "User3", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=p3" },
  { id: "p4", name: "User4", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=p4" },
];

const mockTopics: Topic[] = [
  {
    id: "1",
    title: "React 19 新特性深度解析 - Server Components 实战指南",
    author: {
      id: "a1",
      name: "前端架构师",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    },
    category: "tech",
    tags: ["React", "TypeScript", "前端开发"],
    excerpt: "React 19 带来了革命性的 Server Components...",
    views: 12456,
    replies: 234,
    likes: 567,
    isPinned: true,
    isTrending: true,
    createdAt: "2小时前",
    lastReplyTime: "5分钟前",
    participants: mockParticipants.slice(0, 3),
    lastReplier: mockParticipants[0],
  },
  {
    id: "2",
    title: "如何设计一个现代化的用户界面？分享我的设计心得",
    author: {
      id: "a2",
      name: "UI设计师",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    },
    category: "design",
    tags: ["UI设计", "Figma", "用户体验"],
    excerpt: "好的设计不仅仅是美观...",
    views: 8934,
    replies: 156,
    likes: 423,
    isPinned: false,
    isTrending: true,
    createdAt: "5小时前",
    lastReplyTime: "15分钟前",
    participants: mockParticipants.slice(1, 4),
    lastReplier: mockParticipants[1],
  },
  {
    id: "3",
    title: "Python 数据分析入门教程 - 从零开始学习 Pandas",
    author: {
      id: "a3",
      name: "数据科学家",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    },
    category: "tech",
    tags: ["Python", "数据分析", "Pandas"],
    excerpt: "Pandas 是 Python 数据分析的核心库...",
    views: 15678,
    replies: 289,
    likes: 789,
    isPinned: true,
    isTrending: false,
    createdAt: "1天前",
    lastReplyTime: "30分钟前",
    participants: mockParticipants.slice(0, 2),
    lastReplier: mockParticipants[2],
  },
  {
    id: "4",
    title: "2024年最值得玩的独立游戏推荐",
    author: {
      id: "a4",
      name: "游戏玩家",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    },
    category: "gaming",
    tags: ["游戏", "独立游戏", "推荐"],
    excerpt: "今年涌现了很多优秀的独立游戏...",
    views: 6543,
    replies: 98,
    likes: 234,
    isPinned: false,
    isTrending: true,
    createdAt: "8小时前",
    lastReplyTime: "1小时前",
    participants: mockParticipants.slice(2, 4),
    lastReplier: mockParticipants[3],
  },
  {
    id: "5",
    title: "分享一些提升编程效率的 VS Code 插件",
    author: {
      id: "a5",
      name: "全栈工程师",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    },
    category: "tech",
    tags: ["VSCode", "工具", "效率"],
    excerpt: "工欲善其事必先利其器...",
    views: 9876,
    replies: 187,
    likes: 456,
    isPinned: false,
    isTrending: false,
    createdAt: "12小时前",
    lastReplyTime: "2小时前",
    participants: mockParticipants.slice(0, 1),
    lastReplier: mockParticipants[0],
  },
  {
    id: "6",
    title: "AI绘画工具对比：Midjourney vs Stable Diffusion",
    author: {
      id: "a6",
      name: "AI爱好者",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
    },
    category: "design",
    tags: ["人工智能", "AI绘画", "设计"],
    excerpt: "详细对比两款最流行的AI绘画工具...",
    views: 11234,
    replies: 203,
    likes: 567,
    isPinned: false,
    isTrending: true,
    createdAt: "1天前",
    lastReplyTime: "45分钟前",
    participants: mockParticipants.slice(1, 3),
    lastReplier: mockParticipants[1],
  },
  {
    id: "7",
    title: "如何准备前端面试？我的面试经验分享",
    author: {
      id: "a7",
      name: "资深开发",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
    },
    category: "learning",
    tags: ["面试", "前端", "求职"],
    excerpt: "最近面试了多家大厂...",
    views: 23456,
    replies: 445,
    likes: 1234,
    isPinned: false,
    isTrending: false,
    createdAt: "2天前",
    lastReplyTime: "10分钟前",
    participants: mockParticipants.slice(0, 4),
    lastReplier: mockParticipants[2],
  },
  {
    id: "8",
    title: "音乐制作入门：如何用 Logic Pro 创作你的第一首歌",
    author: {
      id: "a8",
      name: "音乐制作人",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8",
    },
    category: "music",
    tags: ["音乐制作", "Logic Pro", "教程"],
    excerpt: "音乐制作并不难...",
    views: 5432,
    replies: 76,
    likes: 189,
    isPinned: false,
    isTrending: false,
    createdAt: "1天前",
    lastReplyTime: "3小时前",
    participants: [],
    lastReplier: mockParticipants[3],
  },
  {
    id: "9",
    title: "2024年最佳开源项目盘点 - GitHub Star 破万的宝藏项目",
    author: {
      id: "a9",
      name: "开源爱好者",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=9",
    },
    category: "tech",
    tags: ["开源", "GitHub", "项目推荐"],
    excerpt: "整理了今年最火的开源项目...",
    views: 18765,
    replies: 312,
    likes: 876,
    isPinned: false,
    isTrending: true,
    createdAt: "6小时前",
    lastReplyTime: "15分钟前",
    participants: mockParticipants.slice(0, 3),
    lastReplier: mockParticipants[0],
  },
  {
    id: "10",
    title: "远程办公三年心得：如何保持高效与健康的工作状态",
    author: {
      id: "a10",
      name: "远程工作者",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=10",
    },
    category: "learning",
    tags: ["远程办公", "效率", "工作"],
    excerpt: "分享我三年远程办公的经验...",
    views: 9876,
    replies: 156,
    likes: 423,
    isPinned: false,
    isTrending: false,
    createdAt: "1天前",
    lastReplyTime: "1小时前",
    participants: mockParticipants.slice(1, 4),
    lastReplier: mockParticipants[2],
  },
  {
    id: "11",
    title: "Vue 3 + Vite 项目最佳实践指南",
    author: {
      id: "a11",
      name: "Vue开发者",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=11",
    },
    category: "tech",
    tags: ["Vue", "Vite", "前端"],
    excerpt: "从零搭建一个生产级 Vue 3 项目...",
    views: 14567,
    replies: 234,
    likes: 654,
    isPinned: true,
    isTrending: false,
    createdAt: "3天前",
    lastReplyTime: "25分钟前",
    participants: mockParticipants.slice(0, 2),
    lastReplier: mockParticipants[3],
  },
  {
    id: "12",
    title: "摄影后期修图技巧：Lightroom 调色教程",
    author: {
      id: "a12",
      name: "摄影师",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=12",
    },
    category: "design",
    tags: ["摄影", "Lightroom", "后期"],
    excerpt: "教你如何调出电影感的色调...",
    views: 7654,
    replies: 98,
    likes: 321,
    isPinned: false,
    isTrending: false,
    createdAt: "2天前",
    lastReplyTime: "4小时前",
    participants: mockParticipants.slice(2, 4),
    lastReplier: mockParticipants[1],
  },
  {
    id: "13",
    title: "电竞显示器选购指南：高刷新率 vs 高分辨率如何选择",
    author: {
      id: "a13",
      name: "硬件达人",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=13",
    },
    category: "gaming",
    tags: ["硬件", "显示器", "电竞"],
    excerpt: "详细分析各价位段电竞显示器...",
    views: 8765,
    replies: 167,
    likes: 432,
    isPinned: false,
    isTrending: true,
    createdAt: "4小时前",
    lastReplyTime: "20分钟前",
    participants: mockParticipants.slice(0, 4),
    lastReplier: mockParticipants[0],
  },
  {
    id: "14",
    title: "独立游戏开发日记：从零到上架 Steam 的全过程",
    author: {
      id: "a14",
      name: "独立开发者",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=14",
    },
    category: "gaming",
    tags: ["游戏开发", "独立游戏", "Steam"],
    excerpt: "记录我的第一款游戏从开发到上架的历程...",
    views: 12345,
    replies: 289,
    likes: 765,
    isPinned: false,
    isTrending: false,
    createdAt: "5天前",
    lastReplyTime: "2小时前",
    participants: mockParticipants.slice(1, 3),
    lastReplier: mockParticipants[2],
  },
  {
    id: "15",
    title: "古典音乐入门推荐：从巴赫到肖邦",
    author: {
      id: "a15",
      name: "古典乐迷",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=15",
    },
    category: "music",
    tags: ["古典音乐", "推荐", "入门"],
    excerpt: "给初学者的古典音乐欣赏指南...",
    views: 4321,
    replies: 67,
    likes: 198,
    isPinned: false,
    isTrending: false,
    createdAt: "3天前",
    lastReplyTime: "6小时前",
    participants: mockParticipants.slice(0, 1),
    lastReplier: mockParticipants[3],
  },
  {
    id: "16",
    title: "Rust 语言入门：为什么它被称为最受欢迎的编程语言",
    author: {
      id: "a16",
      name: "系统程序员",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=16",
    },
    category: "tech",
    tags: ["Rust", "编程语言", "系统编程"],
    excerpt: "深入了解 Rust 的核心特性...",
    views: 16789,
    replies: 378,
    likes: 912,
    isPinned: false,
    isTrending: true,
    createdAt: "8小时前",
    lastReplyTime: "5分钟前",
    participants: mockParticipants.slice(0, 4),
    lastReplier: mockParticipants[1],
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

        {filteredTopics.length === 0 ? (
          <div className="p-12 text-center">
            <p className={colors.textMuted}>暂无相关话题</p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
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
                    className={`line-clamp-2 text-sm font-medium transition-colors ${theme === "dark" ? "text-white group-hover:text-amber-400" : "text-gray-900 group-hover:text-blue-600"}`}
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
          ))
        )}
      </div>
    </div>
  );
}
