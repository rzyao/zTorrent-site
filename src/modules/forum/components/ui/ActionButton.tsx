import React, { useState, useRef, ComponentProps } from "react";
import { LucideIcon, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const actionButtonVariants = cva(
  "relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg text-sm shadow-md transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 active:shadow-sm disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      color: {
        indigo:
          "bg-indigo-600 text-white shadow-indigo-900/20 hover:bg-indigo-700 focus-visible:ring-indigo-500",
        red: "bg-rose-600 text-white shadow-rose-900/20 hover:bg-rose-700 focus-visible:ring-rose-500",
        slate:
          "border border-slate-700 bg-slate-800 text-slate-200 shadow-black/20 hover:bg-slate-700 focus-visible:ring-slate-500",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20",
        // Custom Forum Color (#0088CC)
        custom:
          "bg-[#0088CC] text-white shadow-[#0088CC]/20 hover:bg-[#0077B3] focus-visible:ring-[#0088CC]",
        // Ghost Styles
        "ghost-slate":
          "bg-gray-700/40 text-neutral-300 hover:bg-gray-700/60 focus-visible:ring-gray-500",
        "ghost-blue":
          "border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 focus-visible:ring-blue-500",
        "ghost-red":
          "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 focus-visible:ring-red-500",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm", // Default
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      color: "custom",
      size: "md",
    },
  },
);

interface ActionButtonProps
  extends Omit<ComponentProps<"button">, "color">, VariantProps<typeof actionButtonVariants> {
  icon?: LucideIcon;
  loading?: boolean;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * ActionButton 组件 (Forum 版)
 *
 * 专为即时操作设计的按钮，包含 Material Design 风格的涟漪效果。
 * 适用于分享、举报、点赞等一次性操作场景。
 * 默认颜色调整为 #0088CC。
 */
export function ActionButton({
  onClick,
  children,
  className,
  icon: Icon,
  color,
  size,
  loading,
  disabled,
  ...props
}: ActionButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = { id: Date.now(), x, y, size };
    setRipples((prev) => [...prev, newRipple]);

    // 600ms 后清理 DOM 中的涟漪元素，需与 CSS 动画时长匹配
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    createRipple(e);
    onClick?.(e);
  };

  // 根据按钮尺寸调整图标大小
  const iconSizeClass = size === "sm" ? "size-3.5" : size === "lg" ? "size-5" : "size-4";

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        actionButtonVariants({ color, size, className }),
        loading && "cursor-not-allowed opacity-70",
      )}
      {...props}
    >
      {/* 涟漪层 (位于背景之上，文字之下) */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="animate-ripple pointer-events-none absolute rounded-full bg-white/30"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      {/* 内容层 (确保层级在涟漪之上) */}
      <div className="pointer-events-none relative z-10 flex items-center gap-2">
        {loading ? (
          <Loader2 className={cn("shrink-0 animate-spin", iconSizeClass)} />
        ) : Icon ? (
          <Icon className={cn("shrink-0", iconSizeClass)} />
        ) : null}
        {children}
      </div>
    </button>
  );
}
