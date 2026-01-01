import { createPortal } from "react-dom";
import { Quote } from "lucide-react";
import { useEffect, useRef } from "react";

interface SelectionPopoverProps {
  x: number;
  y: number;
  onQuote: () => void;
  onClose: () => void;
}

export function SelectionPopover({ x, y, onQuote, onClose }: SelectionPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 监听全局滚动，滚动时隐藏菜单以避免位置错乱
    const handleScroll = () => {
      onClose();
    };

    // 监听点击外部
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // 如果点击的不是选区本身（防止抬起鼠标时立即关闭）
        // 实际上 onMouseUp 触发显示，click 触发关闭可能冲突。
        //这里简单处理：点击菜单外部即关闭。
        onClose();
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // 定位样式：居中显示在选区上方
  const style = {
    top: y - 12, // 向上偏移
    left: x,
    transform: "translate(-50%, -100%)", // 居中并向上翻
  };

  return createPortal(
    <div
      ref={ref}
      className="animate-in fade-in zoom-in-95 fixed z-50 flex items-center gap-1 overflow-hidden rounded bg-white shadow-lg ring-1 ring-black/5 duration-100 dark:bg-neutral-800 dark:ring-white/10"
      style={style}
      onMouseDown={(e) => e.stopPropagation()} // 防止点击菜单触发外部关闭逻辑
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onQuote();
        }}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:active:bg-neutral-600"
      >
        <Quote className="h-4 w-4" />
        引用
      </button>
      {/* 预留位置添加更多按钮 */}
    </div>,
    document.body,
  );
}
