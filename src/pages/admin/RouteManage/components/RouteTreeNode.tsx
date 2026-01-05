import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import { cn } from "@/components/ui/utils";
import { ChevronRight, ChevronDown, Layout, FileCode, EyeOff, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface RouteTreeNodeProps {
  node: RouteTreeNodeDto;
  level: number;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (node: RouteTreeNodeDto) => void;
  onToggleExpand: (nodeId: string) => void;
  hasChildren: boolean;
  isDropTarget?: boolean;
  dropPosition?: "before" | "after" | "inside" | null;
}

export function RouteTreeNode({
  node,
  level,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  hasChildren,
  isDropTarget,
  dropPosition,
}: RouteTreeNodeProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: node.id,
    data: { type: "route", node, level },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${level * 16 + 8}px`,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStringValue = (val: any): string => {
    if (typeof val === "string") return val;
    if (val && typeof val === "object") return JSON.stringify(val);
    return "";
  };

  const displayName = getStringValue(node.name) || node.id;

  return (
    <div className="relative">
      {isDropTarget && dropPosition === "before" && (
        <div className="absolute top-0 right-2 left-4 z-10 h-0.5 bg-blue-500" />
      )}

      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "group flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm transition-colors select-none",
          isSelected
            ? "bg-primary/10 text-primary font-medium"
            : "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
          isDragging && "ring-primary/50 shadow-lg ring-2",
          isDropTarget && dropPosition === "inside" && "bg-blue-500/20 ring-2 ring-blue-500/50",
        )}
        onClick={() => onSelect(node)}
      >
        <div
          {...attributes}
          {...listeners}
          className="mr-1 flex h-4 w-4 shrink-0 cursor-grab items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-50 hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>

        <div
          className="mr-1 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(node.id);
          }}
          style={{ visibility: hasChildren ? "visible" : "hidden" }}
        >
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </div>

        <div className="mr-2 opacity-70">
          {hasChildren ? <Layout className="h-4 w-4" /> : <FileCode className="h-4 w-4" />}
        </div>

        <span className="flex-1 truncate">{displayName}</span>

        {isDropTarget && dropPosition === "inside" && (
          <span className="ml-2 text-xs text-blue-500">← 挂载</span>
        )}

        <div className="ml-2 flex items-center gap-1.5 opacity-70">
          {node.isVisible === false && <EyeOff className="h-3 w-3 text-amber-500" />}
        </div>
      </div>

      {isDropTarget && dropPosition === "after" && (
        <div className="absolute right-2 bottom-0 left-4 z-10 h-0.5 bg-blue-500" />
      )}
    </div>
  );
}
