import * as React from "react";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-1 text-sm text-[rgba(0,0,0,0.88)] transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[rgba(0,0,0,0.25)] hover:border-[#4096ff] focus:border-[#1677ff] focus:ring-2 focus:ring-[rgba(5,145,255,0.1)] focus:outline-none disabled:cursor-not-allowed disabled:bg-[rgba(0,0,0,0.04)] disabled:text-[rgba(0,0,0,0.25)]",
  {
    variants: {
      sz: {
        sm: "h-6 text-xs",
        md: "h-8 text-sm",
        lg: "h-10 text-base",
      },
    },
    defaultVariants: {
      sz: "md",
    },
  },
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  // 我们使用 sz 避免与原生 size (number) 冲突，或者在页面中改写调用处
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, sz, ...props }, ref) => {
    return (
      <input type={type} className={cn(inputVariants({ sz, className }))} ref={ref} {...props} />
    );
  },
);
Input.displayName = "Input";

export { Input };
