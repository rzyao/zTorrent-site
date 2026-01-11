import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

/**
 * Tag 组件变体配置
 * 模仿 Ant Design Tag 的设计风格
 */
const tagVariants = cva(
  "inline-flex items-center rounded px-2 py-0.5 text-xs font-normal transition-colors",
  {
    variants: {
      variant: {
        default: "border border-gray-200 bg-gray-100 text-gray-600",
        primary: "border border-blue-200 bg-blue-50 text-blue-600",
        success: "border border-green-200 bg-green-50 text-green-600",
        warning: "border border-orange-200 bg-orange-50 text-orange-600",
        error: "border border-red-200 bg-red-50 text-red-600",
        purple: "border border-purple-200 bg-purple-50 text-purple-600",
        cyan: "border border-cyan-200 bg-cyan-50 text-cyan-600",
        magenta: "border border-pink-200 bg-pink-50 text-pink-600",
        gold: "border border-amber-200 bg-amber-50 text-amber-600",
        lime: "border border-lime-200 bg-lime-50 text-lime-600",
        // 兼容 antd color 属性
        blue: "border border-blue-200 bg-blue-50 text-blue-600",
        green: "border border-green-200 bg-green-50 text-green-600",
        red: "border border-red-200 bg-red-50 text-red-600",
        orange: "border border-orange-200 bg-orange-50 text-orange-600",
      },
      size: {
        sm: "px-1.5 py-0 text-[10px]",
        md: "px-2 py-0.5 text-xs",
        lg: "px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭回调 */
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
  /** 兼容 antd 的 color 属性 */
  color?: "blue" | "green" | "red" | "orange" | "default";
}

/**
 * Tag 标签组件
 *
 * 用于标记和分类，模仿 Ant Design Tag 的设计。
 *
 * @example
 * ```tsx
 * <Tag>默认标签</Tag>
 * <Tag variant="primary">主要标签</Tag>
 * <Tag variant="success">成功标签</Tag>
 * <Tag color="blue">蓝色标签</Tag>
 * ```
 */
export function Tag({
  className,
  variant,
  size,
  closable,
  onClose,
  color,
  children,
  ...props
}: TagProps) {
  // 如果使用 color 属性，转换为 variant
  const effectiveVariant = color ? (color as typeof variant) : variant;

  return (
    <span className={cn(tagVariants({ variant: effectiveVariant, size }), className)} {...props}>
      {children}
      {closable && (
        <button
          type="button"
          className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full hover:bg-black/10"
          onClick={onClose}
          aria-label="关闭"
        >
          <svg className="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

export { tagVariants };
export default Tag;
