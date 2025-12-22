import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { customToast } from '@/hooks/useToast';

// ---------- 类型定义 ----------

/**
 * 统一响应结构
 * @see API Standards
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  path: string;
  timestamp: string;
}

/**
 * 错误响应的数据结构
 * data 字段包含详细描述
 */
interface ApiErrorData {
  description?: string;
}

/** 扩展 Axios 请求配置，添加 meta 字段 */
export interface RequestMeta {
  /** 是否静默模式（不显示 toast），默认 false */
  silent?: boolean;
  /** 跳过指定 HTTP 状态码的 toast 提示 */
  skipErrorCodes?: number[];
  /** 跳过指定业务错误码 (code) 的 toast 提示 */
  skipBusinessCodes?: (number | string)[];
  /** 自定义错误消息（覆盖后端返回的 message） */
  customErrorMessage?: string;
  /** 是否自动解包响应数据（直接返回 data 字段），默认为 true */
  // 注意：虽然有些项目喜欢自动解包，但为了保持类型一致性和获取完整上下文，这里建议保持 false 或由 service 层处理
  // 这里暂时不实现自动解包，因为 axios 通常返回 AxiosResponse
}

// 扩展 Axios 类型
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    meta?: RequestMeta;
  }
}

// ---------- 常量定义 ----------

const SUCCESS_CODE = 1000;

// 业务错误码映射
const BUSINESS_ERRORS = {
  BAD_REQUEST: 9400,
  UNAUTHORIZED: 9401,
  FORBIDDEN: 9403,
  NOT_FOUND: 9404,
  ACCOUNT_DISABLED: 9405,
  INTERNAL_ERROR: 9500,
};

// ---------- 状态标记 ----------

let redirecting = false;
let installed = false;

// ---------- 工具函数 ----------

/**
 * 从响应或错误中提取错误消息
 * 优先级：
 * 1. 后端返回的 message
 * 2. 自定义 meta.customErrorMessage
 * 3. 业务/HTTP 状态码对应的默认文案
 * 4. 网络错误或其他 fallback
 */
function extractErrorMessage(
  responseOrError: AxiosResponse<ApiResponse> | AxiosError<ApiResponse>,
  meta?: RequestMeta
): string {
  // 1. 尝试获取后端返回的 message
  let backendMessage: string | undefined;
  let code: number | undefined;

  // 判断是 AxiosResponse (业务错误但 HTTP 200) 还是 AxiosError (HTTP 4xx/5xx)
  if ('data' in responseOrError && !('isAxiosError' in responseOrError)) {
    // AxiosResponse
    const res = responseOrError as AxiosResponse<ApiResponse>;
    backendMessage = res.data?.message;
    code = res.data?.code;
  } else {
    // AxiosError
    const err = responseOrError as AxiosError<ApiResponse>;
    backendMessage = err.response?.data?.message;
    code = err.response?.data?.code || err.response?.status;
  }

  // 1. 后端 message 优先 (如果存在且不是默认的 "Error" 等无意义词汇，这里假设后端 message 都是友好的)
  if (backendMessage) {
    return backendMessage;
  }

  // 2. 自定义错误消息
  if (meta?.customErrorMessage) {
    return meta.customErrorMessage;
  }

  // 3. 根据 Code 返回默认描述
  const codeMessages: Record<number, string> = {
    // HTTP Status
    400: '请求参数错误',
    401: '登录已过期，请重新登录',
    403: '没有权限执行此操作',
    404: '请求的资源不存在',
    405: '请求方法不被允许',
    408: '请求超时',
    429: '请求过于频繁，请稍后再试',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务暂时不可用',
    504: '网关超时',

    // Business Codes (API Standards)
    [BUSINESS_ERRORS.BAD_REQUEST]: '请求参数校验失败',
    [BUSINESS_ERRORS.UNAUTHORIZED]: '登录已过期，请重新登录',
    [BUSINESS_ERRORS.FORBIDDEN]: '没有权限执行此操作',
    [BUSINESS_ERRORS.NOT_FOUND]: '资源不存在',
    [BUSINESS_ERRORS.ACCOUNT_DISABLED]: '账号已被禁用',
    [BUSINESS_ERRORS.INTERNAL_ERROR]: '系统内部错误',
  };

  if (code && codeMessages[code]) {
    return codeMessages[code];
  }

  // 4. 网络错误处理 (仅针对 AxiosError)
  if ('code' in responseOrError && (responseOrError as AxiosError).code) {
    const errorCode = (responseOrError as AxiosError).code;
    if (errorCode === 'ECONNABORTED') return '请求超时，请检查网络连接';
    if (errorCode === 'ERR_NETWORK') return '网络连接失败，请检查网络';
  }

  return '请求失败，请稍后重试';
}

