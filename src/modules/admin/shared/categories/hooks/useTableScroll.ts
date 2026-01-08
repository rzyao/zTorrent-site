import { useRef, useEffect, useState } from "react";

export function useTableScroll(offset = 60) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const updateScrollY = () => {
      if (containerRef.current) {
        setScrollY(containerRef.current.clientHeight - offset);
      }
    };

    const timer = setTimeout(updateScrollY, 0);
    const ro = new ResizeObserver(updateScrollY);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updateScrollY);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener("resize", updateScrollY);
    };
  }, [offset]);

  return { containerRef, scrollY };
}
