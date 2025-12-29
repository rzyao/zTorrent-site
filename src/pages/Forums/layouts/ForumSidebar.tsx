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
  Plus,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useForumTheme } from "../context/ForumThemeContext";

interface ForumSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// 导航菜单项
const navigationItems = [
  { id: "home", name: "论坛首页", icon: Home, path: "/forum" },
  { id: "trending", name: "热门话题", icon: TrendingUp, path: "/forum/trending" },
  { id: "new", name: "最新发布", icon: Sparkles, path: "/forum/latest" },
];

// 话题分类
const topicCategories = [
  {
    id: "tech",
    name: "技术讨论",
    icon: Code,
    color: "text-blue-600",
    darkColor: "text-blue-400",
    count: 1234,
    path: "/forum/category/tech",
  },
  {
    id: "design",
    name: "设计创意",
    icon: Palette,
    color: "text-pink-600",
    darkColor: "text-pink-400",
    count: 856,
    path: "/forum/category/design",
  },
  {
    id: "gaming",
    name: "游戏娱乐",
    icon: Gamepad2,
    color: "text-purple-600",
    darkColor: "text-purple-400",
    count: 654,
    path: "/forum/category/gaming",
  },
  {
    id: "music",
    name: "音乐分享",
    icon: Music,
    color: "text-green-600",
    darkColor: "text-green-400",
    count: 432,
    path: "/forum/category/music",
  },
  {
    id: "learning",
    name: "学习成长",
    icon: BookOpen,
    color: "text-orange-600",
    darkColor: "text-orange-400",
    count: 987,
    path: "/forum/category/learning",
  },
  {
    id: "competition",
    name: "竞赛活动",
    icon: Trophy,
    color: "text-yellow-600",
    darkColor: "text-yellow-400",
    count: 321,
    path: "/forum/category/competition",
  },
];

// 热门标签
const popularTags = [
  { name: "React", count: 2345 },
  { name: "TypeScript", count: 1890 },
  { name: "UI设计", count: 1567 },
  { name: "Python", count: 1423 },
  { name: "前端开发", count: 1289 },
  { name: "人工智能", count: 1156 },
];

/**
 * 论坛布局专用左侧导航栏
 * 包含：主导航、话题分类、热门标签、社区统计
 */
export function ForumSidebar({ selectedCategory, onCategoryChange }: ForumSidebarProps) {
  const { theme, colors } = useForumTheme();
  const location = useLocation();

  // 判断链接是否激活
  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <div className="space-y-6">
      {/* 主导航 */}
      <div
        className={`${colors.cardBg} rounded-xl p-4 ${colors.shadow} border ${colors.cardBorder} transition-colors`}
      >
        <h3 className={`mb-3 text-sm font-semibold ${colors.textPrimary}`}>导航</h3>
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.path);

            let buttonClass: string;
            if (isActive) {
              buttonClass =
                theme === "dark" ? "bg-amber-500/20 text-amber-400" : "bg-blue-50 text-blue-600";
            } else {
              buttonClass = `${colors.textSecondary} ${colors.buttonHover}`;
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${buttonClass}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 话题分类 */}
      <div
        className={`${colors.cardBg} rounded-xl p-4 ${colors.shadow} border ${colors.cardBorder} transition-colors`}
      >
        <h3 className={`mb-3 text-sm font-semibold ${colors.textPrimary}`}>话题分类</h3>
        <div className="space-y-1">
          {topicCategories.map((topic) => {
            const Icon = topic.icon;
            const isActive = isActiveLink(topic.path);
            const iconColor = theme === "dark" ? topic.darkColor : topic.color;

            let buttonClass: string;
            if (isActive) {
              buttonClass = theme === "dark" ? "bg-neutral-700/50" : "bg-gray-50";
            } else {
              buttonClass = colors.buttonHover;
            }

            return (
              <Link
                key={topic.id}
                to={topic.path}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition-colors ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                  <span className={`text-sm ${colors.textSecondary}`}>{topic.name}</span>
                </div>
                <span className={`text-xs ${colors.textMuted}`}>{topic.count}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 热门标签 */}
      <div
        className={`${colors.cardBg} rounded-xl p-4 ${colors.shadow} border ${colors.cardBorder} transition-colors`}
      >
        <h3 className={`mb-3 text-sm font-semibold ${colors.textPrimary}`}>热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag.name}
              to={`/forum/tag/${encodeURIComponent(tag.name)}`}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-xs transition-colors ${
                theme === "dark"
                  ? "bg-neutral-900/30 text-neutral-300 hover:bg-neutral-800/50"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              #{tag.name} <span className={colors.textMuted}>({tag.count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 社区统计 */}
      <div
        className={`rounded-xl p-4 text-white ${
          theme === "dark"
            ? "border border-neutral-700/50 bg-neutral-800/40"
            : "bg-gradient-to-br from-blue-500 to-purple-600"
        }`}
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
