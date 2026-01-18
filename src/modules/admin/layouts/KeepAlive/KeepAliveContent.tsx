import React from "react";
import { TabKeyContext } from "./KeepAliveContext";

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
              className={`min-h-0 flex-1 overflow-hidden bg-[#FAFAFA] ${item.key === activeKey ? "flex flex-col" : "hidden"}`}
            >
              <TabKeyContext.Provider value={item.key}>
                <div
                  key={`${item.key}-${item.refreshKey || 0}`}
                  className="flex min-h-0 flex-1 flex-col overflow-hidden p-6"
                >
                  {item.children}
                </div>
              </TabKeyContext.Provider>
            </div>
          ))
        : children}
    </div>
  );
};

export default KeepAliveContent;
