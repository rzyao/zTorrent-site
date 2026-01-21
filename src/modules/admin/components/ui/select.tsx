import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, X } from "lucide-react";

import { cn } from "@/utils/cn";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // 基础布局与尺寸: h-8 (32px), flex center, full width, cursor-pointer
      "flex h-8 w-full cursor-pointer items-center justify-between",
      // 边框与圆角: border-[#d9d9d9], rounded-md (6px)
      "rounded-md border border-[#d9d9d9] bg-white px-3 py-1",
      // 排版: text-[rgba(0,0,0,0.88)], text-sm
      "text-sm text-[rgba(0,0,0,0.88)] placeholder:text-[rgba(0,0,0,0.25)]",
      // 动画: transition-all duration-200
      "transition-all duration-200 ease-in-out",
      // 状态: Hover -> border-[#4096ff] (AntD Primary Hover)
      "hover:border-[#4096ff]",
      // 状态: Focus/Open -> border-[#1677ff] (AntD Primary) + Box Shadow (Ring)
      "focus:border-[#1677ff] focus:ring-2 focus:ring-[rgba(5,145,255,0.1)] focus:outline-none",
      "data-[state=open]:border-[#1677ff] data-[state=open]:ring-2 data-[state=open]:ring-[rgba(5,145,255,0.1)]",
      // 状态: Disabled
      "disabled:cursor-not-allowed disabled:bg-[rgba(0,0,0,0.04)] disabled:text-[rgba(0,0,0,0.25)]",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-3 w-3 text-[rgba(0,0,0,0.25)] opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4 text-[rgba(0,0,0,0.45)]" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4 text-[rgba(0,0,0,0.45)]" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal container={document.getElementById("root-admin")}>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-[300px] min-w-32 overflow-hidden rounded-lg bg-white text-[rgba(0,0,0,0.88)] shadow-[0_6px_16px_0_rgba(0,0,0,0.08),0_3px_6px_-4px_rgba(0,0,0,0.12),0_9px_28px_8px_rgba(0,0,0,0.05)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1", // p-1 = 4px padding
          position === "popper" &&
            "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-3 py-1.5 text-sm font-semibold text-[rgba(0,0,0,0.45)]", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // 基础: relative, flex, cursor-pointer, rounded (4px)
      "relative flex w-full cursor-pointer items-center rounded px-3 py-1.5 text-sm text-[rgba(0,0,0,0.88)] transition-colors outline-none select-none",
      // Hover 状态 (AntD uses background color change)
      "focus:bg-[rgba(0,0,0,0.04)]",
      // Selected 状态 (AntD: bg-primary-bg, font-weight: 600)
      "data-[state=checked]:bg-primary-bg data-[state=checked]:font-semibold data-[state=checked]:text-[rgba(0,0,0,0.88)]",
      // Disabled
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[rgba(0,0,0,0.06)]", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

interface StandardSelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  allowClear?: boolean;
  mode?: "multiple" | "default"; // 占位，当前只支持单选
}

/**
 * 封装后的标准 Select 组件，提供类似 Ant Design 的 options API
 */
const StandardSelect = React.forwardRef<HTMLButtonElement, StandardSelectProps>(
  (
    {
      options = [],
      placeholder,
      value,
      defaultValue,
      onValueChange,
      className,
      disabled,
      allowClear,
    },
    ref,
  ) => {
    const handleClear = (e: React.MouseEvent | React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onValueChange?.(undefined);
    };

    return (
      <Select
        value={value ?? ""}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className={cn("group relative", className)} ref={ref}>
          <SelectValue placeholder={placeholder} />
          {allowClear && value && !disabled && (
            <div
              role="button"
              className="absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-gray-200 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-300"
              onPointerDown={handleClear}
            >
              <X className="h-2.5 w-2.5 text-gray-400" />
            </div>
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
);
StandardSelect.displayName = "StandardSelect";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  StandardSelect, // 导出封装后的组件
};
