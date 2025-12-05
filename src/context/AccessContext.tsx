import { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, PermissionsService } from '../api';

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
    Promise.allSettled([
      AuthService.authControllerProfile() as Promise<any>,
      PermissionsService.permissionsControllerAggregateOfUser() as Promise<any>,
    ])
      .then((results) => {
        const profileRes = results[0];
        const aggregateRes = results[1];

        let roles: string[] = [];
        let username: string = '';
        let permissionsFromProfile: string[] = [];
        let permissionsFromAggregate: string[] = [];

        if (profileRes.status === 'fulfilled') {
          const resp: any = profileRes.value;
          const body = resp?.code !== undefined ? resp : resp?.data;
          const data = body?.data ?? body;
          roles = Array.isArray(data?.roles) ? data.roles : [];
          permissionsFromProfile = Array.isArray(data?.permissions) ? data.permissions : [];
          username = String(data?.username ?? data?.user?.username ?? '');
        } else {
          setError((profileRes as any)?.reason?.message || '获取用户信息失败');
        }

        if (aggregateRes.status === 'fulfilled') {
          const resp: any = aggregateRes.value;
          const body = resp?.code !== undefined ? resp : resp?.data;
          const data = body?.data ?? body;
          permissionsFromAggregate = Array.isArray(data?.permissions) ? data.permissions : [];
        } else {
          // 若聚合失败，保底使用 profile 中的 permissions
        }

        const permissions = permissionsFromAggregate.length > 0 ? permissionsFromAggregate : permissionsFromProfile;
        setAccess({ roles, permissions, username });
      })
      .catch((e: any) => setError(e?.message || '获取权限数据失败'))
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
