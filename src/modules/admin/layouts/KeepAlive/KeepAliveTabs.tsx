import React from "react";
import { Tabs, Space, Button, Avatar } from "antd";
import { BellOutlined, ReloadOutlined, UserOutlined } from "@ant-design/icons";
import "./KeepAliveTabs.css";

interface KeepAliveTabsProps {
  items: any[];
  activeKey: string;
  onEdit: (targetKey: any, action: "add" | "remove") => void;
  onTabClick: (key: string) => void;
  handleRefresh: () => void;
  handleLogout: () => void;
}

const KeepAliveTabs: React.FC<KeepAliveTabsProps> = ({
  items,
  activeKey,
  onEdit,
  onTabClick,
  handleRefresh,
  handleLogout,
}) => {
  // 右侧操作按钮区域
  const tabBarExtraContent = (
    <Space style={{ marginRight: 16 }}>
      <BellOutlined style={{ fontSize: 16 }} />
      <Button
        type="text"
        size="small"
        icon={<ReloadOutlined />}
        onClick={handleRefresh}
        onMouseDown={(e) => e.preventDefault()}
      >
        刷新
      </Button>
      <Avatar size="small" icon={<UserOutlined />} />
      <Button type="text" size="small" onClick={handleLogout}>
        退出登录
      </Button>
    </Space>
  );

  return (
    <div
      className="keep-alive-tabs-container shrink-0"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tabs
        hideAdd
        type="editable-card"
        activeKey={activeKey}
        onEdit={onEdit}
        onTabClick={onTabClick}
        tabBarExtraContent={tabBarExtraContent}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
        // 只传递 key 和 label，不传递 children，确保只渲染 Tab 栏
        items={items.map((item) => ({
          key: item.key,
          label: item.label,
          closable: item.closable,
        }))}
        renderTabBar={(tabBarProps, DefaultTabBar) => (
          <DefaultTabBar {...tabBarProps}>
            {(node) => (
              <div
                key={node.key}
                className={`tab-outer-wrapper ${
                  node.key === activeKey ? "tab-outer-wrapper-active" : ""
                }`}
              >
                {node}
              </div>
            )}
          </DefaultTabBar>
        )}
        tabBarStyle={{
          margin: 0,
          paddingLeft: 16,
          paddingTop: 4,
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
        }}
      />
    </div>
  );
};

export default KeepAliveTabs;
