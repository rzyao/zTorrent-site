import { createContext, useContext, useEffect, useState } from 'react';
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

