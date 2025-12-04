// 通用权限判断工具：用于在导航、按钮等处进行显示/隐藏控制
// 该逻辑与 PermissionRoute 的实现保持一致，支持 matchAll 与 combine 两种策略
export type AccessLike = {
  username?: string;
  roles: string[];
  permissions: string[];
};

export type AccessRule = {
  requiredPermissions?: string[];
  requiredRoles?: string[];
  matchAll?: boolean; // 组内是否需要全部匹配，默认 true
  combine?: 'AND' | 'OR'; // 角色组与权限组之间的关系，默认 AND
};

export function canAccess(
  access: AccessLike | undefined,
  rule: AccessRule = {}
): boolean {
  if (!access) return false;
  const {
    requiredPermissions,
    requiredRoles,
    matchAll = true,
    combine = 'AND',
  } = rule;

  // 超级放行：管理员用户名直接通过
  if (access.username === 'admin') return true;

  const roles = access.roles || [];
  const perms = access.permissions || [];

  const rolesSatisfied = (() => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return matchAll
      ? requiredRoles.every(r => roles.includes(r))
      : requiredRoles.some(r => roles.includes(r));
  })();

  const permsSatisfied = (() => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return matchAll
      ? requiredPermissions.every(p => perms.includes(p))
      : requiredPermissions.some(p => perms.includes(p));
  })();

  if (combine === 'OR') {
    const rolesHasAny = requiredRoles && requiredRoles.length > 0
      ? (matchAll
          ? requiredRoles.every(r => roles.includes(r))
          : requiredRoles.some(r => roles.includes(r)))
      : false;
    const permsHasAny = requiredPermissions && requiredPermissions.length > 0
      ? (matchAll
          ? requiredPermissions.every(p => perms.includes(p))
          : requiredPermissions.some(p => perms.includes(p)))
      : false;
    return rolesHasAny || permsHasAny;
  }

  return rolesSatisfied && permsSatisfied;
}

