import { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/app/components/ui/popover";
import { cn } from "@/utils/cn";

// 预设颜色列表
const PRESET_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#0ea5e9", // sky
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#f43f5e", // rose
  "#6b7280", // gray
  "#78716c", // stone
  "#71717a", // zinc
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

/**
 * 颜色选择器组件
 * 支持预设颜色和自定义 Hex 输入
 */
export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value || "#6b7280");
  const inputRef = useRef<HTMLInputElement>(null);

  // 同步外部 value 到内部状态
  useEffect(() => {
    if (value) {
      setCustomColor(value);
    }
  }, [value]);

  const handlePresetClick = (color: string) => {
    setCustomColor(color);
    onChange(color);
    setIsOpen(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    // 验证是否为有效的 hex 颜色
    if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      onChange(newColor);
    }
  };

  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-lg border px-3 transition-colors",
            "border-neutral-700 bg-neutral-800 hover:border-neutral-600",
            "focus:ring-2 focus:ring-amber-500/50 focus:outline-none",
            className,
          )}
        >
          {/* 颜色预览 */}
          <div
            className="h-6 w-6 shrink-0 rounded border border-neutral-600"
            style={{ backgroundColor: value || "#6b7280" }}
          />
          {/* 颜色值 */}
          <span className="text-sm text-neutral-300">{value || "#6b7280"}</span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-64 border-neutral-700 bg-neutral-900 p-3" align="start">
        {/* 预设颜色网格 */}
        <div className="mb-3">
          <div className="mb-2 text-xs font-medium text-neutral-400">预设颜色</div>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handlePresetClick(color)}
                className={cn(
                  "h-8 w-8 rounded-md border-2 transition-all hover:scale-110",
                  value === color
                    ? "border-amber-500 ring-2 ring-amber-500/30"
                    : "border-transparent hover:border-neutral-500",
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* 分割线 */}
        <div className="mb-3 border-t border-neutral-700" />

        {/* 自定义颜色输入 */}
        <div>
          <div className="mb-2 text-xs font-medium text-neutral-400">自定义颜色</div>
          <div className="flex items-center gap-2">
            {/* 原生颜色选择器 */}
            <input
              ref={inputRef}
              type="color"
              value={customColor}
              onChange={handleNativePickerChange}
              className="h-10 w-10 shrink-0 cursor-pointer rounded border border-neutral-600 bg-transparent"
            />
            {/* Hex 输入框 */}
            <input
              type="text"
              value={customColor}
              onChange={handleCustomChange}
              placeholder="#000000"
              className="h-10 flex-1 rounded-md border border-neutral-700 bg-neutral-800 px-3 text-sm text-neutral-200 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
