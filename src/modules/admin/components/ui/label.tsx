import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const labelVariants = cva(
  "inline-flex items-center font-medium text-neutral-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      size: {
        default: "text-sm",
        sm: "text-[12px]",
        small: "text-[12px]",
        lg: "text-base",
        large: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface LabelProps
  extends
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, required, size, children, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ size }), className)} {...props}>
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </LabelPrimitive.Root>
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
