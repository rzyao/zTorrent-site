import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[6px] text-sm font-normal shadow-sm transition-all duration-200 focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-antd-primary hover:bg-antd-primary-hover focus-visible:ring-antd-primary active:bg-antd-primary-active border border-transparent text-white shadow-[0_2px_0_rgba(5,5,5,0.06)]",
        default:
          "hover:border-antd-primary hover:text-antd-primary active:border-antd-primary-active active:text-antd-primary-active border border-gray-200 bg-white text-neutral-900",
        dashed:
          "hover:border-antd-primary hover:text-antd-primary active:border-antd-primary-active active:text-antd-primary-active border border-dashed border-gray-200 bg-white text-neutral-900",
        text: "border-transparent bg-transparent text-neutral-900 shadow-none hover:bg-black/5",
        link: "text-antd-primary hover:text-antd-primary-hover border-transparent bg-transparent underline-offset-4 shadow-none hover:underline",
        danger:
          "text-antd-error hover:border-antd-error-hover hover:text-antd-error-hover active:border-antd-error active:text-antd-error border border-gray-200 bg-white",
      },
      size: {
        sm: "h-6 px-2 text-xs",
        md: "h-8 px-[15px] text-sm",
        lg: "h-10 px-[15px] text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
