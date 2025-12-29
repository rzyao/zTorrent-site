import {
  Search,
  MessageSquare,
  Bell,
  User,
  Menu,
  Sun,
  Moon,
  Home,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForumTheme } from "../context/ForumThemeContext";

interface ForumHeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

/**
 * 论坛布局专用顶部导航栏
 * 包含：Logo、搜索框、用户操作、主题切换
 */
export function ForumHeader({ onSearch, searchQuery }: ForumHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, colors } = useForumTheme();
  const navigate = useNavigate();

  return (
    <header
      className={`${
        theme === "light" ? "bg-white" : "bg-[#0F171E]/80 backdrop-blur-md"
      } border-b ${colors.borderColor} sticky top-0 z-50 transition-colors duration-200`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 左侧：菜单按钮 + Logo + 返回主站 */}
          <div className="flex items-center gap-3">
            {/* 移动端菜单按钮 */}
            <button
              className={`rounded-lg p-2 lg:hidden ${colors.buttonHover}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className={`h-5 w-5 ${colors.textSecondary}`} />
            </button>

            {/* Logo */}
            <Link to="/forum" className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  theme === "dark"
                    ? "bg-amber-500/20"
                    : "bg-gradient-to-br from-blue-500 to-purple-600"
                }`}
              >
                <MessageSquare
                  className={`h-6 w-6 ${theme === "dark" ? "text-amber-400" : "text-white"}`}
                />
              </div>
              <span className={`text-xl font-semibold ${colors.textPrimary}`}>论坛社区</span>
            </Link>

            {/* 返回主站按钮 */}
            <Link
              to="/home"
              className={`ml-4 hidden items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors md:flex ${colors.buttonHover} ${colors.textSecondary}`}
            >
              <ChevronLeft className="h-4 w-4" />
              主站
            </Link>
          </div>

          {/* 中间：搜索框 */}
          <div className="mx-8 hidden max-w-lg flex-1 md:flex">
            <div className="relative w-full">
              <Search
                className={`absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 ${colors.textMuted}`}
              />
              <input
                type="text"
                placeholder="搜索话题、帖子..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className={`focus:ring-opacity-50 w-full rounded-lg border py-2 pr-4 pl-10 transition-colors focus:ring-2 focus:outline-none ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} ${
                  theme === "dark"
                    ? "placeholder:text-neutral-500 focus:ring-amber-500"
                    : "placeholder:text-gray-400 focus:ring-blue-500"
                }`}
              />
            </div>
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex items-center gap-2">
            {/* 主题切换 */}
            <button
              onClick={toggleTheme}
              className={`rounded-lg p-2 ${colors.buttonHover} transition-colors`}
              title={theme === "light" ? "切换到深色模式" : "切换到浅色模式"}
            >
              {theme === "light" ? (
                <Moon className={`h-5 w-5 ${colors.textSecondary}`} />
              ) : (
                <Sun className={`h-5 w-5 ${colors.textSecondary}`} />
              )}
            </button>

            {/* 通知 */}
            <button className={`relative rounded-lg p-2 ${colors.buttonHover} transition-colors`}>
              <Bell className={`h-5 w-5 ${colors.textSecondary}`} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* 用户 */}
            <button className={`rounded-lg p-2 ${colors.buttonHover} transition-colors`}>
              <User className={`h-5 w-5 ${colors.textSecondary}`} />
            </button>

            {/* 发布话题按钮 */}
            <Link
              to="/forum/create"
              className={`hidden rounded-lg px-4 py-2 transition-colors sm:block ${colors.buttonPrimary}`}
            >
              发布话题
            </Link>
          </div>
        </div>

        {/* 移动端搜索框 */}
        {isMobileMenuOpen && (
          <div className="border-t border-neutral-700/30 pt-4 pb-4 md:hidden">
            <div className="relative">
              <Search
                className={`absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 ${colors.textMuted}`}
              />
              <input
                type="text"
                placeholder="搜索话题、帖子..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className={`focus:ring-opacity-50 w-full rounded-lg border py-2 pr-4 pl-10 transition-colors focus:ring-2 focus:outline-none ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} ${
                  theme === "dark" ? "focus:ring-amber-500" : "focus:ring-blue-500"
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
