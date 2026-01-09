import React from "react";
import { AdminPageContainer } from "@/modules/admin/components/AdminPageContainer";

interface KeepAliveContentProps {
  items: any[];
  activeKey: string;
  children?: React.ReactNode;
}

const KeepAliveContent: React.FC<KeepAliveContentProps> = ({ items, activeKey, children }) => {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {items.length > 0
        ? items.map((item) => (
            <div
              key={item.key}
              id={item.key === activeKey ? "app-content-scroll-container" : undefined}
              className={`min-h-0 flex-1 overflow-auto ${item.key === activeKey ? "flex flex-col" : "hidden"}`}
            >
              <AdminPageContainer className="min-h-0 flex-1">{item.children}</AdminPageContainer>
            </div>
          ))
        : children}
    </div>
  );
};

export default KeepAliveContent;
