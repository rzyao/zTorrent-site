import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useMemo, useRef } from "react";
import { Tree, NodeRendererProps, TreeApi, NodeApi } from "react-arborist";
import { cn } from "@/components/ui/utils";
import { ChevronRight, ChevronDown, Layout, FileCode, EyeOff, GripVertical } from "lucide-react";

interface RouteTreeProps {
  data: RouteTreeNodeDto[];
  selectedId: string | null;
  onSelect: (node: RouteTreeNodeDto) => void;
  onDragEnd?: (activeId: string, targetId: string, position: "before" | "after" | "inside") => void;
}

interface ArboristNode {
  id: string;
  name: string;
  children?: ArboristNode[];
  routeData: RouteTreeNodeDto;
}

function convertToArboristData(nodes: RouteTreeNodeDto[]): ArboristNode[] {
  const sorted = [...nodes].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return sorted.map((node) => ({
    id: node.id,
    name: getDisplayName(node),
    children: node.children && node.children.length > 0 ? convertToArboristData(node.children) : [],
    routeData: node,
  }));
}

function getDisplayName(node: RouteTreeNodeDto): string {
  if (typeof node.name === "string") return node.name;
  if (node.name && typeof node.name === "object") {
    const nameObj = node.name as Record<string, string>;
    return nameObj.zh || nameObj.en || nameObj.default || node.id;
  }
  return node.id;
}

function RouteNode({ node, style, dragHandle }: NodeRendererProps<ArboristNode>) {
  const routeData = node.data.routeData;
  const hasChildren = !!node.children && node.children.length > 0;
  const isVisible = routeData.isVisible !== false;

  return (
    <div
      style={style}
      className={cn(
        "group flex cursor-pointer items-center rounded-md px-2 py-1 text-sm transition-colors select-none",
        node.isSelected
          ? "bg-antd-primary-bg-hover text-antd-primary font-medium"
          : "text-antd-text hover:bg-antd-border-secondary",
        node.state.willReceiveDrop && "bg-antd-primary-bg-hover ring-antd-primary/50 ring-1",
      )}
      onClick={(e) => {
        e.stopPropagation();
        node.select();
      }}
    >
      <div
        ref={dragHandle}
        className="mr-1 flex h-4 w-4 shrink-0 cursor-grab items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-40 hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </div>
      <div
        className="hover:bg-antd-border-secondary mr-1 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded"
        onClick={(e) => {
          e.stopPropagation();
          node.toggle();
        }}
        style={{ visibility: hasChildren ? "visible" : "hidden" }}
      >
        {node.isOpen ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="text-antd-text-placeholder h-3.5 w-3.5" />
        )}
      </div>
      <div className="mr-2 opacity-60">
        {hasChildren ? (
          <Layout className="text-antd-primary h-4 w-4" />
        ) : (
          <FileCode className="text-antd-text-description h-4 w-4" />
        )}
      </div>
      <span className="flex-1 truncate">{node.data.name}</span>
      {!isVisible && <EyeOff className="text-antd-warning/80 ml-2 h-3.5 w-3.5" />}
    </div>
  );
}

export function RouteTree({ data, selectedId, onSelect, onDragEnd }: RouteTreeProps) {
  const treeRef = useRef<TreeApi<ArboristNode>>(null);
  const arboristData = useMemo(() => convertToArboristData(data), [data]);

  const handleSelect = useCallback(
    (nodes: NodeApi<ArboristNode>[]) => {
      if (nodes.length > 0) onSelect(nodes[0].data.routeData);
    },
    [onSelect],
  );

  const handleMove = useCallback(
    (args: {
      dragIds: string[];
      parentId: string | null;
      index: number;
      parentNode: NodeApi<ArboristNode> | null;
      dragNodes: NodeApi<ArboristNode>[];
    }) => {
      if (!onDragEnd || args.dragIds.length === 0) return;
      const dragId = args.dragIds[0];
      const parentNode = args.parentNode;
      if (parentNode) {
        const siblings = parentNode.children || [];
        const targetIndex = Math.min(args.index, siblings.length);
        if (targetIndex === 0) {
          if (siblings.length > 0 && siblings[0].id !== dragId)
            onDragEnd(dragId, siblings[0].id, "before");
          else onDragEnd(dragId, parentNode.id, "inside");
        } else if (targetIndex >= siblings.length) {
          const lastSibling = siblings[siblings.length - 1];
          if (lastSibling && lastSibling.id !== dragId) onDragEnd(dragId, lastSibling.id, "after");
          else onDragEnd(dragId, parentNode.id, "inside");
        } else {
          const targetSibling = siblings[targetIndex];
          if (targetSibling && targetSibling.id !== dragId)
            onDragEnd(dragId, targetSibling.id, "before");
        }
      } else {
        const rootNodes = treeRef.current?.root.children || [];
        const targetIndex = Math.min(args.index, rootNodes.length);
        if (targetIndex === 0 && rootNodes.length > 0) {
          if (rootNodes[0].id !== dragId) onDragEnd(dragId, rootNodes[0].id, "before");
        } else if (rootNodes.length > 0) {
          const targetNode = rootNodes[Math.min(targetIndex, rootNodes.length - 1)];
          if (targetNode && targetNode.id !== dragId) onDragEnd(dragId, targetNode.id, "after");
        }
      }
    },
    [onDragEnd],
  );

  const disableDrop = useCallback(
    (args: {
      parentNode: NodeApi<ArboristNode>;
      dragNodes: NodeApi<ArboristNode>[];
      index: number;
    }) => {
      const dragNode = args.dragNodes[0];
      if (!dragNode) return false;
      return dragNode.isAncestorOf(args.parentNode);
    },
    [],
  );

  return (
    <div className="border-antd-border-secondary bg-antd-bg-container flex h-full flex-col overflow-hidden rounded-md border shadow-sm">
      <div className="border-antd-border-secondary bg-antd-bg-layout/20 shrink-0 border-b px-4 py-2">
        <h3 className="text-antd-text text-xs font-semibold tracking-wider uppercase">
          站点路由树 ({data.length})
        </h3>
        <p className="text-antd-text-description mt-0.5 text-xs">拖拽节点进行排序和嵌套</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {data.length === 0 ? (
            <div className="text-antd-text-placeholder py-10 text-center text-sm">暂无路由数据</div>
          ) : (
            <Tree<ArboristNode>
              ref={treeRef}
              data={arboristData}
              width="100%"
              height={600}
              indent={24}
              rowHeight={36}
              openByDefault
              selection={selectedId || undefined}
              onSelect={handleSelect}
              onMove={handleMove}
              disableDrop={disableDrop}
            >
              {RouteNode}
            </Tree>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
