import { useState } from "react";
import { customToast } from "@/hooks/useToast";

interface UseAsyncActionOptions {
  successMessage?: string;
  loadingMessage?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useAsyncAction(options: UseAsyncActionOptions = {}) {
  const [loading, setLoading] = useState(false);

  const execute = async <T>(action: () => Promise<T>): Promise<T | undefined> => {
    setLoading(true);
    let toastId: string | number | undefined;

    if (options.loadingMessage) {
      toastId = customToast.loading(options.loadingMessage);
    }

    try {
      const result = await action();
      if (toastId) customToast.dismiss(toastId);
      if (options.successMessage) {
        customToast.success(options.successMessage);
      }
      options.onSuccess?.();
      return result;
    } catch (error: any) {
      if (toastId) customToast.dismiss(toastId);

      if (!error.isToastShown) {
        const errorMessage =
          error.response?.data?.message || error.data?.message || error.message || "操作失败";

        customToast.error(errorMessage);
      }
      options.onError?.(error);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
}
