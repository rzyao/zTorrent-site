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
 * @property access 当前用户的访问权限信息
 * @property loading 是否正在加载权限信息
 * @property error 加载过程中的错误信息
 * @property reload 重新加载权限信息的方法
 */
type AccessState = {
  access: UserAccess;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

// 创建 Access Context，设置默认值
const AccessContext = createContext<AccessState>({
  access: { roles: [], permissions: [], username: "", avatar: null },
  loading: false,
  error: null,
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

  // 初始化加载状态：如果本地有 accessToken，则初始 loading 为 true，避免未加载完时的页面闪烁或错误跳转
  const [loading, setLoading] = useState(() => !!localStorage.getItem("accessToken"));

  // 错误状态管理
  const [error, setError] = useState<string | null>(null);

  /**
   * 加载用户信息的异步函数
   * 同时获取用户 Profile 和 聚合权限信息
   */
  const load = async () => {
    const token = localStorage.getItem("accessToken");
    // 如果没有 token，清空状态并结束加载
    if (!token) {
      setAccess({ roles: [], permissions: [], username: "", avatar: null });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 懒加载 Service 以避免循环依赖或初始包体积过大
    const [AuthService, PermissionsService] = await Promise.all([
      getAuthService(),
      getPermissionsService(),
    ]);

    // 并行请求：获取用户信息和聚合权限
    Promise.allSettled([
      AuthService.authControllerProfilePost({}) as Promise<any>,
      PermissionsService.permissionsControllerAggregateOfUser() as Promise<any>,
    ])
      .then((results) => {
        const profileRes = results[0];
        const aggregateRes = results[1];

        let roles: string[] = [];
        let username: string = "";
        let permissionsFromProfile: string[] = [];
        let permissionsFromAggregate: string[] = [];
        let avatar: string | null = null;

        // 处理 Profile 请求结果（包含基础信息和角色）
        if (profileRes.status === "fulfilled") {
          const resp: any = profileRes.value;
          // 兼容后端不同的响应结构 (code/data 包装)
          const body = resp?.code !== undefined ? resp : resp?.data;
          const data = body?.data ?? body;
          roles = Array.isArray(data?.roles) ? data.roles : [];
          permissionsFromProfile = Array.isArray(data?.permissions) ? data.permissions : [];
          username = String(data?.username ?? data?.user?.username ?? "");
          const rawAvatar = (data?.avatar ?? data?.user?.avatar ?? null) as any;
          // 确保头像为非空字符串
          avatar = typeof rawAvatar === "string" && rawAvatar.trim().length > 0 ? rawAvatar : null;
        } else {
          setError((profileRes as any)?.reason?.message || "获取用户信息失败");
        }

        // 处理聚合权限请求结果（包含细粒度权限）
        if (aggregateRes.status === "fulfilled") {
          const resp: any = aggregateRes.value;
          const body = resp?.code !== undefined ? resp : resp?.data;
          const data = body?.data ?? body;
          permissionsFromAggregate = Array.isArray(data?.permissions) ? data.permissions : [];
        } else {
          // 若聚合失败，后续保底逻辑会使用 profile 中的 permissions
        }

        // 优先使用聚合接口返回的权限，若没有则回退到 Profile 接口的权限
        const permissions =
          permissionsFromAggregate.length > 0 ? permissionsFromAggregate : permissionsFromProfile;

        // 更新全局 Access 状态
        setAccess({ roles, permissions, username, avatar });
      })
      .catch((e: any) => setError(e?.message || "获取权限数据失败"))
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
    <AccessContext.Provider value={{ access, loading, error, reload: load }}>
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
