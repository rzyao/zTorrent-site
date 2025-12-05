import axios from 'axios';

// 记录是否已经安装过拦截器，避免在 HMR 或多入口场景下重复安装
let redirecting = false;
let installed = false;

export function setupAxiosInterceptors() {
  // 如果已经安装过，直接返回并在控制台输出提示，防止重复叠加导致行为异常
  if (installed) {
    console.warn('setupAxiosInterceptors() should be called only once');
    return;
  }
  installed = true;
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

  axios.interceptors.response.use(
    (response) => {
      if (response && response.status === 401) {
        const path = typeof window !== 'undefined' ? window.location.pathname : '';
        const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false;

        try {
          localStorage.removeItem('accessToken');
        } catch {}
        try {
          window.dispatchEvent(new Event('authChange'));
        } catch {}

        if (!redirecting && hasToken && !publicPaths.includes(path)) {
          redirecting = true;
          const from = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
          if (typeof window !== 'undefined') {
            window.location.href = `/login?from=${encodeURIComponent(from)}`;
          }
        }
      }
      return response;
    },
    (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        const path = typeof window !== 'undefined' ? window.location.pathname : '';
        const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false;

        try {
          localStorage.removeItem('accessToken');
        } catch {}
        try {
          window.dispatchEvent(new Event('authChange'));
        } catch {}

        if (!redirecting && hasToken && !publicPaths.includes(path)) {
          redirecting = true;
          const from = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
          if (typeof window !== 'undefined') {
            window.location.href = `/login?from=${encodeURIComponent(from)}`;
          }
        }
      }
      return Promise.reject(error);
    }
  );
}
