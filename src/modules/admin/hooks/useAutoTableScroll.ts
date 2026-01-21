import { useRef, useState, useLayoutEffect } from "react";

/**
 * 自动计算表格 scroll.y 的高度，使其占满父容器剩余空�?
 *
 * @returns [scrollY, ref]
 * - scrollY: 计算出的滚动区域高度
 * - ref: 需要绑定到表格父容器的 ref
 */
export function useAutoTableScroll(offset: number = 180) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState<number | string>(500);

  useLayoutEffect(() => {
    const calculateHeight = () => {
      if (!tableContainerRef.current) return;

      // 获取容器高度
      const container = tableContainerRef.current;

      // 计算 scrollY: 容器高度 - 预留的头部、底部、分页器等高�?
      // 默认 180px 能够覆盖大多�?ProTable �?Toolbar + Header + Pagination + Padding 场景
      const calculatedHeight = container.clientHeight - offset;

      setScrollY(Math.max(calculatedHeight, 200));
    };

    calculateHeight();

    const resizeObserver = new ResizeObserver(calculateHeight);
    if (tableContainerRef.current) {
      resizeObserver.observe(tableContainerRef.current);
    }

    window.addEventListener("resize", calculateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateHeight);
    };
  }, [offset]);

  return { scrollY, tableContainerRef };
}
