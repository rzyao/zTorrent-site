import axios from 'axios';
import { OpenAPI } from './core/OpenAPI';
import { toast } from 'sonner';

const getToken = () => localStorage.getItem('accessToken') || undefined;
const logout = () => {
  localStorage.removeItem('accessToken');
  try { window.dispatchEvent(new Event('authChange')); } catch { }
  setTimeout(() => { try { window.location.replace('/login'); } catch { } }, 0);
};
const notify = (msg: string) => { try { toast.error(msg); } catch { } };

OpenAPI.TOKEN = async () => getToken();
const envBase = (import.meta as any).env?.VITE_API_BASE_URL;
OpenAPI.BASE = envBase || 'http://localhost:8890';
const apiPrefixEnv = (import.meta as any).env?.VITE_API_PREFIX;
const API_PREFIX = typeof apiPrefixEnv === 'string' ? apiPrefixEnv : '';

const instance = axios.create({ baseURL: OpenAPI.BASE });

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      const h = (config.headers ?? {}) as any;
      if (typeof h.set === 'function') h.set('Authorization', `Bearer ${token}`);
      else h.Authorization = `Bearer ${token}`;
      config.headers = h;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.code === 'ERR_CANCELED') return Promise.reject(error);
    const status = error?.response?.status;
    const data = error?.response?.data;
    const code = data?.code;
    const message = data?.message;
    if (!status) {
      notify('网络错误');
      return Promise.reject(error);
    }
    if (status === 401) {
      notify(message || '登录已失效，请重新登录');
      logout();
    } else if (status === 403) {
      if (code === 9403) {
        notify('您已被禁止登录');
        logout();
      } else {
        notify(message || '禁止访问');
      }
    } else if (status === 404) {
      notify(message || '资源不存在');
    } else if (status === 429) {
      notify(message || '请求过于频繁');
    } else if (status >= 500) {
      notify(message || '服务器错误');
    } else if (message) {
      notify(message);
    }
    return Promise.reject(error);
  }
);

export const client = { instance };


const wrapOk = (raw: any) => ({ data: raw });
const wrapCodeSuccess = (raw: any) => ({ data: { code: 1000, data: raw } });

export const authControllerLogin = async (p: { body: { username: string; password: string } }) => {
  const res = await instance.post(`${API_PREFIX}/auth/login`, p.body);
  const raw = res?.data;
  const token = raw?.token || raw?.data?.accessToken;
  if (token) return { data: { code: 1000, data: { accessToken: token, user: raw?.user } } };
  return wrapOk(raw);
};

export const authControllerRegister = async (p: { body: any }) => {
  const res = await instance.post(`${API_PREFIX}/auth/register`, p.body);
  const raw = res?.data;
  const token = raw?.token || raw?.data?.accessToken;
  if (token) return { data: { code: 1000, data: { accessToken: token, user: raw?.user } } };
  return wrapOk(raw);
};

export const authControllerRequestEmailCode = async (p: { body: { email: string } }) => {
  const res = await instance.post(`${API_PREFIX}/auth/request-email-code`, p.body);
  return wrapOk(res?.data);
};

export const authControllerRegistrationEnabled = async () => {
  try {
    const res = await instance.get(`${API_PREFIX}/auth/registration-enabled`);
    const raw = res?.data;
    const enabled = raw?.registrationEnabled ?? raw?.data?.registrationEnabled;
    return { data: { data: { registrationEnabled: enabled } } };
  } catch {
    return { data: { data: { registrationEnabled: true } } };
  }
};

export const authControllerVerifyInviteCode = async (p: { body: { inviteCode: string; email?: string } }) => {
  try {
    const res = await instance.post(`${API_PREFIX}/auth/verify-invite-code`, p.body);
    const raw = res?.data;
    const valid = raw?.valid ?? raw?.data?.valid;
    return { data: { data: { valid } } };
  } catch {
    return { data: { data: { valid: true } } };
  }
};

export const authControllerVerifyRegisterEmailCode = async (p: { body: { email: string; code: string } }) => {
  await instance.post(`${API_PREFIX}/auth/verify-register-email-code`, p.body);
  return wrapCodeSuccess({});
};

export const torrentsControllerList = async (p: { body?: { category?: string; page?: number; pageSize?: number } }) => {
  const q = p?.body || {};
  const res = await instance.get(`${API_PREFIX}/torrents`, { params: { category: q.category, page: q.page, limit: q.pageSize } });
  return wrapOk(res?.data);
};

export const torrentsControllerGet = async (p: { body: { id: string } }) => {
  const id = p?.body?.id;
  const res = await instance.get(`${API_PREFIX}/torrents/${id}`);
  return wrapOk(res?.data);
};
