import axios from 'axios';

let redirecting = false;

export function setupAxiosInterceptors() {
  axios.interceptors.response.use(
    (response) => {
      if (response && response.status === 401) {
        const path = typeof window !== 'undefined' ? window.location.pathname : '';
        if (!redirecting && path !== '/login') {
          redirecting = true;
          try {
            localStorage.removeItem('accessToken');
          } catch {}
          try {
            window.dispatchEvent(new Event('authChange'));
          } catch {}
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
        if (!redirecting && path !== '/login') {
          redirecting = true;
          try {
            localStorage.removeItem('accessToken');
          } catch {}
          try {
            window.dispatchEvent(new Event('authChange'));
          } catch {}
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
