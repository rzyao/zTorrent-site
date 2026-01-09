/**
 * 路由守卫组件
 * 提供 AuthRoute 和 PermissionRoute 供各路由模块使用
 */
import { Navigate } from "react-router-dom";
import { useAccess } from "@/context/AccessContext";

/**
 * 基础登录态守卫：仅判断是否已登录
 */
export function AuthRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/**
 * 基于后端权限字符的高级路由守卫
 */
export function PermissionRoute({
  children,
  requiredPermissions,
  requiredRoles,
  matchAll = true,
  combine = "AND",
  name,
}: {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  matchAll?: boolean;
  combine?: "AND" | "OR";
  name?: string;
}) {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const { access, loading } = useAccess();
  if (loading) return <div style={{ padding: 24, color: "#ccc" }}>加载中…</div>;

  // 检查角色与权限是否满足要求
  const hasRequired = () => {
    const hasRoles =
      !requiredRoles || requiredRoles.length === 0
        ? true
        : matchAll
          ? requiredRoles.every((r) => access.roles.includes(r))
          : requiredRoles.some((r) => access.roles.includes(r));

    const hasPerms =
      !requiredPermissions || requiredPermissions.length === 0
        ? true
        : matchAll
          ? requiredPermissions.every((p) => access.permissions.includes(p))
          : requiredPermissions.some((p) => access.permissions.includes(p));

    return hasRoles && hasPerms;
  };

  const hasAnyRequired = () => {
    if (combine === "OR") {
      const hasRoles =
        !requiredRoles || requiredRoles.length === 0
          ? false
          : matchAll
            ? requiredRoles.every((r) => access.roles.includes(r))
            : requiredRoles.some((r) => access.roles.includes(r));
      const hasPerms =
        !requiredPermissions || requiredPermissions.length === 0
          ? false
          : matchAll
            ? requiredPermissions.every((p) => access.permissions.includes(p))
            : requiredPermissions.some((p) => access.permissions.includes(p));
      return hasRoles || hasPerms;
    }
    return hasRequired();
  };

  console.log("[PermissionRoute] 权限检查", {
    name,
    username: access.username,
    isAdmin: access.username === "admin",
    requiredPermissions,
    requiredRoles,
    userPermissions: access.permissions,
    userRoles: access.roles,
  });

  // admin 用户直接放行
  if (access.username === "admin") {
    console.log("[PermissionRoute] admin 用户直接放行");
    return <>{children}</>;
  }

  if (!hasAnyRequired()) {
    console.log("[PermissionRoute] 权限不足，重定向到首页");
    return <Navigate to="/home" replace />;
  }

  console.log("[PermissionRoute] 权限验证通过");
  return <>{children}</>;
}
