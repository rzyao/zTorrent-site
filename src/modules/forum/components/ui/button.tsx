import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react"; // Import Loader for loading state

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-3 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // === New Semantic Variants ===
        primary:
          "bg-[#0088CC] text-white shadow-sm hover:bg-[#0077B3] focus-visible:ring-[#0088CC]",
        cancel:
          "text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-700",
        danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-500",

        // === Legacy/Standard Variants (Keep for compatibility) ===
        default:
          "border border-neutral-200 bg-white text-gray-600 hover:bg-[#F3F4F6] focus-visible:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700",
        destructive:
          "text-neutral-900 hover:bg-red-50 hover:text-red-600 focus-visible:ring-red-500 dark:text-neutral-100 dark:hover:bg-red-900/20 dark:hover:text-red-400",

        // No style
        none: "",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
        none: "",
      },
      // 点击动画效果
      animation: {
        none: "", // 无动画
        ripple: "overflow-hidden", // 涟漪效果（需要 overflow-hidden 裁剪）
        bounce: "", // 微弹跳 + ping 波纹（照抄 ToggleButton）
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  },
);

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, loading, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // Ripple State (for animation="ripple")
    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    // Bounce animation state (for animation="bounce", 照抄 ToggleButton)
    const [showBounce, setShowBounce] = React.useState(false);
    const localRef = React.useRef<HTMLButtonElement>(null);

    // Combine refs
    const combinedRef = (node: HTMLButtonElement) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    };

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = localRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple = { id: Date.now(), x, y, size };
      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || props.disabled) return;

      // 根据 animation 类型触发不同效果
      if (animation === "ripple" || variant === "primary") {
        createRipple(e);
      }
      if (animation === "bounce") {
        // 照抄 ToggleButton: 触发微弹跳 + ping 波纹
        setShowBounce(true);
        setTimeout(() => setShowBounce(false), 500);
      }

      props.onClick?.(e);
    };

    return (
      <Comp
        data-slot="button"
        className={cn(
          buttonVariants({
            variant: variant === null ? "none" : variant,
            size: size === null ? "none" : size,
            animation,
            className,
          }),
          loading && "cursor-not-allowed opacity-70",
          // 照抄 ToggleButton: showAnimation && !isDisabled && "animate-bounce-subtle"
          showBounce && !loading && !props.disabled && "animate-bounce-subtle",
          // Primary 变体自动启用 ripple，需要 overflow-hidden
          variant === "primary" && animation !== "bounce" && "overflow-hidden",
        )}
        {...props}
        ref={combinedRef}
        onClick={handleClick}
        disabled={loading || props.disabled}
      >
        {asChild ? (
          props.children
        ) : (
          <>
            {/* Ripple Effect Layer */}
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

            {/* Bounce 动画: Ping 波纹特效 (照抄 ToggleButton) */}
            {showBounce && (
              <span className="pointer-events-none absolute inset-0 animate-ping rounded-[inherit] border-2 border-current opacity-40" />
            )}

            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {props.children}

            {/* 注入动画样式 */}
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
                  @keyframes ripple {
                    from { transform: scale(0); opacity: 1; }
                    to { transform: scale(4); opacity: 0; }
                  }
                  .animate-ripple {
                    animation: ripple 600ms linear forwards;
                  }
                `,
              }}
            />
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
