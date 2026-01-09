import { ReactNode } from "react";
import { ArrowUpDown } from "lucide-react";
import { NativeSelect, type SelectOption } from "@/modules/app/components/ui/native-select";
import { cn } from "@/utils/cn";

export interface ResponsiveSortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** 移动端显示的图标，默认为 ArrowUpDown */
  mobileIcon?: ReactNode;
  /** 桌面端显示的占位符，默认为 "选择排序方式" */
  desktopPlaceholder?: string;
  /** 自定义类名 */
  className?: string;
  /** 触发器按钮的自定义类名 */
  triggerClassName?: string;
}

/**
 * 响应式排序组件
 * - 移动端 (md:hidden): 仅显示图标
 * - 桌面端 (hidden md:block): 显示完整下拉框
 * - 统一使用 NativeSelect 作为底层实现
 */
export function ResponsiveSortSelect({
  value,
  onChange,
  options,
  mobileIcon,
  desktopPlaceholder = "选择排序方式",
  className,
  triggerClassName,
}: ResponsiveSortSelectProps) {
  return (
    <>
      {/* 移动端：仅图标模式 */}
      <NativeSelect
        value={value}
        onChange={onChange}
        options={options}
        variant="cyan"
        iconOnly
        icon={
          mobileIcon || <ArrowUpDown className="w-4 h-4" strokeWidth={1.75} />
        }
        className={cn("md:hidden", className)}
        triggerClassName={triggerClassName}
      />

      {/* 桌面端：完整下拉框 */}
      <NativeSelect
        value={value}
        onChange={onChange}
        options={options}
        placeholder={desktopPlaceholder}
        className={cn("hidden md:block w-[140px]", className)}
        variant="cyan"
        triggerClassName={cn(
          "rounded-xl h-[42px] text-neutral-300 border-neutral-700",
          triggerClassName
        )}
      />
    </>
  );
}
