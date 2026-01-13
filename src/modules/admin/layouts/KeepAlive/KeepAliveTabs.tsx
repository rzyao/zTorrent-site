import React, { useRef, useEffect } from "react";
import {
  X,
  RotateCw,
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/modules/admin/components/ui/context-menu";

interface TabItem {
  key: string;
  label: string;
  closable?: boolean;
  saved?: boolean; // 是否已保存（true=已保存，false=有未保存修改，undefined=默认已保存）
}

interface KeepAliveTabsProps {
  items: TabItem[];
  activeKey: string;
  onEdit: (targetKey: string, action: "remove" | "add") => void;
  removeTabs: (keys: string[]) => void; // 新增：批量删除方法
  onTabClick: (key: string) => void;
  handleRefresh: () => void;
  handleLogout: () => void;
}

export function KeepAliveTabs({
  items,
  activeKey,
  onEdit,
  removeTabs,
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
        {items.map((item, index) => {
          const isActive = item.key === activeKey;
          const isHome = item.key === "/"; // Assuming root is home

          return (
            <ContextMenu key={item.key}>
              <ContextMenuTrigger asChild>
                <div
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
                    {/* 未保存标识 */}
                    {item.saved === false && (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-orange-500"
                        title="有未保存的修改"
                      />
                    )}
                    <span className={cn("truncate", isHome && "hidden sm:block")}>
                      {item.label}
                    </span>
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
              </ContextMenuTrigger>

              <ContextMenuContent className="w-auto min-w-32 text-[14px]">
                {/* 关闭 */}
                {item.closable && (
                  <>
                    <ContextMenuItem onClick={() => onEdit(item.key, "remove")}>
                      关闭
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                  </>
                )}

                {/* 关闭其他 */}
                <ContextMenuItem
                  onClick={() => {
                    const keysToClose = items
                      .filter((tab) => tab.key !== item.key && tab.closable)
                      .map((tab) => tab.key);
                    removeTabs(keysToClose);
                  }}
                >
                  关闭其他
                </ContextMenuItem>

                {/* 关闭右侧标签页 */}
                <ContextMenuItem
                  onClick={() => {
                    const keysToClose = items
                      .filter((tab, tabIndex) => tabIndex > index && tab.closable)
                      .map((tab) => tab.key);
                    removeTabs(keysToClose);
                  }}
                  disabled={index >= items.length - 1}
                >
                  关闭右侧标签页
                </ContextMenuItem>

                <ContextMenuSeparator />

                {/* 关闭已保存 */}
                <ContextMenuItem
                  onClick={() => {
                    const keysToClose = items
                      .filter((tab) => tab.closable && tab.saved !== false)
                      .map((tab) => tab.key);
                    removeTabs(keysToClose);
                  }}
                >
                  关闭已保存
                </ContextMenuItem>

                {/* 全部关闭 */}
                <ContextMenuItem
                  onClick={() => {
                    const keysToClose = items.filter((tab) => tab.closable).map((tab) => tab.key);
                    removeTabs(keysToClose);
                  }}
                >
                  全部关闭
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>

      {/* Right Actions Area */}
      <div className="flex h-full items-center bg-transparent pl-2">
        <Button
          variant="text"
          size="small"
          className="hover:text-foreground h-7 w-7 p-0"
          onClick={handleRefresh}
          title="刷新"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
