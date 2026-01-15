import { Outlet } from "react-router-dom";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { TitleInjector } from "@/components/TitleInjector";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";

function FaviconInjector() {
  useDynamicFavicon();
  return null;
}
import "@/modules/forum/forum.css";
import { useState, useCallback, Suspense } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileSidebarDrawer } from "./MobileSidebarDrawer";
import { ForumThemeProvider, useForumTheme } from "../context/ForumThemeContext";
import { ForumComposer } from "../components/Composer/ForumComposer";
import { RouteProgressBar } from "@/modules/forum/components/ui/RouteProgressBar";

/**
 * 论坛布局内部组件
 * 负责渲染顶部导航栏、左侧边栏和内容区域
 * 手机模式下左侧导航栏收入汉堡菜单（Discourse 风格）
 */
function ForumLayoutInner() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, colors } = useForumTheme();

  // 滚动条样式现在由 CSS 类本身处理暗黑模式，无需 JS 动态计算
  const mainScrollbarClass = "scrollbar-main";
  const sidebarScrollbarClass = "scrollbar-sidebar";

  // 移动端菜单控制回调
  const handleOpenMobileMenu = useCallback(() => setIsMobileMenuOpen(true), []);
  const handleCloseMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <div
      id="root-forum"
      className={`flex h-screen flex-col overflow-y-auto ${colors.pageBg}`}
      style={{ scrollbarGutter: "stable" }}
    >
      {/* 顶部导航栏 - 固定在顶部 */}
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
      <div className={`relative flex-1 ${colors.listBg}`}>
        <div className="mx-auto max-w-[1420px] px-4 sm:px-6 lg:px-8">
          <div className={`flex items-start gap-8 ${colors.listBg}`}>
            {/* 左侧边栏: Fixed 定位，独立滚动 */}
            <aside
              className={`fixed top-[64px] left-0 hidden w-[280px] shrink-0 border-r pt-[20px] pr-4 pl-5 ${colors.borderColor} ${sidebarScrollbarClass} lg:block lg:h-[calc(100vh-64px)] lg:overflow-y-auto`}
              style={{ left: "max(0px, calc((100vw - 1420px) / 2))" }}
            >
              <Sidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            </aside>

            {/* 右侧内容区域: 使用全局滚动，左边距为侧栏宽度 */}
            <main className="min-w-0 flex-1 pt-[20px] pr-5 lg:ml-[280px]">
              <Suspense fallback={<RouteProgressBar />}>
                <Outlet context={{ selectedCategory, searchQuery }} />
              </Suspense>
            </main>
          </div>
        </div>
      </div>
      {/* 论坛全局编辑器 */}
      <ForumComposer />
    </div>
  );
}

/**
 * 论坛布局组件
 * 包装 ForumThemeProvider，提供主题上下文
 */
export function ForumLayout() {
  return (
    <SiteConfigProvider>
      <FaviconInjector />
      <TitleInjector />
      <ForumThemeProvider>
        <ForumLayoutInner />
      </ForumThemeProvider>
    </SiteConfigProvider>
  );
}

/**
 * 用于子路由获取布局上下文的 hook
 */
export interface ForumOutletContext {
  selectedCategory: string;
  searchQuery: string;
}
