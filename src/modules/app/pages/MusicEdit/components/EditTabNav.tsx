import { Music, User, Disc } from "lucide-react";
import type { TabType } from "../types";

const tabs = [
  { id: "songs", label: "单曲管理", icon: Music },
  { id: "artists", label: "歌手管理", icon: User },
  { id: "albums", label: "专辑管理", icon: Disc },
] as const;

export function EditTabNav({
  activeTab,
  onChange,
}: {
  activeTab: TabType;
  onChange: (t: TabType) => void;
}) {
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
                ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
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

