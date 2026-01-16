import { useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { useForumTheme } from "../../context/ForumThemeContext";
import { cn } from "@/utils/cn";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import { ScrollArea } from "./scroll-area";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  className,
  disabled,
}: MultiSelectProps) {
  const { colors } = useForumTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    // 统一搜索逻辑：对输入做 trim + lowerCase，保证大小写不敏感且忽略首尾空格
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (val: string, checked: boolean | string) => {
    // Radix Checkbox 的 checked 可能为 boolean 或 "indeterminate"
    // 这里把 "indeterminate" 视为选中，保持交互一致性
    const c = checked === true || checked === "indeterminate";
    onChange(c ? Array.from(new Set([...value, val])) : value.filter((v) => v !== val));
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            // 触发器样式对齐 SelectTrigger：统一高度、字体、hover/focus 行为，并支持 open 状态下的 icon 旋转
            "group flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm whitespace-nowrap transition-[color,border-color] outline-none",
            colors.inputBg,
            colors.inputBorder,
            colors.textPrimary,
            "hover:border-[#0088CC]/50 hover:bg-gray-50 focus-visible:ring-1 focus-visible:ring-[#0088CC]",
            "dark:hover:border-[#0088CC]/50 dark:hover:bg-neutral-800",
            className,
          )}
        >
          <span className="truncate">
            {value.length ? `${value.length} 个已选` : placeholder || "请选择"}
          </span>
          <ChevronDown
            className={cn(
              // icon 视觉对齐 Select：默认蓝色，open 状态旋转 180°，并保持 icon 不参与鼠标事件
              "size-4 shrink-0 text-[#0088CC] transition-transform duration-200 pointer-events-none group-data-[state=open]:rotate-180",
            )}
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={cn(
            // 下拉面板：参考 SelectContent 的动画/阴影/边框表现，提供 light/dark 的明确背景回退
            "relative z-50 w-[320px] rounded-md border p-2 shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            "border-neutral-200 bg-white dark:border-neutral-700 dark:bg-[#262626] dark:text-neutral-200",
            colors.borderColor,
          )}
          side="bottom"
          align="start"
          sideOffset={6}
        >
          <div className="mb-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索..."
              className={cn(
                // 输入框保持原主题能力，但补齐 Select 的边框/焦点一致性
                "h-8 w-full",
                colors.inputBg,
                colors.inputBorder,
              )}
            />
          </div>
          <ScrollArea
            // 超出高度时自动出现滚动条（默认 hover 才显示，不符合“超出后显示”的预期）
            type="always"
            className="h-[180px] pr-2"
          >
            <div className="space-y-1">
              {filtered.map((o) => {
                const checked = value.includes(o.value);
                return (
                  <label
                    key={o.value}
                    className={cn(
                      // 菜单项字体与交互对齐 SelectItem：统一字号、padding、hover/focus 颜色
                      "relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-2 pr-3 pl-3 text-sm transition-colors select-none",
                      "hover:bg-[#0088CC]/10 hover:text-[#0088CC]",
                      "focus-within:bg-[#0088CC]/10 focus-within:text-[#0088CC]",
                      "dark:hover:bg-[#0088CC]/20 dark:hover:text-[#0088CC]",
                      "dark:focus-within:bg-[#0088CC]/20 dark:focus-within:text-[#0088CC]",
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(c) => toggle(o.value, c as any)}
                    />
                    <span className={cn("text-sm leading-none", colors.textPrimary)}>{o.label}</span>
                  </label>
                );
              })}
              {!filtered.length && (
                <div className={cn("px-2 py-1 text-xs", colors.textMuted)}>无匹配项</div>
              )}
            </div>
          </ScrollArea>
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onChange([])}
              className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              清除
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              确定
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
