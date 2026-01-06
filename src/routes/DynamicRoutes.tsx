/**
 * 动态路由渲染器
 * 根据后端配置动态生成路由
 */
import { Suspense, createElement, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { RouteConfig } from "@/types/routeConfig";
import { useRouteConfig } from "@/hooks/useRouteConfig";
import { getComponent } from "./componentRegistry";
import { AuthRoute } from "./guards";
import { RouteProgressBar } from "@/components/ui/RouteProgressBar";
import { GlobalLoaderTrigger } from "@/components/ui/GlobalLoader";
import { useGlobalLoader } from "@/stores/globalLoaderStore";
import AppLayout from "@/modules/app/layouts/AppLayout";
import { AdminLayout } from "@/modules/admin/layouts/AdminLayout";

/**
 * 根据布局类型获取布局组件
 */
function getLayoutWrapper(layout: string | undefined) {
  switch (layout) {
    case "app":
      return AppLayout;
    case "admin":
      return AdminLayout;
    case "forum":
      return null;
    case "none":
    default:
      return null;
  }
}

/**
 * 渲染单个路由配置
 */
function renderRoute(config: RouteConfig, parentPath: string = ""): React.ReactNode {
  const { id, path, component, children, index, redirect } = config;
  const fullPath = index ? parentPath : path.startsWith("/") ? path : `${parentPath}/${path}`;

  if (redirect) {
    return <Route key={id} path={path} element={<Navigate to={redirect} replace />} />;
  }

  const LazyComponent = component ? getComponent(component) : null;
  let element: React.ReactNode;

  if (LazyComponent) {
    element = <Suspense fallback={<RouteProgressBar />}>{createElement(LazyComponent)}</Suspense>;
  } else if (children && children.length > 0) {
    element = <Outlet />;
  } else {
    element = <div className="p-8 text-white">页面开发中...</div>;
  }

  if (children && children.length > 0) {
    return (
      <Route key={id} path={path} element={element}>
        {children.map((child) => renderRoute(child, fullPath))}
      </Route>
    );
  }

  if (index) {
    return <Route key={id} index element={element} />;
  }

  return <Route key={id} path={path} element={element} />;
}

/**
 * 渲染带布局的路由组
 */
function renderLayoutRoutes(config: RouteConfig): React.ReactNode {
  const { id, path, layout, children, component } = config;
  const LayoutComponent = getLayoutWrapper(layout);

  // 论坛布局：使用全局加载器触发器
  if (layout === "forum" && component) {
    const ForumLayoutComponent = getComponent(component);
    if (ForumLayoutComponent) {
      return (
        <Route
          key={id}
          path={path}
          element={
            <AuthRoute>
              <div className="min-h-screen bg-[#0a0a0a]">
                <Suspense fallback={<GlobalLoaderTrigger />}>
                  {createElement(ForumLayoutComponent)}
                </Suspense>
              </div>
            </AuthRoute>
          }
        >
          {children?.map((child) => renderRoute(child, path))}
        </Route>
      );
    }
  }

  // Admin 布局
  if (layout === "admin") {
    return (
      <Route
        key={id}
        path={path}
        element={
          <AuthRoute>
            <AdminLayout />
          </AuthRoute>
        }
      >
        {children?.map((child) => renderRoute(child, path))}
        <Route index element={<Navigate to={`${path}/routes`} replace />} />
      </Route>
    );
  }

  // App 布局
  if (LayoutComponent) {
    return (
      <Route
        key={id}
        element={
          <AuthRoute>
            <LayoutComponent>
              <Outlet />
            </LayoutComponent>
          </AuthRoute>
        }
      >
        {children?.map((child) => renderRoute(child, ""))}
      </Route>
    );
  }

  return children?.map((child) => renderRoute(child, path));
}

/**
 * 路由加载指示器组件
 * 在路由配置加载期间显示全局加载器
 */
function RouteConfigLoader() {
  const { startLoading, finishLoading } = useGlobalLoader();

  useEffect(() => {
    startLoading();
    return () => finishLoading();
  }, [startLoading, finishLoading]);

  return null;
}

/**
 * 动态路由组件
 */
export function DynamicRoutes() {
  const { routes, isLoading } = useRouteConfig();

  // 路由配置加载中 - 显示加载器
  if (isLoading) {
    return <RouteConfigLoader />;
  }

  return (
    <Routes>
      {routes.map((config) => renderLayoutRoutes(config))}
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

function NotFoundRedirect() {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return <Navigate to={isLoggedIn ? "/home" : "/login"} replace />;
}
