import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/utils";
import React from "react";
import { Loader2 } from "lucide-react";

export const actionBtnVariants = cva(
  cn(
    "inline-flex cursor-pointer items-center justify-center gap-2",
    "rounded-full font-medium transition-all duration-300",
    "hover:-translate-y-[1px] active:translate-y-[2px]",
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
        solid: "border-b-[2px] px-2 py-2 text-white shadow-lg",
        ghost:
          "border border-transparent bg-gray-700/40 px-2 py-2 backdrop-blur-md hover:bg-gray-700/60",
      },
      size: {
        default: "h-8 text-base",
        sm: "h-8 px-0 text-sm",
        md: "h-10 px-2 text-base",
        lg: "h-12 px-2 text-lg",
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
        className:
          "border-amber-500 bg-linear-to-r from-amber-500 to-orange-500 shadow-amber-500/30 hover:border-b-[4px] hover:from-amber-600 hover:to-orange-600 active:border-b-[2px]",
      },
      { variant: "amber", mode: "ghost", className: "text-amber-300" },
      // Blue
      {
        variant: "blue",
        mode: "solid",
        className:
          "border-blue-500 bg-linear-to-r from-blue-500 to-indigo-500 shadow-blue-500/30 hover:border-b-[4px] hover:from-blue-600 hover:to-indigo-600 active:border-b-[2px]",
      },
      { variant: "blue", mode: "ghost", className: "text-blue-300" },
      // Green
      {
        variant: "green",
        mode: "solid",
        className:
          "border-green-500 bg-linear-to-r from-green-500 to-emerald-500 shadow-green-500/30 hover:border-b-[4px] hover:from-green-600 hover:to-emerald-600 active:border-b-[2px]",
      },
      { variant: "green", mode: "ghost", className: "text-green-300" },
      // Red
      {
        variant: "red",
        mode: "solid",
        className:
          "border-red-500 bg-linear-to-r from-red-500 to-rose-500 shadow-red-500/30 hover:border-b-[4px] hover:from-red-600 hover:to-rose-600 active:border-b-[2px]",
      },
      { variant: "red", mode: "ghost", className: "text-red-300" },
      // Purple
      {
        variant: "purple",
        mode: "solid",
        className:
          "border-purple-500 bg-linear-to-r from-purple-500 to-violet-500 shadow-purple-500/30 hover:border-b-[4px] hover:from-purple-600 hover:to-violet-600 active:border-b-[2px]",
      },
      { variant: "purple", mode: "ghost", className: "text-purple-300" },
      // Pink
      {
        variant: "pink",
        mode: "solid",
        className:
          "border-pink-500 bg-linear-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:border-b-[4px] hover:from-pink-600 hover:to-rose-600 active:border-b-[2px]",
      },
      { variant: "pink", mode: "ghost", className: "text-pink-300" },
      // Indigo
      {
        variant: "indigo",
        mode: "solid",
        className:
          "border-indigo-500 bg-linear-to-r from-indigo-500 to-blue-600 shadow-indigo-500/30 hover:border-b-[4px] hover:from-indigo-600 hover:to-blue-700 active:border-b-[2px]",
      },
      { variant: "indigo", mode: "ghost", className: "text-indigo-300" },
      // Cyan
      {
        variant: "cyan",
        mode: "solid",
        className:
          "border-cyan-500 bg-linear-to-r from-cyan-500 to-blue-500 shadow-cyan-500/30 hover:border-b-[4px] hover:from-cyan-600 hover:to-blue-600 active:border-b-[2px]",
      },
      { variant: "cyan", mode: "ghost", className: "text-cyan-300" },
      // Teal
      {
        variant: "teal",
        mode: "solid",
        className:
          "border-teal-500 bg-linear-to-r from-teal-500 to-emerald-500 shadow-teal-500/30 hover:border-b-[4px] hover:from-teal-600 hover:to-emerald-600 active:border-b-[2px]",
      },
      { variant: "teal", mode: "ghost", className: "text-teal-300" },
      // Neutral
      {
        variant: "neutral",
        mode: "solid",
        className:
          "border-neutral-500 bg-linear-to-r from-neutral-600 to-neutral-700 text-gray-100 shadow-neutral-500/30 hover:border-b-[4px] hover:from-neutral-700 hover:to-neutral-800 active:border-b-[2px]",
      },
      { variant: "neutral", mode: "ghost", className: "text-neutral-300" },
      // Slate
      {
        variant: "slate",
        mode: "solid",
        className:
          "border-slate-500 bg-linear-to-r from-slate-600 to-slate-700 text-gray-200 shadow-slate-500/30 hover:border-b-[4px] hover:from-slate-700 hover:to-slate-800 active:border-b-[2px]",
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

export interface ActionBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof actionBtnVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const ActionBtn = React.forwardRef<HTMLButtonElement, ActionBtnProps>(
  (
    { className, variant, mode, size, fullWidth, loading, icon, children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(actionBtnVariants({ variant, mode, size, fullWidth, className }))}
        disabled={disabled || loading}
        {...props}
      >
        <div className="relative flex items-center justify-center gap-2">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          <div
            className={cn(
              "flex items-center gap-2 transition-opacity",
              loading ? "opacity-0" : "opacity-100",
            )}
          >
            {icon}
            {children}
          </div>
        </div>
      </button>
    );
  },
);
ActionBtn.displayName = "ActionBtn";

export default ActionBtn;
