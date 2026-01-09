import React from "react";
import { useAccess } from "@/context/AccessContext";
import { canAccess, AccessRule } from "@/utils/access";

interface AccessControlProps extends AccessRule {
  children: React.ReactNode;
  /** 可选的组件名称，用于调试或标识 */
  name?: string;
  /** fallback 元素，当权限不满足时显示 */
  fallback?: React.ReactNode;
}

/**
 * 权限控制组件
 * 根据用户权限和角色决定是否渲染子组件
 */
export function AccessControl({
  requiredPermissions,
  requiredRoles,
  matchAll,
  combine,
  children,
  fallback = null,
}: AccessControlProps) {
  const { access, loading } = useAccess();

  // 如果还在加载初始权限，不显示内容（或显示 loading）
  if (loading) return null;

  const hasAccess = canAccess(access, {
    requiredPermissions,
    requiredRoles,
    matchAll,
    combine,
  });

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
