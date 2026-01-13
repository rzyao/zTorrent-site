import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

/**
 * Admin Button 组件 - 基于 Ant Design 5.x 规范
 *
 * 五种按钮类型：
 * 🔵 primary  - 主按钮：用于主行动点，一个操作区域只能有一个主按钮
 * ⚪ default  - 默认按钮：用于没有主次之分的一组行动点
 * 📦 dashed   - 虚线按钮：常用于添加操作
 * 📝 text     - 文本按钮：用于最次级的行动点
 * 🔗 link     - 链接按钮：一般用于链接，即导航至某位置
 *
 * 四种状态属性（与类型配合使用）：
 * ⚠️ danger   - 危险：删除/移动/修改权限等危险操作
 * 👻 ghost    - 幽灵：用于背景色比较复杂的地方
 * 🚫 disabled - 禁用：行动点不可用的时候
 * 🔃 loading  - 加载中：用于异步操作等待反馈
 */

const buttonVariants = cva(
  // 基础样式 + 默认中等尺寸 (32px)
  [
    "inline-flex cursor-pointer items-center justify-center whitespace-nowrap",
    "rounded-[6px] font-normal transition-all duration-200",
    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "h-8 px-[15px] text-[14px]", // 默认中等尺寸
  ],
  {
    variants: {
      variant: {
        // 🔵 主按钮：蓝色实心背景
        primary: [
          "bg-primary border border-transparent text-white",
          "shadow-[0_2px_0_rgba(5,5,5,0.06)]",
          "hover:bg-primary-hover",
          "active:bg-primary-active",
          "focus-visible:ring-primary",
        ],
        // ⚪ 默认按钮：白色背景 + 灰色边框
        default: [
          "border border-gray-300 bg-white text-neutral-900",
          "shadow-[0_2px_0_rgba(0,0,0,0.02)]",
          "hover:text-primary hover:border-primary",
          "active:text-primary-active active:border-primary-active",
          "focus-visible:ring-primary",
        ],
        // 📦 虚线按钮：白色背景 + 虚线边框
        dashed: [
          "border border-dashed border-gray-300 bg-white text-neutral-900",
          "hover:text-antd-primary hover:border-antd-primary",
          "active:text-antd-primary-active active:border-antd-primary-active",
          "focus-visible:ring-antd-primary",
        ],
        // 📝 文本按钮：无边框无背景，hover 时显示浅灰背景
        text: [
          "border-none bg-transparent text-neutral-900 shadow-none",
          "hover:bg-black/[0.06]",
          "active:bg-black/[0.15]",
        ],
        // 🔗 链接按钮：蓝色文字，无边框，无下划线
        link: [
          "text-primary border-none bg-transparent shadow-none",
          "hover:text-primary-hover",
          "active:text-primary-active",
          "h-auto p-0", // 链接按钮无内边距，高度自适应
        ],
      },
      size: {
        small: "h-6 px-[7px] text-[14px]", // 小号：24px 高度
        large: "h-10 px-[15px] text-[16px]", // 大号：40px 高度
      },
      // ⚠️ 危险状态
      danger: {
        true: "",
        false: "",
      },
      // 👻 幽灵状态
      ghost: {
        true: "",
        false: "",
      },
    },
    // 复合变体：danger + variant 组合
    compoundVariants: [
      // ⚠️ 危险主按钮：红色实心背景
      {
        variant: "primary",
        danger: true,
        className: [
          "bg-error border-error",
          "hover:bg-error/90 hover:border-error/90",
          "active:bg-error/80 active:border-error/80",
          "focus-visible:ring-error",
        ],
      },
      // ⚠️ 危险默认按钮：红色边框文字
      {
        variant: "default",
        danger: true,
        className: [
          "text-error border-error",
          "hover:text-error/80 hover:border-error/80",
          "active:text-error/70 active:border-error/70",
          "focus-visible:ring-error",
        ],
      },
      // ⚠️ 危险虚线按钮
      {
        variant: "dashed",
        danger: true,
        className: [
          "text-error border-error",
          "hover:text-error/80 hover:border-error/80",
          "active:text-error/70 active:border-error/70",
        ],
      },
      // ⚠️ 危险文本按钮
      {
        variant: "text",
        danger: true,
        className: [
          "text-error",
          "hover:text-error/80 hover:bg-error/5",
          "active:text-error/70 active:bg-error/10",
        ],
      },
      // ⚠️ 危险链接按钮
      {
        variant: "link",
        danger: true,
        className: "!text-error hover:!text-error-hover active:!text-error-active",
      },
      // 👻 幽灵主按钮：透明背景 + 蓝色边框文字
      {
        variant: "primary",
        ghost: true,
        className: [
          "text-primary border-primary bg-transparent",
          "hover:text-primary-hover hover:border-primary-hover",
          "active:text-primary-active active:border-primary-active",
        ],
      },
      // 👻 幽灵默认按钮：透明背景 + 白色边框文字
      {
        variant: "default",
        ghost: true,
        className: [
          "border-white bg-transparent text-white",
          "hover:text-primary hover:border-primary",
        ],
      },
      // 👻 幽灵危险按钮
      {
        variant: "primary",
        danger: true,
        ghost: true,
        className: [
          "text-error border-error bg-transparent",
          "hover:text-error/80 hover:border-error/80",
        ],
      },
    ],
    defaultVariants: {
      variant: "default",
      danger: false,
      ghost: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** 是否作为子组件渲染（用于 Link 等）*/
  asChild?: boolean;
  /** 🔃 是否显示加载状态 */
  loading?: boolean;
  /** 按钮图标（放在文字前面）*/
  icon?: React.ReactNode;
}

/**
 * Button 按钮组件
 *
 * 尺寸规范（与 Ant Design 一致）：
 * - large: 大号按钮 (40px 高度)
 * - 默认: 中号按钮 (32px 高度) - 不设置 size 时的默认值
 * - small: 小号按钮 (24px 高度)
 *
 * @example
 * ```tsx
 * // 主按钮
 * <Button variant="primary">提交</Button>
 *
 * // 默认按钮
 * <Button>取消</Button>
 *
 * // 大号按钮
 * <Button size="large" variant="primary">大按钮</Button>
 *
 * // 小号按钮
 * <Button size="small">小按钮</Button>
 *
 * // 虚线按钮（添加操作）
 * <Button variant="dashed" icon={<Plus />}>添加</Button>
 *
 * // 文本按钮
 * <Button variant="text">更多</Button>
 *
 * // 链接按钮（表格操作列）
 * <Button variant="link">编辑</Button>
 *
 * // 危险按钮
 * <Button danger>删除</Button>
 * <Button variant="primary" danger>确认删除</Button>
 *
 * // 幽灵按钮（用于深色背景）
 * <Button variant="primary" ghost>幽灵按钮</Button>
 *
 * // 加载中
 * <Button variant="primary" loading>提交中...</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, danger, ghost, asChild = false, loading, icon, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isLink = variant === "link";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size: isLink ? undefined : size, danger, ghost, className }),
        )}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && icon && <span className="mr-1.5">{icon}</span>}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
