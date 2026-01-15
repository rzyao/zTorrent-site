import { create } from "zustand";

export type DownloadStatus = "idle" | "loading" | "success";

interface DownloadState {
  /** 每个 torrentId 对应的下载状态 */
  statuses: Map<string, DownloadStatus>;
  /** 设置某个种子的下载状态 */
  setStatus: (torrentId: string, status: DownloadStatus) => void;
  /** 获取某个种子的下载状态 */
  getStatus: (torrentId: string) => DownloadStatus;
  /** 重置所有状态 */
  resetAll: () => void;
}

/**
 * 全局下载状态 Store
 * 用于在不同组件间同步下载状态（如 DownloadButton 和 DownloadToDownloaderModal）
 */
export const useDownloadStatusStore = create<DownloadState>((set, get) => ({
  statuses: new Map(),

  setStatus: (torrentId, status) => {
    set((state) => {
      const newStatuses = new Map(state.statuses);
      newStatuses.set(torrentId, status);

      // 如果是 success 状态，2秒后自动重置为 idle
      if (status === "success") {
        setTimeout(() => {
          const currentState = get();
          if (currentState.statuses.get(torrentId) === "success") {
            currentState.setStatus(torrentId, "idle");
          }
        }, 2000);
      }

      return { statuses: newStatuses };
    });
  },

  getStatus: (torrentId) => {
    return get().statuses.get(torrentId) || "idle";
  },

  resetAll: () => {
    set({ statuses: new Map() });
  },
}));
