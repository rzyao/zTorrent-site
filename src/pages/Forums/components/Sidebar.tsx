import {
  Home,
  TrendingUp,
  Sparkles,
  Code,
  Palette,
  Gamepad2,
  Music,
  BookOpen,
  Trophy,
  Users,
} from "lucide-react";
import { useForumTheme } from "../context/ForumThemeContext";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", name: "全部", icon: Home },
  { id: "trending", name: "热门话题", icon: TrendingUp },
  { id: "new", name: "最新发布", icon: Sparkles },
];

const topics = [
  {
    id: "tech",
    name: "技术讨论",
    icon: Code,
    color: "text-blue-600",
    darkColor: "text-blue-400",
    count: 1234,
  },
  {
    id: "design",
    name: "设计创意",
    icon: Palette,
    color: "text-pink-600",
    darkColor: "text-pink-400",
    count: 856,
  },
  {
    id: "gaming",
    name: "游戏娱乐",
    icon: Gamepad2,
    color: "text-purple-600",
    darkColor: "text-purple-400",
    count: 654,
  },
  {
    id: "music",
    name: "音乐分享",
    icon: Music,
    color: "text-green-600",
    darkColor: "text-green-400",
    count: 432,
  },
  {
    id: "learning",
    name: "学习成长",
    icon: BookOpen,
    color: "text-orange-600",
    darkColor: "text-orange-400",
    count: 987,
  },
  {
    id: "competition",
    name: "竞赛活动",
    icon: Trophy,
    color: "text-yellow-600",
    darkColor: "text-yellow-400",
    count: 321,
  },
];

const popularTags = [
  { name: "React", count: 2345 },
  { name: "TypeScript", count: 1890 },
  { name: "UI设计", count: 1567 },
  { name: "Python", count: 1423 },
  { name: "前端开发", count: 1289 },
  { name: "人工智能", count: 1156 },
];

export function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  const { theme, colors } = useForumTheme();

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div
        className={`${colors.cardBg} rounded-xl p-4 ${colors.shadow} border ${colors.cardBorder} transition-colors`}
      >
        <h3 className={`mb-3 text-sm font-semibold ${colors.textPrimary}`}>导航</h3>
        <nav className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;

            let buttonClass: string;
            if (isActive) {
              buttonClass =
                theme === "dark" ? "bg-amber-500/20 text-amber-400" : "bg-blue-50 text-blue-600";
            } else {
              buttonClass = `${colors.textSecondary} ${colors.buttonHover}`;
            }

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors ${buttonClass}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{category.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Topics */}
      <div
        className={`${colors.cardBg} rounded-xl p-4 ${colors.shadow} border ${colors.cardBorder} transition-colors`}
      >
        <h3 className={`mb-3 text-sm font-semibold ${colors.textPrimary}`}>话题分类</h3>
        <div className="space-y-1">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isActive = selectedCategory === topic.id;
            const iconColor = theme === "dark" ? topic.darkColor : topic.color;

            // 深色模式下，非激活状态的文字颜色需要调整，激活状态下背景也不同
            let buttonClass: string;
            if (isActive) {
              buttonClass = theme === "dark" ? "bg-neutral-700/50" : "bg-gray-50";
            } else {
              buttonClass = colors.buttonHover;
            }

            return (
              <button
                key={topic.id}
                onClick={() => onCategoryChange(topic.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                  <span className={`text-sm ${colors.textSecondary}`}>{topic.name}</span>
                </div>
                <span className={`text-xs ${colors.textMuted}`}>{topic.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Tags */}
      <div
        className={`${colors.cardBg} rounded-xl p-4 ${colors.shadow} border ${colors.cardBorder} transition-colors`}
      >
        <h3 className={`mb-3 text-sm font-semibold ${colors.textPrimary}`}>热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag.name}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                theme === "dark"
                  ? "bg-neutral-700/50 text-neutral-300 hover:bg-neutral-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              #{tag.name} <span className={colors.textMuted}>({tag.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats - 社区统计卡片在深色模式下可以保持鲜艳，或者稍微调暗 */}
      <div
        className={`rounded-xl p-4 text-white shadow-sm ${theme === "dark" ? "border border-neutral-700 bg-neutral-800/60" : "bg-linear-to-br from-blue-500 to-purple-600"}`}
      >
        <div className="mb-3 flex items-center gap-3">
          <Users className={`h-6 w-6 ${theme === "dark" ? "text-amber-400" : "text-white"}`} />
          <h3 className="font-semibold">社区统计</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className={theme === "dark" ? "text-neutral-400" : "text-blue-100"}>
              总用户数
            </span>
            <span className="font-semibold">128,456</span>
          </div>
          <div className="flex justify-between">
            <span className={theme === "dark" ? "text-neutral-400" : "text-blue-100"}>
              今日活跃
            </span>
            <span className="font-semibold">12,345</span>
          </div>
          <div className="flex justify-between">
            <span className={theme === "dark" ? "text-neutral-400" : "text-blue-100"}>
              总帖子数
            </span>
            <span className="font-semibold">456,789</span>
          </div>
        </div>
      </div>
    </div>
  );
}
