# zTorrent 前端路由守卫设计说明

## 背景与目标
- 统一解释项目中的路由守卫方案，覆盖登录态检查与基于后端“角色/权限字符”的访问控制。
- 指明关键代码位置、数据来源、使用方式与扩展建议，便于维护与迭代。

## 总览
- 路由容器：`src/App.tsx:24–27` 使用 `BrowserRouter` 承载全局路由。
- 路由表与守卫均在：`src/routes/AppRoutes.tsx`。
  - 基础登录态守卫：`src/routes/AppRoutes.tsx:50–54`。
  - 用户权限拉取 Hook：`src/routes/AppRoutes.tsx:70–128`。
  - 基于权限字符的守卫：`src/routes/AppRoutes.tsx:143–179`。
- 用户权限数据来源：`src/api/services/AuthService.ts:274–289` 的 `authControllerProfile()`。
- 登录事件联动：`src/hooks/useApi.ts:31–33` 派发 `authChange`。

## 基础守卫：AuthRoute（登录态）
- 功能：仅判断是否已登录（`localStorage` 存在 `accessToken`）。
- 位置：`src/routes/AppRoutes.tsx:50–54`。
- 代码要点：
```tsx
function AuthRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```
- 使用：将需要登录才能访问的页面用 `AuthRoute` 包裹即可。

## 高级守卫：PermissionRoute（角色/权限字符）
- 目标：基于后端返回的 `roles` 与 `permissions` 控制访问。
- 关键组成：
  - `useUserAccess`（拉取/缓存用户访问集）：`src/routes/AppRoutes.tsx:70–128`。
  - `PermissionRoute`（匹配策略与守卫）：`src/routes/AppRoutes.tsx:143–179`。
- 数据来源：`AuthService.authControllerProfile()`（`GET /auth/profile`），见 `src/api/services/AuthService.ts:274–289`。
- 匹配策略：
  - 支持 `requiredRoles` 与 `requiredPermissions` 两类约束；可单独或组合使用。
  - `matchAll=true`（默认）：必须全部满足；设为 `false` 时只需满足任一。
  - 未满足时重定向到 `/home`（可按需调整为 403 页面）。
- 代码要点：
```tsx
function PermissionRoute({
  children,
  requiredPermissions,
  requiredRoles,
  matchAll = true,
}: {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  matchAll?: boolean;
}) {
  const isLoggedIn = !!localStorage.getItem('accessToken');
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const { access, loading } = useUserAccess();
  if (loading) return <></>;

  const hasRequired = () => {
    const hasRoles = !requiredRoles || requiredRoles.length === 0
      ? true
      : matchAll
        ? requiredRoles.every(r => access.roles.includes(r))
        : requiredRoles.some(r => access.roles.includes(r));

    const hasPerms = !requiredPermissions || requiredPermissions.length === 0
      ? true
      : matchAll
        ? requiredPermissions.every(p => access.permissions.includes(p))
        : requiredPermissions.some(p => access.permissions.includes(p));

    return hasRoles && hasPerms;
  };

  if (!hasRequired()) return <Navigate to="/home" replace />;
  return <>{children}</>;
}
```

## 权限数据拉取：useUserAccess
- 位置：`src/routes/AppRoutes.tsx:70–128`。
- 行为：
  - 登录后拉取一次用户访问集（`roles`/`permissions`）并缓存于组件状态。
  - 兼容后端响应包裹（可能含 `code/message/data`）。
  - 监听 `authChange` 事件（登录/登出时由 `useAuth` 派发），自动刷新访问集。
- 触发源：`src/hooks/useApi.ts:31–33` 使用 `window.dispatchEvent(new Event('authChange'))`。

## 使用示例
- 上传页按“页面权限键”控制：
  - 修改 `src/routes/AppRoutes.tsx:252–266` 的 `element`，将 `AuthRoute` 替换为：
```tsx
<PermissionRoute requiredPermissions={["page:upload"]}>
  <AppLayout>
    <UploadTorrentPage />
  </AppLayout>
</PermissionRoute>
```
- 仅允许 `admin` 角色访问：
```tsx
<PermissionRoute requiredRoles={["admin"]}>
  <AppLayout>
    <AdminOnlyPage />
  </AppLayout>
</PermissionRoute>
```
- 满足任意权限键即可：
```tsx
<PermissionRoute requiredPermissions={["page:a","page:b"]} matchAll={false}>
  <AppLayout>
    <SomePage />
  </AppLayout>
</PermissionRoute>
```

## 行为细节
- 未登录：无论 `AuthRoute` 还是 `PermissionRoute`，都会跳转到 `/login`。
- 加载中：`PermissionRoute` 在权限数据加载期间返回空元素（可替换为全局加载组件）。
- 未授权：默认跳转到 `/home`，可自行改为 403 页面或提示。

## 最佳实践
- 权限键约定：建议为“范围:类型”或“模块:动作”风格，例如 `page:upload`、`button:torrent:delete`，与后端枚举保持一致（参考 `src/api/models/CreatePermissionDto.ts:48–59`）。
- 渐进迁移：现有基于登录的受保护路由先保留 `AuthRoute`，在关键页面逐步替换为 `PermissionRoute`，降低风险。
- 失败兜底：对 `authControllerProfile` 失败时记录错误并视为无权限，避免误放行。
- 性能与缓存：`useUserAccess` 已做基础缓存；如需更强缓存与全局共享，可迁移到 store（例如 Zustand/Redux），但请保持响应 `authChange`。

## 常见问题排查
- 登录后仍被重定向到 `/login`：检查 `localStorage.accessToken` 是否存在，以及 `OpenAPI.TOKEN` 是否正确读取（见 `src/layouts/AppLayout.tsx:4–6`）。
- 已登录但权限不生效：确认 `authControllerProfile()` 返回的 `roles/permissions` 是否含预期值（`src/api/services/AuthService.ts:274–289`）。
- 权限更新后不生效：确认服务端已生效；前端可触发一次 `authChange` 或重新登录以刷新访问集。

## 变更记录（与代码对应）
- 新增 `PermissionRoute` 与 `useUserAccess`：`src/routes/AppRoutes.tsx:70–128, 143–179`。
- 保留并记录 `AuthRoute`：`src/routes/AppRoutes.tsx:50–54`。
- 示例注释位置：`/upload` 路由 `src/routes/AppRoutes.tsx:252–266`，可作为权限化替换参考。

