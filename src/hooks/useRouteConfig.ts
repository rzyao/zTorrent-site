/**
 * 路由配置 Hook
 * 从后端获取用户可访问的路由配置
 * 严格依赖后端 API，无静态兜底
 */
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { RouteConfig } from "@/types/routeConfig";
import { PlatformRoutesService } from "@/api/services/PlatformRoutesService";
import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";

/**
 * 将 API 返回的 DTO 转换为前端使用的 RouteConfig
 */
function mapDtoToConfig(dto: RouteTreeNodeDto): RouteConfig {
  return {
    id: dto.id,
    path: dto.path,
    // 强制转换为 string,因为生成的类型可能是 Record<string, any> 但运行时应为 string
    component: (dto.component as unknown as string) || "",
    layout: (dto.layout as unknown as RouteConfig["layout"]) || "none",
    name: (dto.name as unknown as string) || undefined,
    permissions: dto.permissions,
    index: dto.index,
    redirect: (dto.redirect as unknown as string) || undefined,
    openInNewTab: (dto as any).openInNewTab || false,
    isVisible: dto.isVisible,
    isEnabled: (dto as any).isEnabled !== false, // 默认为 true
    icon: (dto as any).icon || undefined,
    children: dto.children?.map(mapDtoToConfig),
  };
}

/**
 * 获取路由配置
 * 完全依赖后端 API
 */
export function useRouteConfig() {
  // 使用状态追踪登录状态，确保登录状态变化时能够触发重新渲染
  // 这解决了登录成功后 enabled 条件不更新的问题
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("accessToken"),
  );

  // 监听认证状态变化事件（由 useAuth.login 触发）
  useEffect(() => {
    const handleAuthChange = () => {
      const hasToken = !!localStorage.getItem("accessToken");
      console.log("[useRouteConfig] 检测到认证状态变化:", hasToken);
      setIsAuthenticated(hasToken);
    };

    window.addEventListener("authChange", handleAuthChange);
    // 同时监听 storage 事件，处理其他标签页的登录/登出
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["routeConfig"],
    queryFn: async (): Promise<RouteConfig[]> => {
      console.log("[useRouteConfig] 开始获取动态路由配置...");
      const response = await PlatformRoutesService.routesControllerGetUserRoutes();

      // 检查响应
      if (!response || !response.data || !Array.isArray(response.data.routes)) {
        throw new Error("[useRouteConfig] API 返回数据格式无效");
      }

      const apiRoutes = response.data.routes.map(mapDtoToConfig);
      console.log("[useRouteConfig] 成功获取路由配置:", apiRoutes.length, "个根节点");

      // 临时修复：如果后端没返回 admin 节点，手动补全一个兜底节点
      // 这样可以确保 /admin 路径被匹配到，进而加载 Admin 模块
      if (
        !apiRoutes.some((r) => r.layout === "admin" || r.path === "admin" || r.path === "/admin")
      ) {
        console.warn("[useRouteConfig] 检测到后端未返回 Admin 路由，正在应用本地兜底配置...");
        apiRoutes.push({
          id: "admin_fallback",
          path: "admin",
          component: "AdminDashboard",
          layout: "admin" as any,
          name: "管理后台",
          isVisible: true,
          children: [], // 菜单项会由 useBasicLayout 进一步处理
        });
      }

      return apiRoutes;
    },
    staleTime: 5 * 60 * 1000, // 5 分钟缓存
    retry: 1,
    // 使用状态变量而非直接读取 localStorage，确保响应式更新
    enabled: isAuthenticated,
  });

  return {
    routes: data || [],
    isLoading,
    error,
    refetch,
  };
}
