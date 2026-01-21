import { useEffect, useRef, useState } from "react";

/**
 * 自动计算容器内表格可滚动的垂直高度
 * @param offset 底部预留偏移量 (默认 220)
 * @returns { ref, scrollY }
 */
export function useContainerScroll(offset = 220) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScrollY(rect.height - offset);
      }
    };

    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) {
      ro.observe(containerRef.current);
      // 初始触发一次
      handleResize();
    }

    return () => ro.disconnect();
  }, [offset]);

  return { containerRef, scrollY };
}
