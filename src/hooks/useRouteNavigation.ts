/**
 * 从路由配置中提取导航项
 * 统一使用路由 API 作为导航数据源
 */
import { useMemo } from "react";
import { useRouteConfig } from "./useRouteConfig";
import { RouteConfig } from "@/types/routeConfig";
import { NavigationItem } from "@/types/navigation";
import { useAccess } from "@/context/AccessContext";

/**
 * 将路由配置转换为导航项
 * @param routes 路由配置数组
 * @param parentPath 父路径（用于拼接完整路径）
 * @param platform 平台类型
 */
function routesToNavItems(
  routes: RouteConfig[],
  parentPath: string = "",
  platform: "desktop" | "mobile" = "desktop",
): NavigationItem[] {
  return routes
    .filter((route) => route.isVisible !== false) // 只显示可见路由
    .map((route) => {
      // 构建完整路径
      const fullPath = route.path.startsWith("/")
        ? route.path
        : route.path === ""
          ? parentPath
          : parentPath
            ? `${parentPath}/${route.path}`
            : `/${route.path}`;

      const navItem: NavigationItem = {
        id: route.id,
        label: route.name || route.path || "未命名",
        path: fullPath,
        platform,
        sortOrder: 0, // 可以从后端扩展
        isVisible: route.isVisible !== false,
        permissions: route.permissions,
        children:
          route.children && route.children.length > 0
            ? routesToNavItems(route.children, fullPath, platform)
            : undefined,
      };

      return navItem;
    });
}

/**
 * 权限过滤：递归过滤无权限的导航项
 */
function filterByPermissions(
  items: NavigationItem[],
  userPermissions: string[],
  username: string,
): NavigationItem[] {
  // admin 用户直接放行所有
  const isSuperAdmin = username === "admin";

  return items
    .filter((item) => {
      // 检查权限
      if (!item.permissions || item.permissions.length === 0) return true;
      if (isSuperAdmin) return true;
      return item.permissions.every((p) => userPermissions.includes(p));
    })
    .map((item) => ({
      ...item,
      children: item.children
        ? filterByPermissions(item.children, userPermissions, username)
        : undefined,
    }))
    .filter((item) => {
      // 如果有子项但全部被过滤掉，隐藏父项
      if (item.children && item.children.length === 0) {
        return false;
      }
      return true;
    });
}

/**
 * 从路由配置获取导航数据的 Hook
 * 替代原有的 useNavigation hook
 */
export function useRouteNavigation() {
  const { routes, isLoading, error } = useRouteConfig();
  const { access, loading: accessLoading } = useAccess();

  const navigation = useMemo(() => {
    if (isLoading || !routes.length) {
      return { desktop: [], mobile: [] };
    }

    // 找到 app 模块的路由
    const appRoute = routes.find((r) => r.layout === "app" || r.path === "app");
    const appChildren = appRoute?.children || [];

    // 转换为导航项（使用 /app 前缀）
    const parentPath = appRoute?.path.startsWith("/")
      ? appRoute.path
      : `/${appRoute?.path || "app"}`;
    const desktopItems = routesToNavItems(appChildren, parentPath, "desktop");
    const mobileItems = routesToNavItems(appChildren, parentPath, "mobile");

    // 权限过滤
    const userPermissions = access?.permissions || [];
    const username = access?.username || "";

    return {
      desktop: filterByPermissions(desktopItems, userPermissions, username),
      mobile: filterByPermissions(mobileItems, userPermissions, username),
    };
  }, [routes, isLoading, access]);

  return {
    desktop: navigation.desktop,
    mobile: navigation.mobile,
    isLoading: isLoading || accessLoading,
    error,
  };
}
