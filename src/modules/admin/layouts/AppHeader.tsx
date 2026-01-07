import React from "react";
import KeepAliveTabs from "./KeepAlive/KeepAliveTabs";

interface AppHeaderProps {
  handleRefresh: () => void;
  handleLogout: () => void;
  items: any[];
  activeKey: string;
  onEdit: (targetKey: any, action: "add" | "remove") => void;
  onTabClick: (key: string) => void;
  refreshKey?: number;
}

/**
 * 应用顶部区域组件
 * 包含 KeepAliveTabs 用于导航
 */
const AppHeader: React.FC<AppHeaderProps> = ({
  handleRefresh,
  handleLogout,
  items,
  activeKey,
  onEdit,
  onTabClick,
}) => {
  return (
    <div style={{ height: "auto", display: "flex", flexDirection: "column" }}>
      <KeepAliveTabs
        items={items}
        activeKey={activeKey}
        onEdit={onEdit}
        onTabClick={onTabClick}
        handleRefresh={handleRefresh}
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default AppHeader;
