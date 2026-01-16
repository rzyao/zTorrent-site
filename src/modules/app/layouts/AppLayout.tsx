import { useEffect, useRef, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/modules/app/layouts/Header";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";
import { useNavigationState } from "@/hooks/useNavigationState";
import GoBack from "@/modules/app/components/GoBack";
import GoForward from "@/modules/app/components/GoForward";

import { RouteProgressBar } from "@/modules/app/components/ui/RouteProgressBar";

import { TitleInjector } from "@/components/TitleInjector";
import { useRouteConfig } from "@/hooks/useRouteConfig";
import { ForumComposer } from "@/modules/forum/components/Composer/ForumComposer";
import { ForumThemeProvider } from "@/modules/forum/context/ForumThemeContext";

function FaviconInjector() {
  useDynamicFavicon();
  return null;
}

// 监听路由变化，记录项目内导航
function NavigationStateReset() {
  const location = useLocation();
  const { recordNavigation } = useNavigationState();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 跳过首次渲染，只记录后续导航
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    recordNavigation();
  }, [location.pathname, recordNavigation]);

  return null;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteConfigProvider>
      <ForumThemeProvider forceTheme="dark">
        <FaviconInjector />
        <TitleInjector />
        <NavigationStateReset />
        {/* 
          App 样式作用域容器
          ID 必须与 app.css 中的选择器 #root-app 匹配
          架构调整：将滚动容器从 body 转移到 #root-app，防止 Radix UI 锁定 body 时导致页面抖动
        */}
        <div id="root-app" className="flex h-screen w-full flex-col overflow-y-auto bg-[#0F171E]">
          <Header />

          {/* 
            悬浮导航按钮容器 - 架构优化
            使用 sticky 定位在滚动容器内部，从而：
            1. 始终相对于视口固定（类似 fixed）
            2. 但宽度受限于父容器 (#root-app)，因此 right-0 会自动避开滚动条区域
            3. 彻底解决 fixed right-0 遮挡滚动条的问题
          */}
          <div className="pointer-events-none sticky top-0 z-40 hidden h-0 w-full overflow-visible md:block">
            {/* 这里的 top-0 是相对于滚动容器顶部的，实际按钮需要再向下偏移 Header 高度 */}
            <div className="pointer-events-auto absolute top-0 left-0 h-[calc(100vh-64px)] w-20">
              <GoBack />
            </div>
            <div className="pointer-events-auto absolute top-0 right-0 h-[calc(100vh-64px)] w-20">
              <GoForward />
            </div>
          </div>

          <Suspense fallback={<RouteProgressBar />}>
            <div className="flex-1">{children}</div>
          </Suspense>
        </div>
        {/* 论坛编辑器浮动层 - 复用论坛模块的 Composer 组件 */}
        <ForumComposer />
      </ForumThemeProvider>
    </SiteConfigProvider>
  );
}
