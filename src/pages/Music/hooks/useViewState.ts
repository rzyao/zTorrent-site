import { useState } from "react";
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
 * - 将原 MusicPage 中的视图相关状态集中管理，便于复用
 */
export function useViewState() {
  const [activeTab, setActiveTab] = useState<TabType>("hall");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  return {
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
  };
}

