import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { ConfigProvider, App } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import "@/modules/admin/styles/admin.css";
import { AdminSidebar } from "./AdminSidebar";
import { RouteProgressBar } from "@/modules/app/components/ui/RouteProgressBar";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";

function FaviconInjector() {
  useDynamicFavicon();
  return null;
}

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
        },
      }}
    >
      <App>
        <SiteConfigProvider>
          <FaviconInjector />
          <div className="admin-layout flex h-screen w-full overflow-hidden bg-gray-50">
            {/* 侧边栏 */}
            <AdminSidebar collapsed={collapsed} onCollapse={setCollapsed} />

            {/* 主内容区域 */}
            <motion.main
              initial={false}
              animate={{ paddingLeft: collapsed ? 64 : 256 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex min-h-0 min-w-0 flex-1 flex-col"
            >
              {/* 顶部简单的 Header (可选，如果需要可以后续丰富) */}
              <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6">
                <div className="text-sm font-medium text-gray-500">后台管理系统</div>
                <div className="flex items-center gap-4">
                  {/* 这里可以放通知、搜索、用户头像等 */}
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                </div>
              </header>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
                <AnimatePresence mode="wait">
                  <Suspense fallback={<RouteProgressBar />}>
                    <Outlet />
                  </Suspense>
                </AnimatePresence>
              </div>
            </motion.main>
          </div>
        </SiteConfigProvider>
      </App>
    </ConfigProvider>
  );
}
