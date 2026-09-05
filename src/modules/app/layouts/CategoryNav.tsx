import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/modules/app/components/ui/button";
import { cn } from "@/utils/cn";

export interface CategoryNavItem {
  label: string;
  value: string;
  key?: string;
  isAll?: boolean;
  /** 可选：用于排序的权重 */
  sort?: number;
  /** 可选：跳转路由路径，未提供时默认使用 onSelect */
  path?: string;
  /** 可选：显示图标 */
  icon?: ReactNode;
}

interface CategoryNavProps {
  /** 导航项列表 (必须提供) */
  items: CategoryNavItem[];
  /** 当前选中的值（对应 item.value 或 item.key） */
  active?: string;
  /** 选中回调 */
  onSelect?: (value: string, item: CategoryNavItem) => void;
  /** 是否为内联模式（无背景条） */
  inline?: boolean;
  /** 自定义容器类名 */
  className?: string;
  /** 自定义按钮类名 */
  triggerClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

/**
 * 通用分类导航组件
 * - 支持自定义数据源 (items)
 * - 支持受控模式 (active + onSelect)
 * - 支持内联 (inline) 或吸顶条模式
 * - 支持图标显示
 */
export function CategoryNav({
  items,
  active,
  onSelect,
  inline = false,
  className,
  triggerClassName,
  activeClassName,
  inactiveClassName,
}: CategoryNavProps) {
  const navigate = useNavigate();

  // 默认排序逻辑：如果有 'isAll' 或 key/value 为 'all'，置顶排在最前；否则按 sort 字段排序
  const sortedList = [...items].sort((a, b) => {
    const isAAll = a.isAll || a.key === "all" || a.value === "all" || a.label === "全部";
    const isBAll = b.isAll || b.key === "all" || b.value === "all" || b.label === "全部";
    if (isAAll && !isBAll) return -1;
    if (!isAAll && isBAll) return 1;
    return (a.sort ?? Number.POSITIVE_INFINITY) - (b.sort ?? Number.POSITIVE_INFINITY);
  });

  const handleItemClick = (item: CategoryNavItem) => {
    if (onSelect) {
      onSelect(item.key || item.value, item);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const commonButtonClass = (isActive: boolean) =>
    cn(
      inline ? "px-4 py-1.5" : "px-4 py-2",
      cn("flex items-center gap-2 rounded-full whitespace-nowrap transition-all", triggerClassName),
      isActive
        ? cn(
            "border border-amber-500/50 bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-300",
            activeClassName,
          )
        : cn(
            "border border-transparent bg-gray-800/80 text-neutral-300 hover:bg-gray-700 hover:text-amber-300",
            inactiveClassName,
          ),
    );

  const renderContent = (
    <div className="scrollbar-hide flex gap-4 overflow-x-auto">
      {sortedList.map((c) => {
        const itemKey = c.key || c.value;
        const isCurrentActive =
          c.key === active || c.value === active || c.label === active;
        return (
          <Button
            key={itemKey}
            variant={null}
            aria-pressed={isCurrentActive}
            className={commonButtonClass(isCurrentActive)}
            onClick={() => handleItemClick(c)}
          >
            {c.icon && <span className="flex h-4 w-4 items-center">{c.icon}</span>}
            {c.label}
          </Button>
        );
      })}
    </div>
  );

  if (inline) {
    return (
      <div className={cn("scrollbar-hide flex items-center gap-4 overflow-x-auto", className)}>
        {renderContent.props.children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "sticky top-0 z-40 border-b border-gray-800 bg-[#0F171E] px-4 py-4 md:px-8",
        className,
      )}
    >
      {renderContent}
    </div>
  );
}
