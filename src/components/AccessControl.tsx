import { type ReactNode } from "react";
import { useAccess } from "../context/AccessContext";
import { canAccess, type AccessRule } from "../utils/access";

interface AccessControlProps extends AccessRule {
  /**
   * 拥有权限时显示的内容
   */
  children: ReactNode;
  /**
   * 无权限时显示的内容（默认为 null，即不渲染）
   * 可以传入 disabled 的按钮或占位符
   */
  fallback?: ReactNode;
  /**
   * 仅用于权限采集脚本的显示名称，不参与运行时逻辑
   */
  name?: string;
}

/**
 * 权限控制组件 (AccessControl)
 *
 * 基于全局 AccessContext 和 access 工具函数，
 * 根据当前用户的角色和权限，控制子组件的显隐。
 *
 * @example
 * // 仅管理员可见
 * <AccessControl requiredRoles={['admin']}>
 *   <Button>删除</Button>
 * </AccessControl>
 *
 * @example
 * // 需要特定权限，否则显示禁用按钮
 * <AccessControl
 *   requiredPermissions={['user.delete']}
 *   fallback={<Button disabled>删除</Button>}
 * >
 *   <Button>删除</Button>
 * </AccessControl>
 */
export function AccessControl({
  children,
  fallback = null,
  ...rule
}: AccessControlProps) {
  const { access } = useAccess();

  // 使用通用工具函数判断权限
  if (canAccess(access, rule)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
