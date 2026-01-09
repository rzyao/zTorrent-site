import { toast } from "sonner";

/**
 * 自定义 Toast 工具
 * 对 sonner 的简易封装，方便统一管理和替换
 */
export const customToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
  loading: (message: string) => toast.loading(message),
  dismiss: (id?: string | number) => toast.dismiss(id),
  custom: (message: string) => toast(message),
};

export function useToast() {
  return customToast;
}
