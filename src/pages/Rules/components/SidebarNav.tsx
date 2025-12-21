import React from 'react';
import { Plus, FileText, MessageCircle, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { RuleSection } from '../types';
import { getIconBySection } from '../utils';

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
    <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-4 sticky top-20">
      <h3 className="text-neutral-400 text-xs uppercase tracking-wide mb-4">规则目录</h3>
      <div className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onToggle(section.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${expandedSection === section.id
              ? 'bg-linear-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30 text-amber-400'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-700/30'
              }`}
          >
            {getIconBySection(section.id)}
            <span className="text-sm flex-1 text-left">{section.title}</span>
          </button>
        ))}
        {isEditMode && (
          <button
            onClick={onAddSection}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-green-400 hover:bg-green-500/10 border border-green-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">添加章节</span>
          </button>
        )}
      </div>

      <Separator className="bg-neutral-700/50 my-4" />

      {/* 快速链接 */}
      <div className="space-y-2">
        <h3 className="text-neutral-400 text-xs uppercase tracking-wide mb-3">快速链接</h3>
        <a href="#" className="flex items-center gap-2 text-neutral-400 hover:text-amber-400 text-sm transition-colors">
          <FileText className="w-4 h-4" />
          新手教程
        </a>
        <a href="#" className="flex items-center gap-2 text-neutral-400 hover:text-amber-400 text-sm transition-colors">
          <MessageCircle className="w-4 h-4" />
          常见问题
        </a>
        <a href="#" className="flex items-center gap-2 text-neutral-400 hover:text-amber-400 text-sm transition-colors">
          <Heart className="w-4 h-4" />
          捐赠支持
        </a>
      </div>
    </div>
  );
};
