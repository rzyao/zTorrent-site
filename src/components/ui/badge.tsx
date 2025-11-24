import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      color: {
        primary:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        green:
          "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        yellow:
          "border-transparent bg-yellow-500 text-white [a&]:hover:bg-yellow-600",
        blue:
          "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
        purple:
          "border-transparent bg-purple-500 text-white [a&]:hover:bg-purple-600",
        pink:
          "border-transparent bg-pink-500 text-white [a&]:hover:bg-pink-600",
        gray:
          "border-transparent bg-gray-500 text-white [a&]:hover:bg-gray-600",
        red:
          "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",
        orange:
          "border-transparent bg-orange-500 text-white [a&]:hover:bg-orange-600",
        indigo:
          "border-transparent bg-indigo-500 text-white [a&]:hover:bg-indigo-600",
        teal:
          "border-transparent bg-teal-500 text-white [a&]:hover:bg-teal-600",
        cyan:
          "border-transparent bg-cyan-500 text-white [a&]:hover:bg-cyan-600",
      },
      outline: {
        true: "border-white text-white bg-transparent hover:bg-white/10",
        false: "",
      },
      border: {
        white: "border-white",
        gray: "border-gray-300",
        blue: "border-blue-500",
        green: "border-green-500",
        red: "border-red-500",
        yellow: "border-yellow-500",
        purple: "border-purple-500",
        pink: "border-pink-500",
        none: "",
      },
      size: {
        xs: "px-1 py-0 text-[10px] rounded-sm",
        sm: "px-1.5 py-0.5 text-xs",
        default: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      color: "primary",
      outline: false,
      border: "none",
      size: "default",
      shape: "default",
    },
  },
);

function Badge({
  className,
  color,
  outline = false,
  border = "none",
  size,
  shape,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean; outline?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ color, outline, border, size, shape }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
