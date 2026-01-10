import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // AntD 基础样式: h-8, rounded-md, border-[#d9d9d9], text-color
          "flex h-8 w-full rounded-md border border-[#d9d9d9] bg-white px-3 py-1 text-sm text-[rgba(0,0,0,0.88)] transition-all duration-200",
          // Placeholder 颜色
          "placeholder:text-[rgba(0,0,0,0.25)]",
          // File input 样式 (保持 Shadcn 默认)
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          // Hover 状态: border-[#4096ff]
          "hover:border-[#4096ff]",
          // Focus 状态: border-[#1677ff] + ring
          "focus:border-[#1677ff] focus:ring-2 focus:ring-[rgba(5,145,255,0.1)] focus:outline-none",
          // Disabled 状态
          "disabled:cursor-not-allowed disabled:bg-[rgba(0,0,0,0.04)] disabled:text-[rgba(0,0,0,0.25)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
