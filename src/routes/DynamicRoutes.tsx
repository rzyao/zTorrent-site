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
import BasicLayout from "@/modules/admin/layouts";

/**
 * 根据布局类型获取布局组件
 */
function getLayoutWrapper(layout: string | undefined) {
  switch (layout) {
    case "app":
      return AppLayout;
    case "admin":
      return BasicLayout;
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

  // 处理重定向
  if (redirect) {
    if (openInNewTab) {
      // 新标签页打开:创建一个组件执行 window.open
      const NewTabRedirect = () => {
        useEffect(() => {
          window.open(redirect, "_blank", "noopener,noreferrer");
          // 重定向后返回上一页或首页
          window.history.back();
        }, []);
        return <div className="p-8 text-white">正在新标签页打开...</div>;
      };
      return <Route key={id} path={path} element={<NewTabRedirect />} />;
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
    return (
      <Route key={id} path={path} element={element}>
        {enabledChildren.map((child) => renderRoute(child, fullPath))}
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
  const { id, path, layout, children, component, isEnabled } = config;

  // 如果路由未启用,不渲染
  if (isEnabled === false) {
    return null;
  }

  const LayoutComponent = getLayoutWrapper(layout);

  // 过滤掉未启用的子路由
  const enabledChildren = children?.filter((child) => child.isEnabled !== false);

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
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return <Navigate to={isLoggedIn ? "/app/home" : "/login"} replace />;
}
