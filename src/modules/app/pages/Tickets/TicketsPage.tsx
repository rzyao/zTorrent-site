import { useState } from "react";
import { TicketsHeader } from "@/modules/app/pages/Tickets/components/TicketsHeader";
import { TicketsTabs } from "@/modules/app/pages/Tickets/components/TicketsTabs";
import type { TabType } from "@/modules/app/pages/Tickets/types";
import { MyTicketsView } from "@/modules/app/pages/Tickets/views/MyTicketsView";
import { TicketManagementView } from "@/modules/app/pages/Tickets/views/TicketManagementView";
import { MyTodosView } from "@/modules/app/pages/Tickets/views/MyTodosView";
import { TicketStatsView } from "@/modules/app/pages/Tickets/views/TicketStatsView";
import { TicketFAQView } from "@/modules/app/pages/Tickets/views/TicketFAQView";
import { PageContainer } from "@/components/PageContainer";

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("myTickets");
  const [isAdmin] = useState(true);

  return (
    <PageContainer>
      <TicketsHeader />
      <TicketsTabs activeTab={activeTab} onChange={setActiveTab} isAdmin={isAdmin} />

      {/* 内容区域 */}
      <div>
        {activeTab === "myTickets" && <MyTicketsView />}
        {activeTab === "management" && <TicketManagementView />}
        {activeTab === "todos" && <MyTodosView />}
        {activeTab === "stats" && <TicketStatsView />}
        {activeTab === "faq" && <TicketFAQView />}
      </div>
    </PageContainer>
  );
}
