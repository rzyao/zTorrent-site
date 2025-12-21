// useToast.ts

import { toast, ExternalToast } from "sonner";
// import type { ExternalToast } from "sonner";

// 定义您想要的持续时间（毫秒）
const DURATION_SUCCESS = 1500; // 成功：1.5 秒
const DURATION_ERROR = 5000;   // 错误：5.0 秒
const DURATION_DEFAULT = 3000; // 其他类型：3.0 秒

// 导出一个包装对象，其中包含您自定义的方法
export const customToast = {
  // 成功消息：使用短持续时间
  success: (message: string, options?: ExternalToast) => {
    toast.success(message, {
      duration: DURATION_SUCCESS, // 覆盖默认持续时间
      ...options,
    });
  },

  // 错误消息：使用长持续时间
  error: (message: string, options?: ExternalToast) => {
    toast.error(message, {
      duration: DURATION_ERROR, // 覆盖默认持续时间
      ...options,
    });
  },

  // 默认（或其他）消息：使用标准持续时间
  default: (message: string, options?: ExternalToast) => {
    toast(message, {
      duration: DURATION_DEFAULT, // 使用默认持续时间
      ...options,
    });
  },

  // 也可以包装其他类型，如 info
  info: (message: string, options?: ExternalToast) => {
    toast.info(message, {
      duration: DURATION_DEFAULT,
      ...options,
    });
  },

  // 加载中消息
  loading: (message: string, options?: ExternalToast) => {
    return toast.loading(message, options);
  },

  // 关闭消息
  dismiss: (id?: string | number) => {
    toast.dismiss(id);
  },

  // 也可以直接暴露原始的 toast 函数，以备不时之需
  raw: toast,
};
