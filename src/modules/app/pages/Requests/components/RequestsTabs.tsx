// 无状态标签导航组件：只负责渲染 Tab 列表与交互回调
// 设计原则：
// - 所有数据通过 props 传入（activeTab、tabs），事件通过 onChange 回传；
// - 不包含业务逻辑（权限/计算），由外层 hook 统一管理；
// - 保持与原有视觉一致，增强可复用性。

import { Shield } from 'lucide-react';
import type { TabMeta, TabView } from '@/modules/app/pages/Requests/types';

interface RequestsTabsProps {
  // 当前激活的标签
  activeTab: TabView;
  // 可见标签集合（已由外层过滤）
  tabs: TabMeta[];
  // 变更回调：点击某个标签时触发
  onChange: (id: TabView) => void;
}

export function RequestsTabs({ activeTab, tabs, onChange }: RequestsTabsProps) {
  return (
    <div className="sticky top-0 z-40 bg-[#0F171E]/95 backdrop-blur-sm border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 whitespace-nowrap transition-all duration-200
                  ${isActive
                    ? 'text-amber-400 border-b-2 border-amber-400 bg-linear-to-br from-amber-600/10 to-orange-600/10'
                    : 'text-amber-200/60 hover:text-amber-300 hover:bg-amber-500/5'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.adminOnly && (
                  // 管理员可见的标签附加小盾牌标识，仅用于提示，不影响图标逻辑
                  <Shield className="w-3 h-3 text-orange-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

