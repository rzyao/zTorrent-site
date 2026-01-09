import React from "react";
import { Plus, FileText, MessageCircle, Heart } from "lucide-react";
import { Separator } from "@/modules/app/components/ui/separator";
import type { RuleSection } from "../types";
import { getIconBySection } from "../utils";

/**
 * 左侧章节导航
 *
 * 说明：负责章节列表与“添加章节”入口；支持吸顶与快速链接。
 */
export const SidebarNav: React.FC<{
  sections: RuleSection[];
  expandedSection: string;
  isEditMode: boolean;
  onToggle: (id: string) => void;
  onAddSection: () => void;
}> = ({ sections, expandedSection, isEditMode, onToggle, onAddSection }) => {
  return (
    <div className="sticky top-20 rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 p-4 backdrop-blur-sm">
      <h3 className="mb-4 text-xs tracking-wide text-neutral-400 uppercase">规则目录</h3>
      <div className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onToggle(section.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all ${
              expandedSection === section.id
                ? "border border-amber-500/30 bg-linear-to-r from-amber-500/20 to-orange-600/20 text-amber-400"
                : "text-neutral-400 hover:bg-neutral-700/30 hover:text-white"
            }`}
          >
            {getIconBySection(section.id)}
            <span className="flex-1 text-left text-sm">{section.title}</span>
          </button>
        ))}
        {isEditMode && (
          <button
            onClick={onAddSection}
            className="flex w-full items-center gap-3 rounded-xl border border-green-500/30 px-4 py-3 text-green-400 transition-all hover:bg-green-500/10"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">添加章节</span>
          </button>
        )}
      </div>

      <Separator className="my-4 bg-neutral-700/50" />

      {/* 快速链接 */}
      <div className="space-y-2">
        <h3 className="mb-3 text-xs tracking-wide text-neutral-400 uppercase">快速链接</h3>
        <a
          href="#"
          className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-amber-400"
        >
          <FileText className="h-4 w-4" />
          新手教程
        </a>
        <a
          href="#"
          className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-amber-400"
        >
          <MessageCircle className="h-4 w-4" />
          常见问题
        </a>
        <a
          href="#"
          className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-amber-400"
        >
          <Heart className="h-4 w-4" />
          捐赠支持
        </a>
      </div>
    </div>
  );
};
