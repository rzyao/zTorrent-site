import { useState } from 'react';
import {
  Ticket,
  LayoutList,
  Settings,
  ListTodo,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import { MyTicketsView } from './Tickets/MyTicketsView';
import { TicketManagementView } from './Tickets/TicketManagementView';
import { MyTodosView } from './Tickets/MyTodosView';
import { TicketStatsView } from './Tickets/TicketStatsView';
import { TicketFAQView } from './Tickets/TicketFAQView';

type TabType = 'myTickets' | 'management' | 'todos' | 'stats' | 'faq';

export function TicketsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('myTickets');
  const [isAdmin] = useState(true); // 模拟管理员状态

  const tabs = [
    {
      id: 'myTickets' as TabType,
      label: '我的工单',
      icon: <Ticket className="w-4 h-4" />,
      show: true,
    },
    {
      id: 'management' as TabType,
      label: '工单管理',
      icon: <Settings className="w-4 h-4" />,
      show: isAdmin, // 仅管理员可见
    },
    {
      id: 'todos' as TabType,
      label: '我的待办',
      icon: <ListTodo className="w-4 h-4" />,
      show: isAdmin, // 仅管理员可见
    },
    {
      id: 'stats' as TabType,
      label: '统计报表',
      icon: <BarChart3 className="w-4 h-4" />,
      show: isAdmin, // 仅管理员可见
    },
    {
      id: 'faq' as TabType,
      label: '常见问题',
      icon: <HelpCircle className="w-4 h-4" />,
      show: true,
    },
  ];

  const visibleTabs = tabs.filter(tab => tab.show);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <LayoutList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">工单系统</h1>
              <p className="text-neutral-400 text-sm mt-1">
                提交问题、查看进度、管理工单
              </p>
            </div>
          </div>

          {/* 二级导航 */}
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-2">
            <div className="flex flex-wrap gap-2">
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div>
          {activeTab === 'myTickets' && <MyTicketsView />}
          {activeTab === 'management' && <TicketManagementView />}
          {activeTab === 'todos' && <MyTodosView />}
          {activeTab === 'stats' && <TicketStatsView />}
          {activeTab === 'faq' && <TicketFAQView />}
        </div>
      </div>
    </div>
  );
}
