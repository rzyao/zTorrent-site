import { create } from "zustand";

interface GlobalLoaderState {
  /** 当前加载任务计数 */
  loadingCount: number;
  /** 是否显示加载器 */
  isVisible: boolean;
  /** 增加加载任务（计数+1） */
  startLoading: () => void;
  /** 完成加载任务（计数-1，当计数为0时隐藏） */
  finishLoading: () => void;
}

/**
 * 全局加载器状态管理（引用计数模式）
 * - 多个组件可以同时调用 startLoading()
 * - 只有当所有加载都完成（计数归零）时才隐藏加载器
 */
export const useGlobalLoader = create<GlobalLoaderState>((set) => ({
  loadingCount: 0,
  isVisible: false,
  startLoading: () =>
    set((state) => ({
      loadingCount: state.loadingCount + 1,
      isVisible: true,
    })),
  finishLoading: () =>
    set((state) => {
      const newCount = Math.max(0, state.loadingCount - 1);
      return {
        loadingCount: newCount,
        isVisible: newCount > 0,
      };
    }),
}));
