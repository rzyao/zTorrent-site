import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { RouteProgressBar } from "@/components/ui/RouteProgressBar";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";

function FaviconInjector() {
  useDynamicFavicon();
  return null;
}

export function AdminLayout() {
  return (
    <SiteConfigProvider>
      <FaviconInjector />
      {/* 整体浅灰色背景，与白色侧边栏形成对比 */}
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="flex flex-1">
          <AdminSidebar />
          {/* 主内容区域：动态适配侧边栏宽度 */}
          <main className="min-w-0 flex-1 bg-gray-50 transition-all duration-300 md:pl-64">
            <div className="h-full p-6">
              <Suspense fallback={<RouteProgressBar />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </SiteConfigProvider>
  );
}
