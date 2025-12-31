import { Search, MessageSquare, Bell, User, Menu, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForumTheme } from "../context/ForumThemeContext";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  /** 可选：外部控制移动端菜单开关（用于布局层控制抽屉） */
  onMobileMenuToggle?: () => void;
}

export function Header({ onSearch, searchQuery, onMobileMenuToggle }: HeaderProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { theme, toggleTheme, colors } = useForumTheme();

  // 汉堡菜单点击处理
  const handleMenuClick = () => {
    if (onMobileMenuToggle) {
      // 外部控制模式：打开抽屉
      onMobileMenuToggle();
    } else {
      // 内部控制模式：切换搜索框
      setIsMobileSearchOpen(!isMobileSearchOpen);
    }
  };

  return (
    <header className={`sticky top-0 ${colors.headerBg} border-b ${colors.borderColor} z-50`}>
      <div className="mx-auto max-w-[1420px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              className={`rounded-lg p-2 lg:hidden ${colors.buttonHover}`}
              onClick={handleMenuClick}
              aria-label="打开菜单"
            >
              <Menu className={`h-5 w-5 ${colors.textSecondary}`} />
            </button>
            <div className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-purple-600 dark:bg-amber-500/20`}
              >
                <MessageSquare className={`h-6 w-6 text-white dark:text-amber-400`} />
              </div>
              <span className={`text-xl font-semibold ${colors.textPrimary}`}>论坛社区</span>
            </div>
          </div>

          {/* Search Bar */}
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
                className={`focus:ring-opacity-50 w-full rounded-lg border py-2 pr-4 pl-10 transition-colors focus:ring-2 focus:outline-none ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} placeholder:text-gray-400 focus:ring-blue-500 dark:placeholder:text-neutral-500 dark:focus:ring-amber-500`}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* New Topic Button */}
            <button
              onClick={() => {
                import("../components/Composer/ComposerStore").then(({ useComposerStore }) => {
                  useComposerStore.getState().open("CREATE_TOPIC");
                });
              }}
              className={`hidden items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:flex dark:bg-amber-600 dark:hover:bg-amber-700`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>新话题</span>
            </button>

            {/* Theme Toggle Button */}
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

            <button className={`rounded-lg p-2 ${colors.buttonHover} relative transition-colors`}>
              <Bell className={`h-5 w-5 ${colors.textSecondary}`} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <button className={`rounded-lg p-2 ${colors.buttonHover} transition-colors`}>
              <User className={`h-5 w-5 ${colors.textSecondary}`} />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <div className="relative">
            <Search
              className={`absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 ${colors.textMuted}`}
            />
            <input
              type="text"
              placeholder="搜索话题、帖子..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className={`focus:ring-opacity-50 w-full rounded-lg border py-2 pr-4 pl-10 transition-colors focus:ring-2 focus:outline-none ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} focus:ring-blue-500 dark:focus:ring-amber-500`}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
