"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDown, ChevronUpIcon } from "lucide-react";

import { cn } from "@/utils/cn";

function Select({
  value,
  onValueChange,
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root> & {
  className?: string;
}) {
  // 包装 onValueChange，过滤 Radix Select BubbleInput 触发的空值重置
  const handleValueChange = (newValue: string) => {
    // 如果新值为空，但当前已有值，忽略这次调用
    if (newValue === "" && value && value !== "") {
      return;
    }
    onValueChange?.(newValue);
  };

  return (
    <SelectPrimitive.Root
      data-slot="select"
      value={value}
      onValueChange={handleValueChange}
      {...props}
    >
      <div className={cn("inline-flex", className)}>{children}</div>
    </SelectPrimitive.Root>
  );
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  hideChevron,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
  hideChevron?: boolean;
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground aria-invalid:border-destructive group flex w-full items-center justify-between gap-2 rounded-md border border-transparent bg-white px-3 py-2 text-sm whitespace-nowrap text-gray-700 transition-[color,border-color] outline-none hover:border-[#0088CC]/50 focus:border-[#0088CC] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 data-[state=open]:border-[#0088CC] dark:border-transparent dark:bg-neutral-900/50 dark:text-white dark:hover:border-[#0088CC]/50 dark:focus:border-[#0088CC] dark:data-[state=open]:border-[#0088CC] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      {!hideChevron && (
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="size-4 text-[#0088CC] transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </SelectPrimitive.Icon>
      )}
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          // 下拉内容区域：保留动画与定位，同时增加明确的深色背景与边框作为回退样式
          "text-popover-foreground data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 relative z-50 max-h-(--radix-select-content-available-height) min-w-32 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-[#262626] dark:text-neutral-200",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-2 pr-8 pl-3 text-sm outline-hidden transition-colors select-none",
        // 悬浮状态
        "hover:bg-[#0088CC]/10 hover:text-[#0088CC]",
        // 聚焦状态 (键盘导航)
        "focus:bg-[#0088CC]/10 focus:text-[#0088CC]",
        // 选中状态
        "data-[state=checked]:bg-[#0088CC]/15 data-[state=checked]:font-medium data-[state=checked]:text-[#0088CC]",
        // 禁用状态
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        // 深色模式
        "dark:hover:bg-[#0088CC]/20 dark:hover:text-[#0088CC]",
        "dark:focus:bg-[#0088CC]/20 dark:focus:text-[#0088CC]",
        "dark:data-[state=checked]:bg-[#0088CC]/25 dark:data-[state=checked]:text-[#0088CC]",
        // SVG 图标样式
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-[#0088CC]" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-pointer items-center justify-center py-1 text-[#0088CC] hover:bg-[#0088CC]/10",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-pointer items-center justify-center py-1 text-[#0088CC] hover:bg-[#0088CC]/10",
        className,
      )}
      {...props}
    >
      <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
