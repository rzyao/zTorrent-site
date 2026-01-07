import React from "react";

interface PageContainerProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * 通用页面容器组件
 *
 * 用于包裹页面内容，提供统一的边距、背景色和全屏高度布局。
 * 默认占满父容器剩余空间。
 */
const PageContainer: React.FC<PageContainerProps> = ({
  children,
  style,
  className,
}) => {
  return (
    <div
      className={"page-container " + className}
      style={{
        padding: "12px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#f3f3f3",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer;
