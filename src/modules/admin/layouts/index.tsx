import React from "react";
import { Layout } from "antd";
import { useBasicLayout } from "./hooks/useBasicLayout";
import { useKeepAliveTabs } from "./KeepAlive/useKeepAliveTabs";
import AppSider from "./AppSider";
import AppHeader from "./AppHeader";
import KeepAliveContent from "./KeepAlive/KeepAliveContent";
import { GlobalErrorBoundary } from "./GlobalErrorBoundary";
import "./styles.css";

const { Content } = Layout;

const BasicLayout: React.FC = () => {
  const {
    site,
    logoImgSrc,
    collapsed,
    setCollapsed,
    selectedKey,
    menuItems,
    refreshKey,
    handleRefresh,
    handleLogout,
  } = useBasicLayout();

  // 使用 KeepAlive Hook 管理 Tab 状态
  const { items, activeKey, onEdit, handleTabClick } =
    useKeepAliveTabs(menuItems);

  return (
    <Layout style={{ height: "100vh" }}>
      <AppSider
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        logoImgSrc={logoImgSrc}
        siteTitle={site.title}
        menuItems={menuItems}
        selectedKey={selectedKey}
      />
      <Layout
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header 区域：仅包含 Tab 导航栏 */}
        <AppHeader
          handleRefresh={handleRefresh}
          handleLogout={handleLogout}
          items={items}
          activeKey={activeKey}
          onEdit={onEdit}
          onTabClick={handleTabClick}
          refreshKey={refreshKey}
        />

        {/* 内容区域：与 Header 同级，负责渲染具体页面 */}
        <Content
          style={{
            flex: 1,
            padding: 0,
            overflow: "hidden", // 内容区内部有 KeepAliveContent 处理滚动
            backgroundColor: "#fcfcfc",
            position: "relative",
          }}
        >
          <GlobalErrorBoundary key={refreshKey}>
            <KeepAliveContent items={items} activeKey={activeKey} />
          </GlobalErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
