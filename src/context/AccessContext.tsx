import { createContext, useContext, useEffect, useState } from "react";
import { getAuthService, getPermissionsService } from "../api/lazy";

/**
 * 用户访问权限类型定义
 * @property roles 用户角色列表
 * @property permissions 用户权限列表
 * @property username 用户名
 * @property avatar 用户头像地址
 */
export type UserAccess = {
  roles: string[];
  permissions: string[];
  username?: string;
  avatar?: string | null;
};

/**
 * Access Context 状态定义
 * @property access 当前用户的访问权限信息（服务端校验后）
 * @property loading 是否正在加载权限信息
 * @property error 加载过程中的错误信息
 * @property isAuthenticated 是否已通过服务端校验（权威，不再依赖前端 localStorage）
 * @property reload 重新加载权限信息的方法
 */
type AccessState = {
  access: UserAccess;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  reload: () => void;
};

// 创建 Access Context，设置默认值
const AccessContext = createContext<AccessState>({
  access: { roles: [], permissions: [], username: "", avatar: null },
  loading: false,
  error: null,
  isAuthenticated: false,
  reload: () => {},
});

/**
 * AccessProvider 组件
 * 用于全局管理用户的认证状态、角色和权限信息
 * @param children 子组件
 */
export function AccessProvider({ children }: { children: React.ReactNode }) {
  // 管理用户权限状态
  const [access, setAccess] = useState<UserAccess>({
    roles: [],
    permissions: [],
    username: "",
    avatar: null,
  });

  // 首屏即尝试拉取（凭证由 HttpOnly Cookie 携带），loading 为 true 直到服务端给出明确结论，
  // 避免未登录用户被短暂误判为已登录。真正的鉴权仍由后端对每个接口强制。
  const [loading, setLoading] = useState(true);

  // 错误状态管理
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * 加载用户信息的异步函数
   * 同时获取用户 Profile 和 聚合权限信息（均由服务端校验）
   */
  const load = async () => {
    setLoading(true);
    setError(null);

    // 懒加载 Service 以避免循环依赖或初始包体积过大
    const [AuthService, PermissionsService] = await Promise.all([
      getAuthService(),
      getPermissionsService(),
    ]);

    // 并行请求：获取用户信息和聚合权限
    Promise.allSettled([
      AuthService.authLoginControllerProfilePost({}) as Promise<any>,
      PermissionsService.permissionsAssignmentControllerAggregateOfUser() as Promise<any>,
    ])
      .then((results) => {
        const profileRes = results[0];
        const aggregateRes = results[1];

        // Profile 失败（401 / 网络错误）-> 未登录或会话失效
        if (profileRes.status !== "fulfilled") {
          setAccess({ roles: [], permissions: [], username: "", avatar: null });
          setIsAuthenticated(false);
          setError((profileRes as any)?.reason?.message || "获取用户信息失败");
          return;
        }

        const resp: any = profileRes.value;
        // 兼容后端不同的响应结构 (code/data 包装)
        const body = resp?.code !== undefined ? resp : resp?.data;
        const data = body?.data ?? body;
        const roles = Array.isArray(data?.roles) ? data.roles : [];
        const permissionsFromProfile = Array.isArray(data?.permissions) ? data.permissions : [];
        const username = String(data?.username ?? data?.user?.username ?? "");
        const rawAvatar = (data?.avatar ?? data?.user?.avatar ?? null) as any;
        const avatar =
          typeof rawAvatar === "string" && rawAvatar.trim().length > 0 ? rawAvatar : null;

        let permissionsFromAggregate: string[] = [];
        if (aggregateRes.status === "fulfilled") {
          const aggResp: any = aggregateRes.value;
          const aggBody = aggResp?.code !== undefined ? aggResp : aggResp?.data;
          const aggData = aggBody?.data ?? aggBody;
          permissionsFromAggregate = Array.isArray(aggData?.permissions)
            ? aggData.permissions
            : [];
        }

        // 优先使用聚合接口返回的权限，若没有则回退到 Profile 接口的权限
        const permissions =
          permissionsFromAggregate.length > 0 ? permissionsFromAggregate : permissionsFromProfile;

        setAccess({ roles, permissions, username, avatar });
        setIsAuthenticated(true);
      })
      .catch((e: any) => {
        setAccess({ roles: [], permissions: [], username: "", avatar: null });
        setIsAuthenticated(false);
        setError(e?.message || "获取权限数据失败");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // 组件挂载时执行加载
    load();

    // 监听自定义事件 'authChange'，以便在登录/登出时自动重新加载状态
    const onAuthChange = () => load();
    window.addEventListener("authChange", onAuthChange);
    return () => window.removeEventListener("authChange", onAuthChange);
  }, []);

  return (
    <AccessContext.Provider
      value={{ access, loading, error, isAuthenticated, reload: load }}
    >
      {children}
    </AccessContext.Provider>
  );
}

/**
 * useAccess Hook
 * 可以在任何组件中方便地获取用户权限信息
 */
export function useAccess() {
  return useContext(AccessContext);
}
