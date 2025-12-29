import { Outlet } from "react-router-dom";
import { useState, useCallback } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { MobileSidebarDrawer } from "../components/MobileSidebarDrawer";
import { ForumThemeProvider, useForumTheme } from "../context/ForumThemeContext";

/**
 * 论坛布局内部组件
 * 负责渲染顶部导航栏、左侧边栏和内容区域
 * 手机模式下左侧导航栏收入汉堡菜单（Discourse 风格）
 */
function ForumLayoutInner() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useForumTheme();

  // 根据主题选择滚动条样式类
  const scrollbarClass = theme === "dark" ? "scrollbar-forum-dark" : "scrollbar-forum-light";
  const pageBg = theme === "dark" ? "bg-[#0F171E]" : "bg-gray-50";

  // 移动端菜单控制回调
  const handleOpenMobileMenu = useCallback(() => setIsMobileMenuOpen(true), []);
  const handleCloseMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <div
      className={`h-screen overflow-y-scroll ${scrollbarClass} ${pageBg} transition-colors duration-200`}
    >
      {/* 顶部导航栏 - 传入移动端菜单控制回调 */}
      <Header
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onMobileMenuToggle={handleOpenMobileMenu}
      />

      {/* 移动端侧边栏抽屉 - Discourse 风格 */}
      <MobileSidebarDrawer
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* 主体内容区域 */}
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* 左侧边栏: 桌面端显示，sticky 定位 */}
          <aside
            className={`${scrollbarClass} hidden lg:sticky lg:top-24 lg:col-span-3 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain`}
          >
            <Sidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </aside>

          {/* 右侧内容区域 */}
          <main className="lg:col-span-9">
            <Outlet context={{ selectedCategory, searchQuery }} />
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * 论坛布局组件
 * 包装 ForumThemeProvider，提供主题上下文
 */
export function ForumLayout() {
  return (
    <ForumThemeProvider>
      <ForumLayoutInner />
    </ForumThemeProvider>
  );
}

/**
 * 用于子路由获取布局上下文的 hook
 */
export interface ForumOutletContext {
  selectedCategory: string;
  searchQuery: string;
}
