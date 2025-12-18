import { useState } from 'react';
import { customToast } from './useToast';

interface UseAsyncActionOptions {
  /** 成功提示消息 */
  successMessage?: string;
  /** 错误提示消息（如果不提供，会使用接口返回的错误信息） */
  errorMessage?: string;
  /** 是否显示 loading toast */
  showLoading?: boolean;
  /** loading 提示消息 */
  loadingMessage?: string;
  /** 成功后的回调 */
  onSuccess?: (data?: any) => void;
  /** 失败后的回调 */
  onError?: (error: any) => void;
}

/**
 * 异步操作 Hook
 * 
 * 用于处理异步请求的 loading、成功、失败状态和提示
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
  const execute = async <T,>(action: () => Promise<T>): Promise<T | undefined> => {
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
    } catch (err: any) {
      if (toastId) {
        customToast.dismiss(toastId);
      }
      
      // 错误消息优先级：
      // 1. 响应数据中的 message (err.response?.data?.message 或 err.data?.message)
      // 2. 错误对象的 message (err.message)
      // 3. 用户自定义的 errorMessage
      // 4. 默认值 '操作失败'
      const responseMessage = err.response?.data?.message || err.data?.message;
      const errorMsg = responseMessage || err?.message || errorMessage || '操作失败';
      
      customToast.error(errorMsg);
      
      setError(err);
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
