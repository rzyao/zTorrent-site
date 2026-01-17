/**
 * 动态路由渲染器
 * 根据后端配置动态生成路由
 */
import React, { Suspense, createElement, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { RouteConfig } from "@/types/routeConfig";
import { useRouteConfig } from "@/hooks/useRouteConfig";
import { getComponent } from "./componentRegistry";
import { AuthRoute } from "./guards";
import { RouteProgressBar } from "@/modules/app/components/ui/RouteProgressBar";
import { GlobalLoaderTrigger } from "@/modules/app/components/ui/GlobalLoader";
import { useGlobalLoader } from "@/stores/globalLoaderStore";
import AppLayout from "@/modules/app/layouts/AppLayout";
import { AdminLayout } from "@/modules/admin/layouts/AdminLayout";

// [开发专用] 测试页面
const TestButtonPage = React.lazy(() =>
  import("@/modules/forum/pages/TestButtonPage").then((m) => ({ default: m.ButtonTestPage })),
);

/**
 * 新标签页重定向组件
 */
function NewTabRedirect({ url }: { url: string }) {
  useEffect(() => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      // 重定向后返回上一页或首页
      window.history.back();
    }
  }, [url]);
  return <div className="p-8 text-white">正在新标签页打开...</div>;
}

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
  const { id, path, component, children, index, redirect, openInNewTab, isEnabled } = config;

  // 如果路由未启用,不渲染
  if (isEnabled === false) {
    return null;
  }

  const fullPath = index ? parentPath : path.startsWith("/") ? path : `${parentPath}/${path}`;

  // 处理重定向 - 优先级最高，即使有 children 也要重定向
  if (redirect) {
    if (openInNewTab) {
      // 新标签页打开:创建一个组件执行 window.open
      return <Route key={id} path={path} element={<NewTabRedirect url={redirect} />} />;
    } else {
      // 当前页面重定向
      return <Route key={id} path={path} element={<Navigate to={redirect} replace />} />;
    }
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
    // 过滤掉未启用的子路由
    const enabledChildren = children.filter((child) => child.isEnabled !== false);
    const mainRoute = (
      <Route key={id} path={path} element={element}>
        {enabledChildren.map((child) => renderRoute(child, fullPath))}
      </Route>
    );

    // 如果父路由也是 index，则额外渲染一个索引路由
    if (index) {
      return (
        <React.Fragment key={`${id}-group`}>
          <Route key={`${id}-index`} index element={element} />
          {mainRoute}
        </React.Fragment>
      );
    }

    return mainRoute;
  }

  if (index) {
    const indexRoute = <Route key={`${id}-index`} index element={element} />;
    // 如果指定了 path 且不为空，则同时渲染路径路由，解决如 /admin/users/list 访问不到的问题
    if (path && path !== "") {
      return (
        <React.Fragment key={`${id}-group`}>
          {indexRoute}
          <Route key={id} path={path} element={element} />
        </React.Fragment>
      );
    }
    return indexRoute;
  }

  return <Route key={id} path={path} element={element} />;
}

/**
 * 渲染带布局的路由组
 */
function renderLayoutRoutes(config: RouteConfig): React.ReactNode {
  const { id, path, layout, children, component, isEnabled, redirect, openInNewTab } = config;

  // 如果路由未启用,不渲染
  if (isEnabled === false) {
    return null;
  }

  const LayoutComponent = getLayoutWrapper(layout);

  // 过滤掉未启用的子路由
  const enabledChildren = children?.filter((child) => child.isEnabled !== false);

  // 处理重定向 - 作为索引路由，同时保留子路由
  if (redirect && !openInNewTab) {
    // 如果有布局组件，渲染带重定向索引的布局路由
    if (LayoutComponent) {
      return (
        <Route
          key={id}
          path={path}
          element={
            <AuthRoute>
              <LayoutComponent>
                <Outlet />
              </LayoutComponent>
            </AuthRoute>
          }
        >
          {/* 索引路由重定向 */}
          <Route index element={<Navigate to={redirect} replace />} />
          {/* 子路由 */}
          {enabledChildren?.map((child) => renderRoute(child, path))}

          {/* Admin 局部 404 - 捕获 layout 内的未知路径 */}
          {layout === "admin" && (
            <Route
              path="*"
              element={
                <Suspense fallback={<RouteProgressBar />}>
                  <AdminNotFoundPage />
                </Suspense>
              }
            />
          )}
        </Route>
      );
    }
  }

  // 新标签页重定向
  if (redirect && openInNewTab) {
    return <Route key={id} path={path} element={<NewTabRedirect url={redirect} />} />;
  }

  // 论坛布局:使用全局加载器触发器
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
          {enabledChildren?.map((child) => renderRoute(child, path))}

          {/* [开发专用] 按钮测试页 */}
          <Route
            path="test/buttons"
            element={
              <Suspense fallback={<RouteProgressBar />}>
                <TestButtonPage />
              </Suspense>
            }
          />

          {/* Forum 局部 404 */}
          <Route
            path="*"
            element={
              <Suspense fallback={<RouteProgressBar />}>
                <ForumNotFoundPage />
              </Suspense>
            }
          />
        </Route>
      );
    }
  }

  // App 布局或其他通用布局
  if (LayoutComponent) {
    return (
      <Route
        key={id}
        path={path}
        element={
          <AuthRoute>
            <LayoutComponent>
              <Outlet />
            </LayoutComponent>
          </AuthRoute>
        }
      >
        {enabledChildren?.map((child) => renderRoute(child, path))}
      </Route>
    );
  }

  return enabledChildren?.map((child) => renderRoute(child, path));
}

/**
 * 动态路由 Hook
 * 返回路由元素数组，供 AppRoutes 直接渲染
 */
export function useDynamicRouteElements() {
  const { routes, isLoading } = useRouteConfig();

  const routeElements = routes.map((config) => renderLayoutRoutes(config));

  return {
    routeElements,
    isLoading,
  };
}

/**
 * 动态路由组件（保留兼容性）
 * @deprecated 使用 useDynamicRouteElements hook 代替
 */
export function DynamicRoutes() {
  const { routes, isLoading } = useRouteConfig();
  const { startLoading, finishLoading } = useGlobalLoader();

  useEffect(() => {
    if (isLoading) {
      startLoading();
    } else {
      finishLoading();
    }
  }, [isLoading, startLoading, finishLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      {routes.map((config) => renderLayoutRoutes(config))}
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

function NotFoundRedirect() {
  // 显示 404 页面而非重定向
  return (
    <Suspense fallback={<RouteProgressBar />}>
      <NotFoundPage />
    </Suspense>
  );
}

// 懒加载 404 页面
import { lazy } from "react";
const NotFoundPage = lazy(() => import("@/modules/app/pages/NotFoundPage"));
const AdminNotFoundPage = lazy(() => import("@/modules/admin/pages/AdminNotFoundPage"));
const ForumNotFoundPage = lazy(() => import("@/modules/forum/pages/ForumNotFoundPage"));
