/**
 * 动态路由渲染器
 * 根据后端配置动态生成路由
 */
import { Suspense, createElement } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { RouteConfig } from "@/types/routeConfig";
import { useRouteConfig } from "@/hooks/useRouteConfig";
import { componentRegistry, hasComponent, getComponent } from "./componentRegistry";
import { AuthRoute } from "./guards";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { RouteProgressBar } from "@/components/ui/RouteProgressBar";
import AppLayout from "@/layouts/AppLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

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
      // ForumLayout 通过 componentRegistry 动态加载
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
  const { id, path, component, permissions, children, index, redirect, name } = config;

  // 构建完整路径（用于调试）
  const fullPath = index ? parentPath : path.startsWith("/") ? path : `${parentPath}/${path}`;

  // 处理重定向
  if (redirect) {
    return <Route key={id} path={path} element={<Navigate to={redirect} replace />} />;
  }

  // 获取组件
  const LazyComponent = component ? getComponent(component) : null;

  // 构建元素
  let element: React.ReactNode;

  if (LazyComponent) {
    element = <Suspense fallback={<RouteProgressBar />}>{createElement(LazyComponent)}</Suspense>;
  } else if (children && children.length > 0) {
    // 父级路由，使用 Outlet
    element = <Outlet />;
  } else {
    // 空组件（占位）
    element = <div className="p-8 text-white">页面开发中...</div>;
  }

  // 注意：权限控制由后端动态路由 API 负责
  // 后端 /routes/user 接口只返回当前用户有权访问的路由
  // 前端无需做二次权限验证

  // 渲染子路由
  if (children && children.length > 0) {
    return (
      <Route key={id} path={path} element={element}>
        {children.map((child) => renderRoute(child, fullPath))}
      </Route>
    );
  }

  // 索引路由
  if (index) {
    return <Route key={id} index element={element} />;
  }

  // 普通路由
  return <Route key={id} path={path} element={element} />;
}

/**
 * 渲染带布局的路由组
 */
function renderLayoutRoutes(config: RouteConfig): React.ReactNode {
  const { id, path, layout, children, component } = config;

  // 获取布局组件
  const LayoutComponent = getLayoutWrapper(layout);

  // 论坛布局特殊处理：使用 componentRegistry 中的 ForumLayout
  if (layout === "forum" && component) {
    const ForumLayoutComponent = getComponent(component);
    if (ForumLayoutComponent) {
      return (
        <Route
          key={id}
          path={path}
          element={
            <AuthRoute>
              <Suspense fallback={<RouteProgressBar />}>
                {createElement(ForumLayoutComponent)}
              </Suspense>
            </AuthRoute>
          }
        >
          {children?.map((child) => renderRoute(child, path))}
        </Route>
      );
    }
  }

  // Admin 布局
  // 权限控制由后端动态路由 API 负责，前端只检查登录状态
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

  // App 布局（默认）
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

  // 无布局
  return children?.map((child) => renderRoute(child, path));
}

/**
 * 动态路由组件
 */
export function DynamicRoutes() {
  const { routes, isLoading } = useRouteConfig();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Routes>
      {routes.map((config) => renderLayoutRoutes(config))}

      {/* 未匹配路由重定向 */}
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

/**
 * 404 重定向
 */
function NotFoundRedirect() {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return <Navigate to={isLoggedIn ? "/home" : "/login"} replace />;
}
