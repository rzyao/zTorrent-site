import React, { useRef, useEffect } from "react";
import {
  X,
  RefreshCw,
  Home,
  MoreHorizontal,
  XCircle,
  ArrowLeftToLine,
  ArrowRightToLine,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/modules/admin/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/modules/admin/components/ui/dropdown-menu";

interface TabItem {
  key: string;
  label: string;
  closable?: boolean;
}

interface KeepAliveTabsProps {
  items: TabItem[];
  activeKey: string;
  onEdit: (targetKey: string, action: "remove" | "add") => void;
  onTabClick: (key: string) => void;
  handleRefresh: () => void;
  handleLogout: () => void;
}

export function KeepAliveTabs({
  items,
  activeKey,
  onEdit,
  onTabClick,
  handleRefresh,
  handleLogout,
}: KeepAliveTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLDivElement>(null);

  // Auto scroll to active tab
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const isVisible =
        activeTabRef.current.offsetLeft >= containerRef.current.scrollLeft &&
        activeTabRef.current.offsetLeft + activeTabRef.current.offsetWidth <=
          containerRef.current.scrollLeft + containerRef.current.offsetWidth;

      if (!isVisible) {
        activeTabRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeKey, items.length]);

  return (
    <div className="z-10 flex h-[49px] w-full items-center gap-1 border-b border-gray-200 bg-white px-4">
      {/* Scrollable Tabs Area */}
      <div
        ref={containerRef}
        className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto pr-2 pl-1"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item) => {
          const isActive = item.key === activeKey;
          const isHome = item.key === "/"; // Assuming root is home

          return (
            <div
              key={item.key}
              ref={isActive ? activeTabRef : null}
              onClick={() => onTabClick(item.key)}
              className={cn(
                "group relative flex h-8 max-w-[200px] min-w-[100px] cursor-pointer items-center justify-between gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-all hover:bg-gray-100",
                isActive
                  ? "border-primary/20 bg-primary/5 text-primary ring-primary/20 ring-1"
                  : "text-muted-foreground hover:text-foreground border-gray-200 hover:border-gray-300",
                // Special style for Home tab
                isHome && "min-w-fit px-2",
              )}
            >
              <div className="flex items-center gap-2 truncate">
                {/* Icon (Optional: Mapping or Generic) */}
                {isHome && <Home className="h-3.5 w-3.5" />}
                <span className={cn("truncate", isHome && "hidden sm:block")}>{item.label}</span>
              </div>

              {/* Close Button */}
              {item.closable && (
                <span
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "rounded-sm p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 hover:text-red-500",
                    isActive && "opacity-100", // Always show close on active tab
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item.key, "remove");
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              )}

              {/* Active Indicator Line (Bottom) */}
              {isActive && (
                <div className="bg-primary absolute right-0 -bottom-[9px] left-0 hidden h-[2px] sm:block" />
              )}
            </div>
          );
        })}
      </div>

      {/* Right Actions Area */}
      <div className="flex h-full items-center border-l bg-transparent pl-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="text" size="small" className="data-[state=open]:bg-muted h-7 w-7 p-0">
              <MoreHorizontal className="text-muted-foreground h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              刷新当前页
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // Implement close others
                items.forEach((item) => {
                  if (item.key !== activeKey && item.closable) {
                    onEdit(item.key, "remove");
                  }
                });
              }}
            >
              <XCircle className="mr-2 h-3.5 w-3.5" />
              关闭其他
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Implement close left
                // Needs logic in parent or complex reducer
              }}
              disabled
            >
              <ArrowLeftToLine className="mr-2 h-3.5 w-3.5" />
              关闭左侧
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="text"
          size="small"
          className="text-muted-foreground hover:text-foreground ml-1 h-7 w-7 p-0"
          onClick={handleRefresh}
          title="刷新"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
