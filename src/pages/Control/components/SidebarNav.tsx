import { ChevronRight } from 'lucide-react';
import type { TabType } from '../types';

interface SidebarNavProps {
  tabs: Array<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }>;
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

// 左侧导航菜单组件
// 职责：渲染 Tab 列表并处理切换交互
export function SidebarNav({ tabs, activeTab, onChange }: SidebarNavProps) {
  return (
    <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden">
      <div className="p-4">
        <h3 className="text-neutral-400 text-xs uppercase tracking-wide mb-3">设置菜单</h3>
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-400 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-700/30'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

