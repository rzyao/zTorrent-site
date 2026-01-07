import React from "react";
import PageContainer from "@/modules/admin/components/PageContainer";

interface KeepAliveContentProps {
  items: any[];
  activeKey: string;
  children?: React.ReactNode;
}

const KeepAliveContent: React.FC<KeepAliveContentProps> = ({ items, activeKey, children }) => {
  return (
    <div
      style={{
        height: "100%",
        flex: 1,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {items.length > 0
        ? items.map((item) => (
            <div
              key={item.key}
              id={item.key === activeKey ? "app-content-scroll-container" : undefined}
              style={{
                height: "100%",
                overflow: "auto",
                display: item.key === activeKey ? "block" : "none",
              }}
            >
              {/* 使用 PageContainer 包裹每个页面内容，提供统一的容器样式 */}
              <PageContainer>{item.children}</PageContainer>
            </div>
          ))
        : children}
    </div>
  );
};

export default KeepAliveContent;
