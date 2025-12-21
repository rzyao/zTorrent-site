import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

export interface CategoryNavItem {
  label: string;
  value: string;
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
  /** 当前选中的值（对应 item.value） */
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

  // 默认排序逻辑：如果有 '全部' 标签，尽量放前面；否则按 sort 字段排序
  const sortedList = [...items].sort((a, b) => {
    if (a.label === "全部") return -1;
    if (b.label === "全部") return 1;
    return (
      (a.sort ?? Number.POSITIVE_INFINITY) -
      (b.sort ?? Number.POSITIVE_INFINITY)
    );
  });

  const handleItemClick = (item: CategoryNavItem) => {
    if (onSelect) {
      onSelect(item.value, item);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const commonButtonClass = (isActive: boolean) =>
    cn(
      inline ? "px-4 py-1.5" : "px-4 py-2",
      cn(
        "rounded-full whitespace-nowrap transition-all flex items-center gap-2",
        triggerClassName
      ),
      isActive
        ? cn(
            "bg-linear-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 text-amber-300",
            activeClassName
          )
        : cn(
            "bg-gray-800/80 text-neutral-300 hover:bg-gray-700 hover:text-amber-300 border border-transparent",
            inactiveClassName
          )
    );

  const renderContent = (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide">
      {sortedList.map((c) => (
        <Button
          key={c.value}
          className={commonButtonClass(
            c.label === active || c.value === active
          )}
          onClick={() => handleItemClick(c)}
        >
          {c.icon && (
            <span className="w-4 h-4 flex items-center">{c.icon}</span>
          )}
          {c.label}
        </Button>
      ))}
    </div>
  );

  if (inline) {
    return (
      <div
        className={cn(
          "flex items-center gap-4 overflow-x-auto scrollbar-hide",
          className
        )}
      >
        {renderContent.props.children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "sticky top-0 bg-[#0F171E] py-4 px-4 md:px-8 z-40 border-b border-gray-800",
        className
      )}
    >
      {renderContent}
    </div>
  );
}
