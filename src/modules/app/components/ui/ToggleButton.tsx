import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/modules/app/components/ui/tooltip";

const toggleButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-full border border-solid border-transparent leading-none font-medium backdrop-blur-sm transition-all duration-150",
  {
    variants: {
      size: {
        sm: "h-8 min-w-8 px-3 text-xs",
        md: "h-9 min-w-9 px-4 text-sm",
        lg: "h-12 min-w-12 px-6 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

interface ToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof toggleButtonVariants> {
  /** 按钮是否处于激活（选中）状态 */
  pressed?: boolean;
  /** 状态切换时的回调 */
  onPressedChange?: (pressed: boolean) => void;
  /** 激活状态下显示的图标或内容 */
  activeIcon: React.ReactNode;
  /** 未激活状态下显示的图标或内容 */
  inactiveIcon: React.ReactNode;
  /** 激活状态下的额外样式名 */
  activeClassName?: string;
  /** 未激活状态下的额外样式名 */
  inactiveClassName?: string;
  /** 悬浮提示文本 */
  tooltip?: string;
  /** 是否处于加载状态 */
  isLoading?: boolean;
}

/**
 * ToggleButton 通用切换按钮组件
 * 适用于收藏、点赞、关注等需要两种视觉状态切换的场景
 */

export function ToggleButton({
  pressed,
  onPressedChange,
  activeIcon,
  inactiveIcon,
  activeClassName = "bg-purple-500/80 text-white",
  inactiveClassName = "bg-black/60 text-neutral-400 hover:bg-black/80 hover:text-white",
  className,
  size,
  tooltip,
  children,
  onClick,
  isLoading,
  disabled,
  ...props
}: ToggleButtonProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const isDisabled = disabled || isLoading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 如果正在加载或被禁用，直接返回
    if (isDisabled) return;

    // 阻止冒泡，避免触发父元素的点击事件（如卡片跳转）
    e.stopPropagation();

    const nextPressed = !pressed;
    onPressedChange?.(nextPressed);

    // 如果是变为激活状态，触发动画
    if (nextPressed) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 500);
    }

    onClick?.(e);
  };

  // 根据 size 调整 icon 尺寸类名
  const iconSizeClass = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  const button = (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        toggleButtonVariants({ size }),
        // 加载或禁用状态下：降低透明度，禁用指针事件，移除按下缩放效果
        isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer active:scale-95",
        pressed ? activeClassName : inactiveClassName,
        showAnimation && !isDisabled && "animate-bounce-subtle",
        className,
      )}
      aria-pressed={pressed}
      aria-busy={isLoading}
      {...props}
    >
      {/* 状态图标区域：优先显示 Loading，否则显示状态图标 */}
      {isLoading ? (
        <Loader2 className={cn("animate-spin", iconSizeClass)} />
      ) : pressed ? (
        activeIcon
      ) : (
        inactiveIcon
      )}

      {/* 文本内容 */}
      {children}

      {/* 成功确认波纹特效 */}
      {showAnimation && (
        <span className="pointer-events-none absolute inset-0 animate-ping rounded-[inherit] border-2 border-current opacity-40" />
      )}

      {/* 注入局部样式用于微动画 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 0.4s ease-out;
        }
      `,
        }}
      />
    </button>
  );

  if (!tooltip) return button;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
