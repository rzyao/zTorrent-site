import { useState, useCallback } from 'react';
import { AuthService, TorrentService } from '../api/services';
import type { PostApiAuthLoginResponses, PostApiAuthRegisterResponses, GetApiTorrentsResponses, GetApiTorrentsByIdResponses } from '../api/sdk.gen';

// 认证Hook
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

  const login = useCallback(async (username: string, password: string, autoLogout: boolean = false) => {
    setIsLoading(true);
    setError(null);
    console.log('useAuth login called with:', username, password, 'autoLogout:', autoLogout);
    
    try {
      const response = await AuthService.login(username, password, autoLogout);
      console.log('AuthService.login response:', response);
      setIsAuthenticated(true);
      
      // 触发认证事件，通知路由守卫更新状态
      window.dispatchEvent(new Event('authChange'));
      
      return response;
    } catch (err: any) {
      console.log('AuthService.login error:', err);
      setError(err.message || '登录失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, username: string, password: string, verificationCode: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.register(email, username, password, verificationCode);
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
      const response = await AuthService.sendVerificationCode(email);
      return response;
    } catch (err: any) {
      setError(err.message || '发送验证码失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
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
  const [torrents, setTorrents] = useState<GetApiTorrentsResponses | null>(null);

  const fetchTorrents = useCallback(async (category?: string, page: number = 1, limit: number = 20) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await TorrentService.getTorrents(category, page, limit);
      setTorrents(response);
      return response;
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
      const response = await TorrentService.getTorrentById(id);
      return response;
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