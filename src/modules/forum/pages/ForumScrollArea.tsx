import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { ReactNode, useRef, useEffect, useCallback } from "react";
import { useForumTheme } from "../context/ForumThemeContext";

interface ForumScrollAreaProps {
  children: ReactNode;
  className?: string;
  /** 滚动条消失延迟时间（毫秒），默认 1000ms */
  fadeDelay?: number;
}

/**
 * 论坛自定义滚动区域组件
 * 特性：
 * - linux.do 风格的滚动条
 * - 延迟消失 + 平滑淡出动画
 * - 支持深色/浅色主题
 */
export function ForumScrollArea({
  children,
  className = "",
  fadeDelay = 1000,
}: ForumScrollAreaProps) {
  const { theme } = useForumTheme();
  const scrollableNodeRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 滚动条主题类名
  const themeClass = "forum-scrollbar";

  // 显示滚动条
  const showScrollbar = useCallback(() => {
    if (scrollableNodeRef.current) {
      const wrapper = scrollableNodeRef.current.closest(".simplebar-wrapper");
      if (wrapper) {
        wrapper.setAttribute("data-scrolling", "true");
      }
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // 隐藏滚动条（带延迟）
  const hideScrollbar = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      if (scrollableNodeRef.current) {
        const wrapper = scrollableNodeRef.current.closest(".simplebar-wrapper");
        if (wrapper) {
          wrapper.removeAttribute("data-scrolling");
        }
      }
    }, fadeDelay);
  }, [fadeDelay]);

  useEffect(() => {
    const container = scrollableNodeRef.current;
    if (!container) return;

    const handleScroll = () => {
      showScrollbar();
      hideScrollbar();
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showScrollbar, hideScrollbar]);

  return (
    <SimpleBar
      scrollableNodeProps={{ ref: scrollableNodeRef }}
      className={`${themeClass} ${className}`}
      autoHide={true}
    >
      {children}
    </SimpleBar>
  );
}
