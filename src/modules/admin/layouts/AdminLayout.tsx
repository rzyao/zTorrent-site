import { Suspense, useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ConfigProvider, App } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import "@/modules/admin/styles/admin.css";
import { AdminSidebar } from "./AdminSidebar";
import { RouteProgressBar } from "@/modules/app/components/ui/RouteProgressBar";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";
import { useKeepAliveTabs } from "./KeepAlive/useKeepAliveTabs";
import KeepAliveTabs from "./KeepAlive/KeepAliveTabs";
import KeepAliveContent from "./KeepAlive/KeepAliveContent";

function FaviconInjector() {
  useDynamicFavicon();
  return null;
}

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  // KeepAlive 标签页状态管理
  const { items, activeKey, onEdit, handleTabClick } = useKeepAliveTabs();

  // 刷新当前页面
  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // 退出登录
  const handleLogout = useCallback(() => {
    // TODO: 实现真正的退出登录逻辑
    navigate("/app/login");
  }, [navigate]);

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
              {/* 顶部标签页导航 */}
              <KeepAliveTabs
                items={items}
                activeKey={activeKey}
                onEdit={onEdit}
                onTabClick={handleTabClick}
                handleRefresh={handleRefresh}
                handleLogout={handleLogout}
              />

              <div className="flex min-h-0 flex-1 flex-col overflow-auto">
                <AnimatePresence mode="wait">
                  <Suspense fallback={<RouteProgressBar />}>
                    <KeepAliveContent items={items} activeKey={activeKey}>
                      <Outlet />
                    </KeepAliveContent>
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
