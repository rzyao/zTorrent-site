import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "focus-visible:border-antd-primary focus-visible:ring-antd-primary flex min-h-[80px] w-full rounded-[6px] border border-gray-200 bg-white px-3 py-2 text-sm transition-all duration-200 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-neutral-300",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
