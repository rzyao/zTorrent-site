import { useState } from "react";
import { Bell, BellOff, BellRing, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/forum/components/ui/popover";

import { useForumTheme } from "../../../context/ForumThemeContext";

export type NotificationLevel = "watching" | "tracking" | "normal" | "muted";

interface NotificationOption {
  id: NotificationLevel;
  name: string;
  description: string;
  icon: any;
}

const options: NotificationOption[] = [
  {
    id: "watching",
    name: "关注",
    description: "您将在此话题有新回复时收到通知，并且会显示新回复数量。",
    icon: BellRing,
  },
  {
    id: "tracking",
    name: "跟踪",
    description: "将显示此话题的新回复数量。您会在别人 @ 您或回复您时收到通知。",
    icon: Bell,
  },
  {
    id: "normal",
    name: "常规",
    description: "您会在别人 @ 您或回复您时收到通知。",
    icon: Bell,
  },
  {
    id: "muted",
    name: "已设为免打扰",
    description: "您永远不会收到有关此话题的任何通知，它也不会出现在最新话题中。",
    icon: BellOff,
  },
];

interface NotificationSelectorProps {
  minimal?: boolean;
  className?: string; // Allow overriding styles
}

export const NotificationSelector = ({ minimal, className }: NotificationSelectorProps) => {
  const { colors } = useForumTheme();
  const [level, setLevel] = useState<NotificationLevel>("normal");
  const [open, setOpen] = useState(false);

  const currentOption = options.find((opt) => opt.id === level)!;
  const ActiveIcon = currentOption.icon;

  // 根据级别决定图标是否填充
  const isFilled = level === "watching" || level === "tracking";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {minimal ? (
          <button
            className={cn(
              "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-neutral-200 text-[#0088CC] transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700",
              className,
            )}
            title={currentOption.name}
          >
            <ActiveIcon className="h-5 w-5" fill={isFilled ? "currentColor" : "none"} />
          </button>
        ) : (
          <button
            className={cn(
              "group flex cursor-pointer items-center gap-2 rounded-full border border-transparent px-4 py-2 text-[15px] font-medium select-none group-data-[state=open]:border-[#0088CC] hover:border-[#0088CC]",
              colors.footerButtonBg,
              colors.footerButtonText,
              className,
            )}
          >
            <ActiveIcon
              className={cn("h-4 w-4", level === "muted" ? "text-neutral-400" : "text-[#0088CC]")}
              fill={isFilled ? "currentColor" : "none"}
            />
            <span>{currentOption.name}</span>
            <ChevronDown className="h-4 w-4 text-[#0088CC] transition-transform group-data-[state=open]:rotate-180" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[320px] overflow-hidden rounded-lg border border-[#0088CC]/30 p-0 shadow-xl",
          colors.cardBg,
        )}
        align="end"
        sideOffset={8}
      >
        <div className="flex flex-col py-0">
          {options.map((opt, index) => {
            const Icon = opt.icon;
            const isActive = level === opt.id;
            const isLast = index === options.length - 1;

            return (
              <button
                key={opt.id}
                onClick={() => {
                  setLevel(opt.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-3 border-b px-4 py-4 text-left",
                  colors.dividerColor,
                  isActive ? colors.menuItemActive : colors.menuItemHover,
                  isLast && "border-b-0",
                )}
              >
                <div className="mt-0.5 shrink-0">
                  <Icon
                    className={cn("h-4 w-4", isActive ? colors.accentColor : colors.textMuted)}
                    fill={opt.id === "watching" || opt.id === "tracking" ? "currentColor" : "none"}
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-tight">
                  <span
                    className={cn(
                      "text-[15px] font-bold",
                      isActive ? colors.accentColor : colors.textPrimary,
                    )}
                  >
                    {opt.name}
                  </span>
                  <span className={cn("text-[13px] leading-snug", colors.textMuted)}>
                    {opt.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
