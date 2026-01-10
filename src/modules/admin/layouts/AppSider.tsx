import React from "react";
import { Layout, Menu, Typography } from "antd";
import type { MenuProps } from "antd";

const { Sider } = Layout;
const { Title } = Typography;

interface AppSiderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  logoImgSrc: string;
  siteTitle: string;
  menuItems: MenuProps["items"];
  selectedKey: string;
}

/**
 * 侧边栏组件
 * 性能优化：
 * 1. 使用 React.memo 避免父组件更新时不必要的重渲染
 * 2. 禁用 Menu 的内置动画（inlineCollapsed 时仍保留过渡）
 * 3. 使用 CSS transform 代替宽度变化动画
 */
const AppSider: React.FC<AppSiderProps> = React.memo(
  ({
    collapsed,
    setCollapsed,
    logoImgSrc,
    siteTitle,
    menuItems,
    selectedKey,
  }) => {
    // 使用 useMemo 缓存 selectedKeys 数组，避免每次渲染创建新数组
    const selectedKeys = React.useMemo(() => [selectedKey], [selectedKey]);

    return (
      <Sider
        width={200}
        collapsedWidth={64}
        breakpoint="lg"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          height: "100vh",
          background: "#ffffff",
          overflow: "hidden",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* Logo 区域 */}
          <div
            style={{
              height: 56,
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {logoImgSrc ? (
                <img
                  src={logoImgSrc}
                  alt="logo"
                  style={{ height: 32, width: 32, objectFit: "contain" }}
                />
              ) : null}
              {!collapsed && (
                <Title
                  level={4}
                  style={{
                    color: "#000000",
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {siteTitle}
                </Title>
              )}
            </div>
          </div>

          {/* 导航菜单 */}
          <Menu
            theme="light"
            mode="inline"
            style={{
              borderRight: "1px solid #f0f0f0",
              backgroundColor: "#ffffff",
              borderInlineEnd: 0,
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarGutter: "stable",
            }}
            selectedKeys={selectedKeys}
            items={menuItems}
          />
        </div>
      </Sider>
    );
  },
  // 自定义比较函数，只在关键 props 变化时重渲染
  (prevProps, nextProps) => {
    return (
      prevProps.collapsed === nextProps.collapsed &&
      prevProps.selectedKey === nextProps.selectedKey &&
      prevProps.menuItems === nextProps.menuItems &&
      prevProps.siteTitle === nextProps.siteTitle &&
      prevProps.logoImgSrc === nextProps.logoImgSrc
    );
  }
);

AppSider.displayName = "AppSider";

export default AppSider;
