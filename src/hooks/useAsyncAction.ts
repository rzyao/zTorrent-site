import { useState } from 'react';
import { customToast } from './useToast';

interface UseAsyncActionOptions {
  /** 成功提示消息 */
  successMessage?: string;
  /** 错误提示消息（仅当 showErrorToast 为 true 时生效） */
  errorMessage?: string;
  /** 是否显示 loading toast */
  showLoading?: boolean;
  /** loading 提示消息 */
  loadingMessage?: string;
  /**
   * 是否在此 Hook 中显示错误 toast
   * @default false - 错误提示由 Axios 响应拦截器统一处理
   * 设为 true 时，会使用自定义 errorMessage 或后端返回的 message 显示 toast
   */
  showErrorToast?: boolean;
  /** 成功后的回调 */
  onSuccess?: (data?: unknown) => void;
  /** 失败后的回调 */
  onError?: (error: unknown) => void;
}

/**
 * 异步操作 Hook
 *
 * 用于处理异步请求的 loading、成功、失败状态和提示
 * 注意：错误提示默认由 Axios 响应拦截器统一处理，不会重复显示
 *
 * @example
 * ```tsx
 * const { execute, loading } = useAsyncAction({
 *   successMessage: '保存成功',
 *   loadingMessage: '正在保存...',
 * });
 *
 * const handleSave = async () => {
 *   await execute(async () => {
 *     await api.save(data);
 *   });
 * };
 * ```
 */
export function useAsyncAction(options: UseAsyncActionOptions = {}) {
  const {
    successMessage,
    errorMessage,
    showLoading = true,
    loadingMessage = '处理中...',
    showErrorToast = false, // 默认不显示，由拦截器处理
    onSuccess,
    onError,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 执行异步操作
   * @param action 要执行的异步函数
   * @returns 返回 action 的执行结果
   */
  const execute = async <T>(action: () => Promise<T>): Promise<T | undefined> => {
    setLoading(true);
    setError(null);

    let toastId: string | number | undefined;
    if (showLoading && loadingMessage) {
      toastId = customToast.loading(loadingMessage);
    }

    try {
      const result = await action();

      if (toastId) {
        customToast.dismiss(toastId);
      }

      if (successMessage) {
        customToast.success(successMessage);
      }

      onSuccess?.(result);
      return result;
    } catch (err: unknown) {
      if (toastId) {
        customToast.dismiss(toastId);
      }

      // 仅当 showErrorToast 为 true 时，手动显示错误 toast
      // 否则由 Axios 响应拦截器统一处理
      if (showErrorToast) {
        const axiosError = err as { response?: { data?: { message?: string } }; data?: { message?: string }; message?: string };
        const responseMessage = axiosError.response?.data?.message || axiosError.data?.message;
        const errorMsg = responseMessage || axiosError?.message || errorMessage || '操作失败';
        customToast.error(errorMsg);
      }

      setError(err instanceof Error ? err : new Error(String(err)));
      onError?.(err);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error,
  };
}

