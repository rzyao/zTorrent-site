import { toast } from "sonner";

/**
 * 全局消息工具
 * 已从 Ant Design message 迁移至 sonner toast
 *
 * 注意：由于 Sonner 的 toast 函数可以直接在任何地方导入使用，
 * 这种封装主要为了保持与旧代码的兼容性。
 */

export const globalMessage = {
  success: (content: string) => toast.success(content),
  error: (content: string) => toast.error(content),
  warning: (content: string) => toast.warning(content),
  info: (content: string) => toast.info(content),
};

/**
 * @deprecated 迁移至 Sonner 后不再需要注入实例
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setMessageInstance(_instance: any) {
  // no-op
}

/**
 * @deprecated 迁移至 Sonner 后不再需要获取实例
 */
export function getMessageInstance() {
  return null;
}
