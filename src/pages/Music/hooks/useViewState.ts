import { useSearchParams } from "react-router-dom";
import { useDeferredValue } from "react";
import type { TabType, ViewMode } from "../types";
import {
  Music as MusicIcon,
  User as UserIcon,
  Disc as DiscIcon,
  ListMusic as ListMusicIcon,
  Sparkles as SparklesIcon,
} from "lucide-react";

export const tabs = [
  { id: "hall", label: "音乐大厅", icon: SparklesIcon },
  { id: "songs", label: "单曲", icon: MusicIcon },
  { id: "artists", label: "歌手", icon: UserIcon },
  { id: "albums", label: "专辑", icon: DiscIcon },
  { id: "playlists", label: "歌单", icon: ListMusicIcon },
] as const;

/**
 * 页面视图状态（当前 Tab、列表视图模式、搜索词）
 * - 使用 URL SearchParams 管理状态，支持浏览器前进后退及链接分享
 * - 引入 useDeferredValue 优化搜索响应性能
 */
export function useViewState() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 获取状态，提供默认值
  const activeTab = (searchParams.get("tab") as TabType) || "hall";
  const viewMode = (searchParams.get("view") as ViewMode) || "grid";
  const searchQuery = searchParams.get("q") || "";
  
  // 使用 deferredValue 延迟传递给重渲染成本高的组件
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // 状态更新函数
  const setActiveTab = (tab: TabType) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", tab);
        return next;
      },
      { replace: true }
    );
  };

  const setViewMode = (mode: ViewMode) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("view", mode);
        return next;
      },
      { replace: true }
    );
  };

  const setSearchQuery = (query: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (query) {
          next.set("q", query);
        } else {
          next.delete("q");
        }
        return next;
      },
      { replace: true }
    );
  };

  return {
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    searchQuery,         // 用于绑定 input value (实时)
    deferredSearchQuery, // 用于传递给列表组件 (延迟)
    setSearchQuery,
  };
}

