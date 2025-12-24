import type { ViewMode, TabType } from "../types";
import { Grid, List } from "lucide-react";

interface ViewToggleProps {
  activeTab: TabType;
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

/**
 * 网格/列表视图切换按钮
 * - 仅在非 “音乐大厅” Tab 显示
 */
export function ViewToggle({ activeTab, viewMode, onChange }: ViewToggleProps) {
  if (activeTab === "hall") return null;
  return (
    <div className="flex items-center gap-2 bg-neutral-800/40 rounded-lg p-1 border border-neutral-700/50">
      <button
        onClick={() => onChange("grid")}
        className={`p-2 rounded-lg transition-all ${
          viewMode === "grid" ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"
        }`}
        title="网格视图"
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`p-2 rounded-lg transition-all ${
          viewMode === "list" ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"
        }`}
        title="列表视图"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}

