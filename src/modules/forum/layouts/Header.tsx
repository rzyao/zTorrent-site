import { Search, MessageSquare, Bell, User, Menu, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo.svg";
import { useForumTheme } from "../context/ForumThemeContext";
import { ForumsTopicsService, ForumTopic } from "@/api";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  /** 可选：外部控制移动端菜单开关（用于布局层控制抽屉） */
  onMobileMenuToggle?: () => void;
}

export function Header({ onSearch, searchQuery, onMobileMenuToggle }: HeaderProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { theme, toggleTheme, colors } = useForumTheme();

  const [results, setResults] = useState<(ForumTopic & { id: string })[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search effect with race condition handling
  useEffect(() => {
    let active = true; // 标记当前 effect 是否有效

    const timer = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          const res = await ForumsTopicsService.topicsControllerSearch({
            search: searchQuery,
            page: 1,
            limit: 5,
          });

          // 只有当 effect 仍然 active 时才更新状态
          if (active && res.data?.items) {
            setResults(res.data.items as unknown as (ForumTopic & { id: string })[]);
          }
        } catch (err) {
          if (active) {
            console.error("Search failed", err);
            setResults([]);
          }
        }
      } else {
        if (active) setResults([]);
      }
    }, 500); // 500ms 防抖

    return () => {
      clearTimeout(timer);
      active = false; // 清理时标记失效，丢弃未完成的请求结果
    };
  }, [searchQuery]);

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
          {/* Logo - 与 App Header 保持一致 */}
          <div className="flex items-center gap-3">
            <button
              className={`rounded-lg p-2 lg:hidden ${colors.buttonHover}`}
              onClick={handleMenuClick}
              aria-label="打开菜单"
            >
              <Menu className={`h-5 w-5 ${colors.textSecondary}`} />
            </button>
            <Link to="/forum" className="flex items-center gap-2">
              <img src={Logo} alt="Logo" className="h-7 md:h-9" />
              <span className={`text-xl font-semibold ${colors.textPrimary}`}>论坛社区</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mx-8 hidden max-w-lg flex-1 md:flex">
            <div className="relative w-full">
              <Search
                className={`absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 ${colors.textMuted}`}
              />
              <input
                type="text"
                placeholder="搜索话题..."
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)} // 延迟 blur 以便点击结果
                onChange={(e) => onSearch(e.target.value)}
                className={`focus:ring-opacity-50 w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} placeholder:text-gray-400 focus:ring-blue-500 dark:placeholder:text-neutral-500 dark:focus:ring-amber-500`}
              />

              {/* Search Results Dropdown */}
              {isFocused && results.length > 0 && searchQuery.trim() && (
                <div
                  className={`absolute top-full left-0 mt-2 w-full overflow-hidden rounded-lg border shadow-xl ${colors.listBg} ${colors.borderColor}`}
                >
                  <ul className="max-h-96 overflow-y-auto py-2">
                    {results.map((topic) => (
                      <li key={topic.id}>
                        <Link
                          to={`/forum/topic/${topic.id}`}
                          className={`block px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800 ${colors.textPrimary}`}
                          onClick={() => {
                            onSearch(""); // 清空搜索以便下次
                            setResults([]);
                          }}
                        >
                          <div className="font-medium">{topic.title}</div>
                          <div className={`mt-1 truncate text-xs ${colors.textSecondary}`}>
                            {topic.content?.substring(0, 50)}...
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {results.length >= 5 && (
                    <div
                      className={`border-t bg-gray-50 px-4 py-2 text-center text-xs text-gray-500 dark:border-neutral-700 dark:bg-neutral-900 ${colors.borderColor}`}
                    >
                      仅显示前 5 条结果
                    </div>
                  )}
                </div>
              )}
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
              className={`hidden items-center gap-2 rounded-lg bg-[#0088CC] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#007bb5] sm:flex`}
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
              className={`focus:ring-opacity-50 w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} focus:ring-blue-500 dark:focus:ring-amber-500`}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
