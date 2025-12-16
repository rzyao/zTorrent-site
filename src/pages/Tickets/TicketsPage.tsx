import { useState } from "react";
import { TicketsHeader } from "@/pages/Tickets/components/TicketsHeader";
import { TicketsTabs } from "@/pages/Tickets/components/TicketsTabs";
import type { TabType } from "@/pages/Tickets/types";
import { MyTicketsView } from "@/pages/Tickets/views/MyTicketsView";
import { TicketManagementView } from "@/pages/Tickets/views/TicketManagementView";
import { MyTodosView } from "@/pages/Tickets/views/MyTodosView";
import { TicketStatsView } from "@/pages/Tickets/views/TicketStatsView";
import { TicketFAQView } from "@/pages/Tickets/views/TicketFAQView";
import { PageContainer } from "@/layouts/PageContainer";

export function TicketsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("myTickets");
  const [isAdmin] = useState(true);

  return (
    <PageContainer>
      <TicketsHeader />
      <TicketsTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        isAdmin={isAdmin}
      />

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
