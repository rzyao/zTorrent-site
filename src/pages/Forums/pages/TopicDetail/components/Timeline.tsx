import { useState, useRef, useEffect, useCallback } from "react";

import { cn } from "@/components/ui/utils";

interface TimelineProps {
  totalPosts?: number;
  currentPost?: number; // 1-based index
  scrollPercentage?: number; // 新增: 基于距离的滚动百分比
  startDate?: string;
  lastPostedAt?: string;
  colors?: any;
  className?: string;
  onChange?: (index: number) => void;
  onPercentageChange?: (percentage: number) => void;
  topicId?: string;
  topicTitle?: string;
  topicStatus?: {
    isLocked: boolean;
    isPinned: boolean;
    isArchived: boolean;
  };
  onTopicUpdate?: () => void;
}

import { Reply, Bell } from "lucide-react";
import { useComposerStore } from "../../../components/Composer/ComposerStore";
import { NotificationSelector } from "./NotificationSelector";
import { TopicAdminMenu } from "./TopicAdminMenu";

const SCROLLER_HEIGHT = 60; // 滚动滑块高度
const SCROLL_AREA_HEIGHT = 300; // 滚动区域总高度

export const Timeline = ({
  totalPosts = 28,
  currentPost = 1,
  scrollPercentage,
  startDate = "May '13",
  lastPostedAt = "Now",
  colors,
  className,
  onChange,
  onPercentageChange,
  topicId,
  topicTitle,
  topicStatus,
  onTopicUpdate,
}: TimelineProps) => {
  const [percentage, setPercentage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const startPercentage = useRef<number>(0);

  // 用于平滑滚动的引用
  const targetPercentage = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  // 平滑滚动动画（必须在 useEffect 之前定义）
  const animate = useCallback(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    setPercentage((prev) => {
      const next = lerp(prev, targetPercentage.current, 0.25); // 0.25 是平滑因子

      // 当差距极小时停止动画
      if (Math.abs(next - targetPercentage.current) < 0.001) {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
        return targetPercentage.current;
      }

      requestRef.current = requestAnimationFrame(animate);
      return next;
    });
  }, []);

  // 当页面滚动时，平滑更新滑块位置（优先使用 scrollPercentage）
  useEffect(() => {
    if (!isDragging) {
      // 优先使用基于距离的百分比（如果提供）
      const p =
        scrollPercentage !== undefined
          ? Math.max(0, Math.min(1, scrollPercentage))
          : totalPosts > 1
            ? Math.max(0, Math.min(1, (currentPost - 1) / (totalPosts - 1)))
            : 0;

      targetPercentage.current = p;

      // 启动平滑动画
      if (requestRef.current === null) {
        requestRef.current = requestAnimationFrame(animate);
      }
    }
  }, [scrollPercentage, currentPost, totalPosts, isDragging, animate]);

  // 处理拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    startPercentage.current = percentage;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // 处理移动 - 直接同步更新，无动画延迟
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!scrollAreaRef.current) return;

      const deltaY = e.clientY - dragStartY.current;
      const availableH = SCROLL_AREA_HEIGHT - SCROLLER_HEIGHT;
      const deltaPercentage = deltaY / availableH;

      let newPercentage = startPercentage.current + deltaPercentage;
      newPercentage = Math.max(0, Math.min(1, newPercentage));

      // 直接更新状态和页面滚动
      setPercentage(newPercentage);
      if (onPercentageChange) {
        onPercentageChange(newPercentage);
      }
    },
    [onPercentageChange],
  );

  // 处理拖拽结束
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    // 拖拽结束后更新帖子索引
    const newIndex = Math.round(percentage * (totalPosts - 1)) + 1;
    if (onChange) onChange(newIndex);
  }, [handleMouseMove, percentage, totalPosts, onChange]);

  // 点击轨道跳转
  const handleTrackClick = (e: React.MouseEvent) => {
    if (!scrollAreaRef.current) return;
    const rect = scrollAreaRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;

    const centerOffset = SCROLLER_HEIGHT / 2;
    const targetTop = clickY - centerOffset;

    const availableH = SCROLL_AREA_HEIGHT - SCROLLER_HEIGHT;
    let newPercentage = targetTop / availableH;
    newPercentage = Math.max(0, Math.min(1, newPercentage));

    // 更新内部状态
    targetPercentage.current = newPercentage;
    setPercentage(newPercentage);

    // 通知父组件滚动页面
    if (onPercentageChange) {
      onPercentageChange(newPercentage);
    }

    // 动画更新滑块位置
    if (requestRef.current === null) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  // 模拟显示日期 - 根据进度变化
  const displayIndex = Math.round(percentage * (totalPosts - 1)) + 1;
  const displayDate =
    displayIndex === 1 ? startDate : displayIndex === totalPosts ? lastPostedAt : "May 10";

  // 颜色定义
  // 颜色定义
  const trackColor = "bg-[#0F82AF]"; // Discourse Blue
  const handleColor = "bg-[#0F82AF]";

  // 计算滑块位置
  const availableHeight = SCROLL_AREA_HEIGHT - SCROLLER_HEIGHT;
  const topPosition = percentage * availableHeight;

  return (
    <div className={cn("sticky top-20 ml-8 hidden w-[140px] shrink-0 lg:block", className)}>
      {/* 话题管理菜单 (仅管理员可见) - 放在时间轴顶部 */}
      {topicId && topicStatus && onTopicUpdate && (
        <div className="mb-4 ml-10 flex justify-center">
          <TopicAdminMenu topicId={topicId} status={topicStatus} onUpdate={onTopicUpdate} />
        </div>
      )}

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

        {/* 滑块 (Scroller) - 容器不阻止点击事件 */}
        <div
          className={cn(
            "pointer-events-none absolute right-0 left-0 z-10",
            "flex flex-col items-center justify-center",
            isDragging && "scale-105",
          )}
          style={{
            height: SCROLLER_HEIGHT,
            top: topPosition,
            // 简单防抖动
            transform: isDragging ? "none" : undefined,
          }}
        >
          {/* 原点/Handle - 只有这个可拖拽 */}
          <div
            className={cn(
              "pointer-events-auto h-10 w-1.5 cursor-grab rounded-full shadow-sm active:cursor-grabbing",
              handleColor,
            )}
            onMouseDown={handleMouseDown}
          ></div>

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

      {/* 底部操作按钮 */}
      <div className="mt-4 ml-10 flex items-center justify-center gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-[#0088CC] transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          onClick={() => {
            if (topicId) {
              useComposerStore.getState().open("REPLY", {
                replyToTopicId: topicId,
                replyToTitle: topicTitle,
              });
            }
          }}
          title="回复话题"
        >
          <Reply className="h-5 w-5" />
        </button>
        <NotificationSelector minimal />
      </div>
    </div>
  );
};
