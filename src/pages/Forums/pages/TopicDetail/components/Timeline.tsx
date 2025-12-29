import { useState, useRef, useEffect, useCallback } from "react";

import { cn } from "@/components/ui/utils";

interface TimelineProps {
  totalPosts?: number;
  currentPost?: number; // 1-based index
  startDate?: string;
  lastPostedAt?: string;
  theme?: string;
  colors?: any;
  className?: string;
  onChange?: (index: number) => void;
}

const SCROLLER_HEIGHT = 40; // 滚动滑块高度
const SCROLL_AREA_HEIGHT = 300; // 滚动区域总高度

export const Timeline = ({
  totalPosts = 28,
  currentPost = 1,
  startDate = "May '13",
  lastPostedAt = "Now",
  theme,
  colors,
  className,
  onChange,
}: TimelineProps) => {
  const [percentage, setPercentage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const startPercentage = useRef<number>(0);

  // 初始化进度
  useEffect(() => {
    if (totalPosts > 1) {
      const p = Math.max(0, Math.min(1, (currentPost - 1) / (totalPosts - 1)));
      setPercentage(p);
    }
  }, [currentPost, totalPosts]);

  // 计算滑块位置
  // Available scroll height = Total Height - Scroller Height
  const availableHeight = SCROLL_AREA_HEIGHT - SCROLLER_HEIGHT;
  const topPosition = percentage * availableHeight;

  // 处理拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    startPercentage.current = percentage;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // 处理移动
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!scrollAreaRef.current) return;

      const deltaY = e.clientY - dragStartY.current;
      const availableH = SCROLL_AREA_HEIGHT - SCROLLER_HEIGHT;
      const deltaPercentage = deltaY / availableH;

      let newPercentage = startPercentage.current + deltaPercentage;
      newPercentage = Math.max(0, Math.min(1, newPercentage));

      setPercentage(newPercentage);

      // 计算对应的帖子索引
      const newIndex = Math.round(newPercentage * (totalPosts - 1)) + 1;
      if (onChange && newIndex !== currentPost) {
        onChange(newIndex);
      }
    },
    [totalPosts, currentPost, onChange],
  );

  // 处理拖拽结束
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  // 点击轨道跳转
  const handleTrackClick = (e: React.MouseEvent) => {
    if (!scrollAreaRef.current) return;
    const rect = scrollAreaRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;

    // 居中逻辑：点击位置即为滑块中心
    const centerOffset = SCROLLER_HEIGHT / 2;
    const targetTop = clickY - centerOffset;

    const availableH = SCROLL_AREA_HEIGHT - SCROLLER_HEIGHT;
    let newPercentage = targetTop / availableH;
    newPercentage = Math.max(0, Math.min(1, newPercentage));

    setPercentage(newPercentage);
    const newIndex = Math.round(newPercentage * (totalPosts - 1)) + 1;
    if (onChange) onChange(newIndex);
  };

  // 模拟显示日期 - 根据进度变化
  // 实际项目中应根据 postStrema 数据获取
  const displayIndex = Math.round(percentage * (totalPosts - 1)) + 1;
  const displayDate =
    displayIndex === 1 ? startDate : displayIndex === totalPosts ? lastPostedAt : "May 10";

  // 颜色定义
  const trackColor = theme === "dark" ? "bg-[#0F82AF]" : "bg-[#0F82AF]"; // Discourse Blue
  const handleColor = theme === "dark" ? "bg-[#0F82AF]" : "bg-[#0F82AF]";

  return (
    <div className={cn("sticky top-20 ml-8 hidden w-[140px] shrink-0 lg:block", className)}>
      {/* 顶部日期 (跳转到第一条) */}
      <div
        className="mb-2 ml-10 cursor-pointer text-center text-[13px] text-[#919191]"
        onClick={() => {
          setPercentage(0);
          onChange?.(1);
        }}
      >
        {startDate}
      </div>

      {/* 滚动区域 */}
      <div
        ref={scrollAreaRef}
        className="relative ml-10 select-none"
        style={{ height: SCROLL_AREA_HEIGHT }}
      >
        {/* 点击区域 (透明背景，便于点击) */}
        <div className="absolute inset-0 z-0 cursor-pointer" onClick={handleTrackClick} />

        {/* 轨道 (Line) */}
        <div
          className={cn(
            "absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 opacity-30",
            trackColor,
          )}
        ></div>

        {/* 滑块 (Scroller) */}
        <div
          className={cn(
            "absolute right-0 left-0 z-10 cursor-grab active:cursor-grabbing",
            "flex flex-col items-center justify-center transition-transform duration-75 ease-out",
            isDragging && "scale-105",
          )}
          style={{
            height: SCROLLER_HEIGHT,
            top: topPosition,
            // 简单防抖动
            transform: isDragging ? "none" : undefined,
          }}
          onMouseDown={handleMouseDown}
        >
          {/* 原点/Handle */}
          <div className={cn("h-4 w-1.5 rounded-full shadow-sm", handleColor)}></div>

          {/* 悬浮信息 (Discourse 样式: 右侧显示 5/28) */}
          <div className="absolute top-1/2 left-[calc(50%+8px)] flex -translate-y-1/2 flex-col pl-2 whitespace-nowrap">
            <span className="text-[15px] font-bold text-[#DDDDDD] dark:text-neutral-100">
              {currentPost}/{totalPosts}
            </span>
            <span className="text-[13px] text-[#919191]">{displayDate}</span>
          </div>
        </div>
      </div>

      {/* 底部日期 (跳转到最后) */}
      <div
        className="mt-2 ml-10 cursor-pointer text-center text-[13px] text-[#919191]"
        onClick={() => {
          setPercentage(1);
          onChange?.(totalPosts);
        }}
      >
        {lastPostedAt}
      </div>
    </div>
  );
};
