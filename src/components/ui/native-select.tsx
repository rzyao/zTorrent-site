import { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface NativeSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  /** 主题色：amber（琥珀色，默认）或 cyan（青色） */
  variant?: "amber" | "cyan";
  /** 只显示图标模式（用于移动端紧凑显示） */
  iconOnly?: boolean;
  /** 自定义图标（iconOnly 模式下显示） */
  icon?: ReactNode;
}

/**
 * 自定义下拉选择组件
 * - 不使用 Portal，避免与 Modal 嵌套时的性能问题
 * - 完全可控的下拉列表样式（圆角、间距等）
 * - 箭头动画：展开时旋转 180°
 * - 支持 iconOnly 模式，移动端紧凑显示
 */
export function NativeSelect({
  value,
  onChange,
  options,
  placeholder = "请选择",
  className,
  triggerClassName,
  disabled = false,
  variant = "amber",
  iconOnly = false,
  icon,
}: NativeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ESC 关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const selectedOption = options.find((o) => o.value === value);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  // 根据 variant 设置颜色
  const colors = {
    amber: {
      focusBorder: "border-amber-500/50",
      focusRing: "ring-amber-500/20",
      chevronActive: "text-amber-500",
      itemActive: "bg-amber-500/20 text-amber-400",
    },
    cyan: {
      focusBorder: "border-[#00A8E1]/50",
      focusRing: "ring-[#00A8E1]/20",
      chevronActive: "text-[#00A8E1]",
      itemActive: "bg-[#00A8E1]/20 text-[#00A8E1]",
    },
  };

  const theme = colors[variant];

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between gap-2 rounded-md border border-gray-700 bg-gray-900 text-sm text-white transition-all duration-200 outline-none cursor-pointer",
          "hover:border-gray-600",
          isOpen && `${theme.focusBorder} ring-2 ${theme.focusRing}`,
          disabled && "cursor-not-allowed opacity-50",
          iconOnly ? "h-9 w-9 p-0 justify-center" : "w-full h-9 px-4",
          triggerClassName
        )}
      >
        {iconOnly ? (
          icon || <ChevronDown className="size-4 text-gray-400" />
        ) : (
          <>
            <span className={cn(!selectedOption && "text-gray-500")}>
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-gray-400 transition-transform duration-200 shrink-0",
                isOpen && `rotate-180 ${theme.chevronActive}`
              )}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 rounded-lg border border-gray-700 bg-gray-900 shadow-xl overflow-hidden",
            iconOnly ? "right-0 min-w-[120px]" : "w-full"
          )}
        >
          <div className="p-1.5 max-h-[200px] overflow-y-auto scrollbar-themed">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex w-full items-center px-3 py-2 rounded-md text-sm text-left transition-colors",
                  option.value === value
                    ? theme.itemActive
                    : "text-white hover:bg-gray-800"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
