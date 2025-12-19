import type { ReactNode } from "react";
import { cn } from "@/components/ui/utils";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

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
  backgroundImage,
  backgroundAlt = "Background",
}: PageContainerProps & {
  /** 背景图片 URL */
  backgroundImage?: string;
  /** 背景图片 Alt 文本 */
  backgroundAlt?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-screen bg-[#0F171E] relative overflow-hidden",
        wrapperClassName
      )}
    >
      {/* 背景图层与渐变遮罩 */}
      {backgroundImage && (
        <div className="absolute inset-0 h-[700px]">
          <ImageWithFallback
            src={backgroundImage}
            alt={backgroundAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E] via-[#0F171E]/60 to-transparent" />
        </div>
      )}

      {/* 手机端占满宽度；大屏增加左右安全间距，为前进/后退按钮留出空间 */}
      <div
        className={cn(
          "relative w-full max-w-[1600px] mx-auto px-4 md:px-16 py-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
