import { useMemo, useCallback, useRef } from "react";
import { Tree, NodeRendererProps, TreeApi } from "react-arborist";
import AutoSizer from "react-virtualized-auto-sizer";
import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import DynamicIcon from "@/modules/admin/components/DynamicIcon";
import { cn } from "@/utils/cn";
import { ChevronRight, ChevronDown, Folder, File as FileIcon, EyeOff, Lock } from "lucide-react";

interface RouteTreeProps {
  data: RouteTreeNodeDto[];
  selectedId: string | null;
  onSelect: (node: RouteTreeNodeDto | null) => void;
  onMove?: (opts: { dragIds: string[]; parentId: string | null; index: number }) => void;
}

// 辅助：获取节点显示名称
function getDisplayName(node: RouteTreeNodeDto): string {
  if (typeof node.name === "string") return node.name;
  if (node.name && typeof node.name === "object") {
    const nameObj = node.name as Record<string, string>;
    return nameObj.zh || nameObj.en || nameObj.default || node.id;
  }
  return node.id;
}

// Node Component
function RouteNode({ node, style, dragHandle }: NodeRendererProps<RouteTreeNodeDto>) {
  const data = node.data;
  const isSelected = node.isSelected;
  const isFolder = node.data.children && node.data.children.length > 0;

  const iconName = (data as any).icon;
  const isVisible = data.isVisible !== false;
  const isEnabled = (data as any).isEnabled !== false;

  return (
    <div
      style={style}
      ref={dragHandle}
      className={cn(
        "hover:bg-muted/50 flex cursor-default items-center rounded-md px-2 py-1 transition-colors outline-none",
        isSelected && "bg-primary/10 text-primary hover:bg-primary/15",
        !isEnabled && "opacity-50 grayscale",
      )}
      onClick={() => node.select()}
    >
      {/* Indentation / Toggle */}
      <div
        className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center justify-center p-1"
        onClick={(e) => {
          e.stopPropagation();
          node.toggle();
        }}
      >
        {isFolder ? (
          node.isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )
        ) : (
          <span className="w-4" />
        )}
      </div>

      {/* Icon */}
      <div className="text-muted-foreground mr-2 flex items-center">
        {iconName ? (
          <DynamicIcon iconName={iconName} size={16} />
        ) : isFolder ? (
          <Folder className="h-4 w-4" />
        ) : (
          <FileIcon className="h-4 w-4" />
        )}
      </div>

      {/* Label */}
      <span
        className={cn(
          "flex-1 truncate text-sm font-medium",
          !isVisible && "text-muted-foreground/70 italic",
        )}
      >
        {getDisplayName(data)}
        {!isVisible && <span className="ml-2 text-[10px] text-amber-500 not-italic">(隐藏)</span>}
        {!isEnabled && <span className="text-destructive ml-2 text-[10px] not-italic">(禁用)</span>}
      </span>
    </div>
  );
}

export function RouteTree({ data, selectedId, onSelect, onMove }: RouteTreeProps) {
  const treeRef = useRef<TreeApi<RouteTreeNodeDto>>(null);

  // Sync selection from props to tree (controlled) mechanism in Arborist is tricky
  // usually it controls itself, but we can usage logic to sync if needed.
  // Actually, Arborist selection is internal state mostly, but we can drive it via props?
  // V3 uses internal state.
  // We can standardise: parent controls "selectedId", we tell tree to select it.

  /* 
     Ideally we use 'selection' prop if controlled, but react-arborist might differ.
     Checking docs (mental): <Tree selection={selectedId} ... /> ? No.
     It has 'initialSelection' but likely managed internally.
     However, we can listen to onSelect and update parent.
     For external updates (e.g. creating node), we might want to focus it.
  */

  return (
    <div className="h-full w-full">
      <AutoSizer>
        {({ width, height }) => (
          <Tree
            ref={treeRef}
            data={data}
            width={width}
            height={height}
            rowHeight={32}
            overscanCount={5}
            // Logic Mappings
            onMove={onMove}
            onSelect={(nodes) => {
              if (nodes.length > 0) onSelect(nodes[0].data);
              else onSelect(null);
            }}
            // Renderers
            children={RouteNode}
            // Config
            openByDefault={false}
            padding={10}
            indent={24}
            // ID accessor
            idAccessor="id"
          />
        )}
      </AutoSizer>
    </div>
  );
}
