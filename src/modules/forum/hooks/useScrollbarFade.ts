import { useEffect, useRef, useCallback } from "react";

/**
 * 实现滚动条延迟消失效果的 Hook
 * 类似 linux.do 的滚动条行为：滚动时显示，停止后延迟消失
 *
 * @param delay 延迟消失时间（毫秒），默认 1000ms
 */
export function useScrollbarFade(delay: number = 1000) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showScrollbar = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.setAttribute("data-scrolling", "true");
    }
    // 清除之前的隐藏定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const hideScrollbar = useCallback(() => {
    // 设置延迟隐藏
    timeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.removeAttribute("data-scrolling");
      }
    }, delay);
  }, [delay]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      showScrollbar();
      hideScrollbar();
    };

    const handleMouseEnter = () => {
      showScrollbar();
    };

    const handleMouseLeave = () => {
      hideScrollbar();
    };

    container.addEventListener("scroll", handleScroll);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showScrollbar, hideScrollbar]);

  return containerRef;
}
