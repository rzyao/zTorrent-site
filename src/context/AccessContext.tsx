import { createContext, useContext, useEffect, useState } from 'react';
import { ALL_PERMISSION_CODES } from '../permissions/permissions.gen';
import { AuthService } from '../api';

export type UserAccess = {
  roles: string[];
  permissions: string[];
  username?: string;
};

type AccessState = {
  access: UserAccess;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

const AccessContext = createContext<AccessState>({
  access: { roles: [], permissions: [], username: '' },
  loading: false,
  error: null,
  reload: () => {},
});

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [access, setAccess] = useState<UserAccess>({ roles: [], permissions: [], username: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setAccess({ roles: [], permissions: [], username: '' });
      return;
    }
    setLoading(true);
    setError(null);
    AuthService.authControllerProfile()
      .then((resp: any) => {
        const body = resp?.code !== undefined ? resp : resp?.data;
        const data = body?.data ?? body;
        const roles: string[] = Array.isArray(data?.roles) ? data.roles : [];
        const permissions: string[] = Array.isArray(data?.permissions) ? data.permissions : [];
        const username: string = String(data?.username ?? data?.user?.username ?? '');
        // 开发环境下对后端返回的权限码进行唯一信源校验，提前暴露错配
        if (import.meta.env.MODE !== 'production') {
          const unknown = permissions.filter((p) => !ALL_PERMISSION_CODES.includes(p as any))
          if (unknown.length) {
            console.warn('[permissions] 未在 permissions.yaml 中定义的权限码: ', unknown)
          }
        }
        setAccess({ roles, permissions, username });
      })
      .catch((e: any) => setError(e?.message || '获取用户权限失败'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const onAuthChange = () => load();
    window.addEventListener('authChange', onAuthChange);
    return () => window.removeEventListener('authChange', onAuthChange);
  }, []);

  return (
    <AccessContext.Provider value={{ access, loading, error, reload: load }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  return useContext(AccessContext);
}
