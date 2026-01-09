import { useEffect, useRef, Suspense } from "react";
import "@/modules/app/styles/app.css";
import { useLocation } from "react-router-dom";
import { Header } from "@/modules/app/layouts/Header";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";
import { useNavigationState } from "@/hooks/useNavigationState";
import GoBack from "@/components/GoBack";
import GoForward from "@/components/GoForward";
import { RouteProgressBar } from "@/components/ui/RouteProgressBar";

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
      <FaviconInjector />
      <NavigationStateReset />
      <div className="min-h-screen bg-[#0F171E]">
        <Header />
        <Suspense fallback={<RouteProgressBar />}>
          <div>{children}</div>
        </Suspense>
        {/* 前进/后退按钮：手机模式隐藏 */}
        <div className="hidden md:block">
          <GoBack />
          <GoForward />
        </div>
      </div>
    </SiteConfigProvider>
  );
}
