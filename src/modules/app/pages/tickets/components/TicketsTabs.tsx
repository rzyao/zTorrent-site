import { Ticket, Settings, ListTodo, BarChart3, HelpCircle } from 'lucide-react';
import type { TabType, TabItem } from '../types';

interface TicketsTabsProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
  isAdmin?: boolean;
}

function getTabs(isAdmin: boolean = false): TabItem[] {
  return [
    { id: 'myTickets', label: '我的工单', icon: <Ticket className="w-4 h-4" />, show: true },
    { id: 'management', label: '工单管理', icon: <Settings className="w-4 h-4" />, show: !!isAdmin },
    { id: 'todos', label: '我的待办', icon: <ListTodo className="w-4 h-4" />, show: !!isAdmin },
    { id: 'stats', label: '统计报表', icon: <BarChart3 className="w-4 h-4" />, show: !!isAdmin },
    { id: 'faq', label: '常见问题', icon: <HelpCircle className="w-4 h-4" />, show: true },
  ];
}

export function TicketsTabs({ activeTab, onChange, isAdmin = false }: TicketsTabsProps) {
  const visibleTabs = getTabs(isAdmin).filter((t) => t.show);

  return (
    <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-2">
      <div className="flex flex-wrap gap-2">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${activeTab === tab.id
              ? 'bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

