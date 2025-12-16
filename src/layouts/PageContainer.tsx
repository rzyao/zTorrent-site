import type { ReactNode } from "react";
import { cn } from "@/components/ui/utils";

interface PageContainerProps {
  children: ReactNode;
  /** 内层容器的类名（用于调整 padding 等） */
  className?: string;
  /** 外层容器的类名（用于调整背景色等） */
  wrapperClassName?: string;
}

/**
 * 页面容器组件
 * 职责：
 * - 统一页面背景色
 * - 统一页面内容的最大宽度和左右间距（响应式）
 * - 为大屏设备下的前进/后退按钮留出空间
 */
export function PageContainer({
  children,
  className,
  wrapperClassName,
}: PageContainerProps) {
  return (
    <div className={cn("min-h-screen bg-[#0F171E]", wrapperClassName)}>
      {/* 手机端占满宽度；大屏增加左右安全间距，为前进/后退按钮留出空间 */}
      <div
        className={cn(
          "w-full max-w-[1600px] mx-auto px-4 md:px-16 py-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
