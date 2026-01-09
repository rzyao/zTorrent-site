import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/cn";
import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";

/**
 * ActionBtn 变体配置
 * 支持多种颜色主题 (variant)、显示模式 (mode) 和尺寸 (size)
 */
export const actionBtnVariants = cva(
  cn(
    "inline-flex cursor-pointer items-center justify-center gap-2",
    "rounded-full leading-none font-medium",
    // 添加 transform 过渡，让状态切换更平滑
    "transition-transform duration-150",
    // hover 上浮，active 时按下，默认状态 translate-y-0 确保初始位置稳定
    "translate-y-0 hover:-translate-y-[2px] active:translate-y-[3px]",
    // 移除 focus 时的默认 outline
    "focus:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
  ),
  {
    variants: {
      variant: {
        blue: "",
        red: "",
        green: "",
        amber: "",
        purple: "",
        pink: "",
        indigo: "",
        cyan: "",
        teal: "",
        neutral: "",
        slate: "",
      },
      mode: {
        solid: "border border-solid px-4 py-2 text-white shadow-lg",
        ghost:
          "border border-solid border-transparent bg-gray-700/40 px-4 py-2 shadow-none backdrop-blur-md hover:bg-gray-700/60",
      },
      size: {
        default: "h-8 text-base",
        sm: "h-8 px-0 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-4 text-lg",
        icon: "h-10 w-10 px-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    compoundVariants: [
      // Amber
      {
        variant: "amber",
        mode: "solid",
        className: "border-amber-400 bg-amber-400 hover:bg-amber-500",
      },
      { variant: "amber", mode: "ghost", className: "text-amber-400" },
      // Blue
      {
        variant: "blue",
        mode: "solid",
        className: "border-blue-500 bg-blue-500/75 shadow-blue-500/30 hover:bg-blue-600/80",
      },
      { variant: "blue", mode: "ghost", className: "text-blue-300" },
      // Green
      {
        variant: "green",
        mode: "solid",
        className: "border-green-500 bg-green-500 shadow-green-500/30 hover:bg-green-600",
      },
      { variant: "green", mode: "ghost", className: "text-green-300" },
      // Red
      {
        variant: "red",
        mode: "solid",
        className: "border-red-500 bg-red-500/75 shadow-red-500/30 hover:bg-red-600/80",
      },
      { variant: "red", mode: "ghost", className: "text-red-300" },
      // Purple
      {
        variant: "purple",
        mode: "solid",
        className: "border-purple-500 bg-purple-500/75 shadow-purple-500/30 hover:bg-purple-600/80",
      },
      { variant: "purple", mode: "ghost", className: "text-purple-300" },
      // Pink
      {
        variant: "pink",
        mode: "solid",
        className: "border-pink-500 bg-pink-500/75 shadow-pink-500/30 hover:bg-pink-600/80",
      },
      { variant: "pink", mode: "ghost", className: "text-pink-300" },
      // Indigo
      {
        variant: "indigo",
        mode: "solid",
        className: "border-indigo-500 bg-indigo-500/75 shadow-indigo-500/30 hover:bg-indigo-600/80",
      },
      { variant: "indigo", mode: "ghost", className: "text-indigo-300" },
      // Cyan
      {
        variant: "cyan",
        mode: "solid",
        className: "border-cyan-500 bg-cyan-500/75 shadow-cyan-500/30 hover:bg-cyan-600/80",
      },
      { variant: "cyan", mode: "ghost", className: "text-cyan-300" },
      // Teal
      {
        variant: "teal",
        mode: "solid",
        className: "border-teal-500 bg-teal-500/75 shadow-teal-500/30 hover:bg-teal-600/80",
      },
      { variant: "teal", mode: "ghost", className: "text-teal-300" },
      // Neutral
      {
        variant: "neutral",
        mode: "solid",
        className:
          "border-neutral-500 bg-neutral-600/75 text-gray-100 shadow-neutral-500/30 hover:bg-neutral-700/80",
      },
      { variant: "neutral", mode: "ghost", className: "text-neutral-300" },
      // Slate
      {
        variant: "slate",
        mode: "solid",
        className:
          "border-slate-500 bg-slate-600/75 text-gray-200 shadow-slate-500/30 hover:bg-slate-700/80",
      },
      { variant: "slate", mode: "ghost", className: "text-slate-300" },
    ],
    defaultVariants: {
      variant: "blue",
      mode: "solid",
      size: "default",
      fullWidth: false,
    },
  },
);

/**
 * Loader 尺寸映射 - 根据按钮 size 动态调整加载图标大小
 */
const loaderSizeMap: Record<string, string> = {
  default: "h-4 w-4",
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  icon: "h-5 w-5",
};

export interface ActionBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof actionBtnVariants> {
  /** 将样式和行为委托给子元素 (需要子元素支持 ref 和 className 合并) */
  asChild?: boolean;
  /** 加载状态 - 显示加载动画并禁用交互 */
  loading?: boolean;
  /** 前置图标 */
  icon?: React.ReactNode;
}

/**
 * ActionBtn - 高可定制的操作按钮组件
 *
 * 特性:
 * - 多种颜色主题 (variant) 和显示模式 (mode)
 * - 支持 asChild 模式 (通过 Radix Slot 委托渲染)
 * - 完善的无障碍支持 (aria-busy, aria-disabled)
 * - 加载状态视觉反馈
 *
 * @example
 * // 基础用法
 * <ActionBtn variant="blue" mode="solid">点击我</ActionBtn>
 *
 * // 带图标和加载状态
 * <ActionBtn icon={<Star />} loading={isLoading}>收藏</ActionBtn>
 *
 * // asChild 模式 - 渲染为 Link
 * <ActionBtn asChild variant="green">
 *   <Link to="/home">前往首页</Link>
 * </ActionBtn>
 */
const ActionBtn = React.forwardRef<HTMLButtonElement, ActionBtnProps>(
  (
    {
      className,
      variant,
      mode,
      size,
      fullWidth,
      loading,
      icon,
      children,
      disabled,
      asChild = false,
      type = "button", // 默认 type="button" 避免在表单中意外触发 submit
      ...props
    },
    ref,
  ) => {
    // pressing 状态：填补 active→loading 的空隙
    const [pressing, setPressing] = useState(false);

    // loading 结束时重置 pressing
    useEffect(() => {
      if (!loading) {
        setPressing(false);
      }
    }, [loading]);

    // 鼠标按下时设置 pressing
    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !loading) {
        setPressing(true);
      }
      props.onMouseDown?.(e);
    };

    // 根据 asChild 决定渲染 Slot 还是原生 button
    const Comp = asChild ? Slot : "button";

    // 计算实际禁用状态
    const isDisabled = disabled || loading;

    // 是否显示按下状态：pressing 或 loading 时都保持按下
    const isPressed = pressing || loading;

    // 获取对应尺寸的 Loader 样式
    const loaderSize = loaderSizeMap[size ?? "default"];

    // 渲染按钮内容 (图标 + 文本)
    // 方案A: 图标替换模式 - 加载时仅将 icon 替换为 Spinner，文本保留可见
    const renderContent = () => (
      <div className="flex items-center justify-center gap-2">
        {/* 图标区域: 加载时显示 Spinner，否则显示原 icon */}
        {loading ? <Loader className={cn(loaderSize, "animate-spin")} /> : icon}
        {/* 文本内容始终可见 */}
        {children}
      </div>
    );

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type} // asChild 模式不设置 type
        className={cn(
          actionBtnVariants({ variant, mode, size, fullWidth, className }),
          loading && "pointer-events-none", // loading 时阻止交互
        )}
        disabled={disabled} // 只在真正 disabled 时设置
        aria-busy={loading ? true : undefined} // 无障碍: 通知屏幕阅读器正在加载
        aria-disabled={isDisabled ? true : undefined} // 无障碍: 显式声明禁用状态
        onMouseDown={handleMouseDown}
        {...props}
      >
        {renderContent()}
      </Comp>
    );
  },
);
ActionBtn.displayName = "ActionBtn";

export default ActionBtn;
