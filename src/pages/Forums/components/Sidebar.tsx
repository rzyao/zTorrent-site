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

/**
 * 分割线组件
 */
function Divider({ className = "" }: { className?: string }) {
  const { colors } = useForumTheme();
  return <div className={`border-t ${colors.borderColor} ${className}`} />;
}

export function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  const { theme, colors } = useForumTheme();

  return (
    // 整体一个大卡片
    <div className="overflow-hidden transition-colors">
      {/* 导航模块 */}
      <div className="p-4">
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
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${buttonClass}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm">{category.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 分割线 */}
      <Divider />

      {/* 话题分类模块 */}
      <div className="p-4">
        <h3 className={`mb-3 text-sm font-semibold ${colors.textPrimary}`}>话题分类</h3>
        <div className="space-y-1">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isActive = selectedCategory === topic.id;
            const iconColor = theme === "dark" ? topic.darkColor : topic.color;

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
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 transition-colors ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                  <span className={`text-sm ${colors.textSecondary}`}>
                    {topic.name}
                    <span className={`ml-1 ${colors.textMuted}`}>({topic.count})</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 分割线 */}
      <Divider />

      {/* 热门标签模块 */}
      <div className="p-4">
        <h3 className={`mb-3 text-sm font-semibold ${colors.textPrimary}`}>热门标签</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag.name}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-xs transition-colors ${
                theme === "dark"
                  ? "bg-neutral-900/30 text-neutral-300 hover:bg-neutral-800/50"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              #{tag.name} <span className={colors.textMuted}>({tag.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 分割线 */}
      <Divider />

      {/* 社区统计模块 - 统一样式 */}
      <div className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <Users className={`h-5 w-5 ${theme === "dark" ? "text-amber-400" : "text-blue-500"}`} />
          <h3 className={`text-sm font-semibold ${colors.textPrimary}`}>社区统计</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className={colors.textSecondary}>总用户数</span>
            <span className={`font-semibold ${colors.textPrimary}`}>128,456</span>
          </div>
          <div className="flex justify-between">
            <span className={colors.textSecondary}>今日活跃</span>
            <span className={`font-semibold ${colors.textPrimary}`}>12,345</span>
          </div>
          <div className="flex justify-between">
            <span className={colors.textSecondary}>总帖子数</span>
            <span className={`font-semibold ${colors.textPrimary}`}>456,789</span>
          </div>
        </div>
      </div>
    </div>
  );
}