/**
 * 判断是否需要显示 toast
 */
function shouldShowToast(
  code: number | undefined,
  meta?: RequestMeta
): boolean {
  if (meta?.silent) return false;
  if (!code) return true; // 无法识别 code 时默认显示

  // 跳过指定错误码 (同时检查 HTTP 状态码和业务码)
  if (meta?.skipErrorCodes?.includes(code)) return false;
  if (meta?.skipBusinessCodes?.includes(code)) return false;

  return true;
}

/**
 * 处理 401/9401 认证失败
 */
function handleUnauthorized(): void {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false;
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

  // 清除 token
  try {
    localStorage.removeItem('accessToken');
  } catch {}

  // 触发全局事件
  try {
    window.dispatchEvent(new Event('authChange'));
  } catch {}

  // 跳转登录
  if (!redirecting && hasToken && !publicPaths.includes(path)) {
    redirecting = true;
    const from =
      typeof window !== 'undefined'
        ? window.location.pathname + window.location.search
        : '/';
    if (typeof window !== 'undefined') {
      window.location.href = `/login?from=${encodeURIComponent(from)}`;
    }
  }
}

// ---------- 主函数 ----------

export function setupAxiosInterceptors() {
  if (installed) {
    console.warn('setupAxiosInterceptors() should be called only once');
    return;
  }
  installed = true;

  // 响应拦截器
  axios.interceptors.response.use(
    // 成功响应处理 (HTTP 2xx)
    (response: AxiosResponse<ApiResponse>) => {
      const { data, config } = response;
      const meta = config.meta;

      // 检查业务状态码
      if (data && typeof data.code === 'number' && data.code !== SUCCESS_CODE) {
        // 业务失败处理
        const businessCode = data.code;
        const description = (data.data as ApiErrorData)?.description;

        // 开发环境下打印详细错误信息
        if (description) {
          console.groupCollapsed(`[API Error] ${config.url || 'Unknown Path'}`);
          console.error('Code:', businessCode);
          console.error('Message:', data.message);
          console.error('Description:', description);
          console.groupEnd();
        }

        // 特殊处理 9401 未鉴权
        if (businessCode === BUSINESS_ERRORS.UNAUTHORIZED) {
          handleUnauthorized();
        } else {
          // 其他业务错误，显示 Toast
          if (shouldShowToast(businessCode, meta)) {
            customToast.error(extractErrorMessage(response, meta));
          }
        }

        // 抛出错误，中断后续 Promise 链，让 catch 或 useAsyncAction 捕获
        // 将原始 response 作为 mistake 抛出，或者构建一个新的 Error
        const error = new AxiosError(
          data.message || 'Business Error',
          String(businessCode),
          config,
          response.request,
          response
        );
        return Promise.reject(error);
      }

      return response;
    },

    // 错误响应处理 (HTTP 非 2xx)
    (error: AxiosError<ApiResponse>) => {
      const config = error.config as InternalAxiosRequestConfig | undefined;
      const meta = config?.meta;
      const httpStatus = error.response?.status;
      const responseData = error.response?.data;
      const businessCode = responseData?.code; // HTTP 错误时也可能返回标准 JSON
      const description = (responseData?.data as ApiErrorData)?.description;

      // 优先判断 code：有些后端设计 HTTP 401 时 body 里也有 code: 9401
      const effectiveCode = businessCode || httpStatus;

      // 开发环境下打印详细错误信息
      if (description) {
        console.groupCollapsed(`[HTTP Error] ${config?.url || 'Unknown Path'}`);
        console.error('Status:', httpStatus);
        console.error('Code:', businessCode);
        console.error('Message:', responseData?.message);
        console.error('Description:', description);
        console.groupEnd();
      }

      // 处理鉴权失败
      if (httpStatus === 401 || businessCode === BUSINESS_ERRORS.UNAUTHORIZED) {
        handleUnauthorized();
        // 401 均不显示 toast，直接跳转
        return Promise.reject(error);
      }

      // 显示错误 toast
      if (shouldShowToast(effectiveCode, meta)) {
        const message = extractErrorMessage(error, meta);
        customToast.error(message);
      }

      return Promise.reject(error);
    }
  );
}

