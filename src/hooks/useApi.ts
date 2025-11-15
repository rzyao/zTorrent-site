import { useState, useCallback } from 'react';
import { client, authControllerLogin, authControllerRegister, authControllerRequestEmailCode, torrentsControllerList, torrentsControllerGet } from '../api';

const envBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL;
if (envBaseUrl) {
  (client as any).instance.defaults.baseURL = envBaseUrl;
}

// 认证Hook
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('accessToken')));

  const login = useCallback(async (username: string, password: string, autoLogout: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authControllerLogin({ body: { username, password } });
      console.log(response);

      const body = (response as any)?.code !== undefined ? response : (response as any)?.data;
      const ok = body?.code === 1000;
      if (!ok) {
        throw new Error(body?.message || '登录失败');
      }
      const token = body?.data?.accessToken;
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      setIsAuthenticated(true);

      // 触发认证事件，通知路由守卫更新状态
      window.dispatchEvent(new Event('authChange'));

      return response;
    } catch (err: any) {
      setError(err.message || '登录失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams(window.location.search);
      const inviteCodeParam = params.get('inviteCode') || '';
      const type = inviteCodeParam ? 'invite' : 'open';
      const response = await authControllerRegister({ body: { email, username, password, type, inviteCode: inviteCodeParam } });
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data;
      const ok = body?.code === 1000;
      if (!ok) {
        throw new Error(body?.message || '注册失败');
      }
      const token = body?.data?.accessToken;
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      setIsAuthenticated(true);
      return response;
    } catch (err: any) {
      setError(err.message || '注册失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendVerificationCode = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authControllerRequestEmailCode({ body: { email } });
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data;
      return body?.data ?? body;
    } catch (err: any) {
      setError(err.message || '发送验证码失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
  }, []);

  return {
    login,
    register,
    sendVerificationCode,
    logout,
    isLoading,
    error,
    isAuthenticated
  };
}

// 种子Hook
export function useTorrents() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [torrents, setTorrents] = useState<any | null>(null);

  const fetchTorrents = useCallback(async (category?: string, page: number = 1, limit: number = 20) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await torrentsControllerList({ body: { category, page, pageSize: limit } });
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data;
      setTorrents(body?.data ?? body);
      return body?.data ?? body;
    } catch (err: any) {
      setError(err.message || '获取种子列表失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTorrentById = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await torrentsControllerGet({ body: { id: String(id) } });
      const body = (response as any)?.code !== undefined ? response : (response as any)?.data;
      return body?.data ?? body;
    } catch (err: any) {
      setError(err.message || '获取种子详情失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchTorrents,
    getTorrentById,
    torrents,
    isLoading,
    error
  };
}
