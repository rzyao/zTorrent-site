import {
  Music as MusicIcon,
  User as UserIcon,
  Disc as DiscIcon,
  ListMusic as ListMusicIcon,
  Sparkles as SparklesIcon,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { TabType } from "../types";

interface TabNavProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

/**
 * 顶部 Tab 导航
 * - 仅负责展示与切换，不持有数据
 */
export function TabNav({ activeTab, onChange }: TabNavProps) {
  const { t } = useLanguage();

  const tabs = [
    { id: "hall", label: t('music.hall'), icon: SparklesIcon },
    { id: "songs", label: t('music.songs'), icon: MusicIcon },
    { id: "artists", label: t('music.artists'), icon: UserIcon },
    { id: "albums", label: t('music.albums'), icon: DiscIcon },
    { id: "playlists", label: t('music.playlists'), icon: ListMusicIcon },
  ] as const;

  return (
    <div className="flex items-center gap-2 bg-neutral-800/40 rounded-xl p-1 border border-neutral-700/50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id as TabType)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activeTab === tab.id
                ? "bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

