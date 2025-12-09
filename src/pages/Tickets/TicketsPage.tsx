import { useState } from 'react';
import { TicketsHeader } from '@/pages/Tickets/components/TicketsHeader';
import { TicketsTabs } from '@/pages/Tickets/components/TicketsTabs';
import type { TabType } from '@/pages/Tickets/types';
import { MyTicketsView } from '@/pages/Tickets/views/MyTicketsView';
import { TicketManagementView } from '@/pages/Tickets/views/TicketManagementView';
import { MyTodosView } from '@/pages/Tickets/views/MyTodosView';
import { TicketStatsView } from '@/pages/Tickets/views/TicketStatsView';
import { TicketFAQView } from '@/pages/Tickets/views/TicketFAQView';

export function TicketsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('myTickets');
  const [isAdmin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-950">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <TicketsHeader />
        <TicketsTabs activeTab={activeTab} onChange={setActiveTab} isAdmin={isAdmin} />

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
