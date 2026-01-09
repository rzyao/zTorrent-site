import React from "react";
import { cn } from "@/utils/cn";

interface AdminPageContainerProps {
  children?: React.ReactNode;
  className?: string;
  /** 是否使用紧凑模式（无内边距） */
  compact?: boolean;
}

/**
 * Admin 模块专用页面容器组件
 *
 * 遵循 Ant Design 规范：
 * - 标准内边距：24px (--antd-spacing-lg)
 * - 背景色：#f5f5f5 (--antd-bg-layout)
 * - 全宽布局，无 max-width 限制
 */
export function AdminPageContainer({
  children,
  className,
  compact = false,
}: AdminPageContainerProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#FAFAFA]",
        // Ant Design 标准间距：24px
        !compact && "p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default AdminPageContainer;
