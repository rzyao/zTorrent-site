import { Suspense, useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AdminSidebar } from "./AdminSidebar";
import { RouteProgressBar } from "@/modules/app/components/ui/RouteProgressBar";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { useDynamicFavicon } from "@/hooks/useDynamicFavicon";
import { useRouteConfig } from "@/hooks/useRouteConfig";
import { useKeepAliveTabs } from "./KeepAlive/useKeepAliveTabs";
import { KeepAliveTabs } from "./KeepAlive/KeepAliveTabs";
import KeepAliveContent from "./KeepAlive/KeepAliveContent";
import { KeepAliveContext } from "./KeepAlive/KeepAliveContext";

function FaviconInjector() {
  useDynamicFavicon();
  return null;
}

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const { routes } = useRouteConfig();

  // KeepAlive 标签页状态管理
  const { items, activeKey, onEdit, handleTabClick, setTabSaved, removeTabs } =
    useKeepAliveTabs(routes);

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
    <SiteConfigProvider>
      <FaviconInjector />
      {/* 
        即使在集成模式下，我们也需要 #root-admin 容器来应用 admin-theme.css 中的 Scoped 变量。
        注意: 这个 ID 必须与 admin-theme.css 中的选择器匹配。
        如果页面中同时存在 #root-app (App Shell) 和 #root-admin (Content)，样式可以共存。
      */}
      <KeepAliveContext.Provider value={{ setTabSaved }}>
        <div id="root-admin" className="h-full w-full">
          <div className="admin-layout text-antd-text flex h-screen w-full overflow-hidden bg-white">
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
                removeTabs={removeTabs}
                onTabClick={handleTabClick}
                handleRefresh={handleRefresh}
                handleLogout={handleLogout}
              />

              <div className="flex min-h-0 flex-1 flex-col overflow-auto">
                <AnimatePresence mode="wait">
                  <Suspense fallback={<RouteProgressBar />}>
                    <KeepAliveContent key={refreshKey} items={items} activeKey={activeKey}>
                      <Outlet />
                    </KeepAliveContent>
                  </Suspense>
                </AnimatePresence>
              </div>
            </motion.main>
          </div>
        </div>
      </KeepAliveContext.Provider>
    </SiteConfigProvider>
  );
}
