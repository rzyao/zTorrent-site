import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import { RouteTreeNode } from "./RouteTreeNode";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  pointerWithin,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface RouteTreeProps {
  data: RouteTreeNodeDto[];
  selectedId: string | null;
  onSelect: (node: RouteTreeNodeDto) => void;
  onDragEnd?: (activeId: string, targetId: string, position: "before" | "after" | "inside") => void;
}

function flattenTree(nodes: RouteTreeNodeDto[], expandedKeys: Set<string>): RouteTreeNodeDto[] {
  const result: RouteTreeNodeDto[] = [];
  const traverse = (nodeList: RouteTreeNodeDto[]) => {
    const sorted = [...nodeList].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    for (const node of sorted) {
      result.push(node);
      if (node.children && node.children.length > 0 && expandedKeys.has(node.id)) {
        traverse(node.children);
      }
    }
  };
  traverse(nodes);
  return result;
}

function findNodeWithLevel(
  nodes: RouteTreeNodeDto[],
  id: string,
  level = 0,
): { node: RouteTreeNodeDto; level: number } | null {
  for (const node of nodes) {
    if (node.id === id) return { node, level };
    if (node.children) {
      const found = findNodeWithLevel(node.children, id, level + 1);
      if (found) return found;
    }
  }
  return null;
}

export function RouteTree({ data, selectedId, onSelect, onDragEnd }: RouteTreeProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [activeNode, setActiveNode] = useState<RouteTreeNodeDto | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<"before" | "after" | "inside" | null>(null);
  const mouseYRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseYRef.current = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    if (data.length > 0 && expandedKeys.size === 0) {
      const keys = new Set<string>();
      data.forEach((node) => keys.add(node.id));
      setExpandedKeys(keys);
    }
  }, [data]);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const flattenedNodes = useMemo(() => flattenTree(data, expandedKeys), [data, expandedKeys]);
  const flattenedIds = useMemo(() => flattenedNodes.map((n) => n.id), [flattenedNodes]);

  const handleDragStart = (event: DragStartEvent) => {
    const found = findNodeWithLevel(data, event.active.id as string);
    if (found) setActiveNode(found.node);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { over } = event;
    if (!over) {
      setOverId(null);
      setDropPosition(null);
      return;
    }
    setOverId(over.id as string);
    const overRect = over.rect;
    if (overRect) {
      const ratio = (mouseYRef.current - overRect.top) / overRect.height;
      setDropPosition(ratio < 0.3 ? "before" : ratio > 0.7 ? "after" : "inside");
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over || event.active.id === event.over.id) {
      setOverId(null);
      setDropPosition(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const currentOverId = overId;
    const currentDropPosition = dropPosition;
    setActiveNode(null);
    setOverId(null);
    setDropPosition(null);
    if (!event.over || event.active.id === event.over.id) return;
    if (onDragEnd && currentDropPosition && currentOverId) {
      onDragEnd(event.active.id as string, currentOverId, currentDropPosition);
    }
  };

  const renderNodes = (nodes: RouteTreeNodeDto[], level = 0) => {
    if (!nodes || nodes.length === 0) return null;
    const sortedNodes = [...nodes].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    return sortedNodes.map((node) => {
      const hasChildren = !!node.children && node.children.length > 0;
      const isExpanded = expandedKeys.has(node.id);
      const isDropTarget = overId === node.id;
      return (
        <div key={node.id}>
          <RouteTreeNode
            node={node}
            level={level}
            isSelected={selectedId === node.id}
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            onSelect={onSelect}
            onToggleExpand={handleToggleExpand}
            isDropTarget={isDropTarget}
            dropPosition={isDropTarget ? dropPosition : null}
          />
          {hasChildren && isExpanded && (
            <div className="animate-in slide-in-from-top-1 duration-200">
              {renderNodes(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-card bg-opacity-50 h-full rounded-lg border">
      <div className="bg-muted/30 border-b p-3">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          站点路由树 ({data.length})
        </h3>
        <p className="text-muted-foreground/60 mt-1 text-xs">拖到边缘排序，拖到中央挂载</p>
      </div>
      <ScrollArea className="h-[calc(100%-56px)] p-2">
        {data.length === 0 ? (
          <div className="text-muted-foreground p-4 text-center text-sm">暂无数据</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          >
            <SortableContext items={flattenedIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-0.5 pb-10">{renderNodes(data)}</div>
            </SortableContext>
            <DragOverlay>
              {activeNode && (
                <div className="bg-card rounded-md border px-3 py-1.5 text-sm shadow-lg">
                  {typeof activeNode.name === "string" ? activeNode.name : activeNode.id}
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </ScrollArea>
    </div>
  );
}
