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

// 将 RouteTreeNodeDto 转换为 react-arborist 所需的数据结构
interface ArboristNode {
  id: string;
  name: string;
  children?: ArboristNode[];
  routeData: RouteTreeNodeDto; // 原始路由数据
}

// 转换函数：RouteTreeNodeDto[] -> ArboristNode[]
// 注意：所有节点都需要 children 数组（空数组表示叶子节点），否则无法作为拖拽挂载目标
function convertToArboristData(nodes: RouteTreeNodeDto[]): ArboristNode[] {
  const sorted = [...nodes].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  return sorted.map((node) => ({
    id: node.id,
    name: getDisplayName(node),
    children: node.children && node.children.length > 0 ? convertToArboristData(node.children) : [],
    routeData: node,
  }));
}

// 获取显示名称
function getDisplayName(node: RouteTreeNodeDto): string {
  if (typeof node.name === "string") return node.name;
  if (node.name && typeof node.name === "object") {
    // 如果是带语言的对象，尝试获取 zh/en/default
    const nameObj = node.name as Record<string, string>;
    return nameObj.zh || nameObj.en || nameObj.default || node.id;
  }
  return node.id;
}

// 自定义节点渲染器
function RouteNode({ node, style, dragHandle }: NodeRendererProps<ArboristNode>) {
  const routeData = node.data.routeData;
  // 判断是否有实际子节点（空数组不算）
  const hasChildren = !!node.children && node.children.length > 0;
  const isVisible = routeData.isVisible !== false;

  return (
    <div
      style={style}
      className={cn(
        "group flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm transition-colors select-none",
        node.isSelected
          ? "bg-primary/10 text-primary font-medium"
          : "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
        node.state.willReceiveDrop && "bg-blue-500/20 ring-2 ring-blue-500/50",
      )}
      onClick={(e) => {
        e.stopPropagation();
        node.select();
      }}
    >
      {/* 拖拽手柄 */}
      <div
        ref={dragHandle}
        className="mr-1 flex h-4 w-4 shrink-0 cursor-grab items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-50 hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </div>

      {/* 展开/折叠箭头 */}
      <div
        className="mr-1 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10"
        onClick={(e) => {
          e.stopPropagation();
          node.toggle();
        }}
        style={{ visibility: hasChildren ? "visible" : "hidden" }}
      >
        {node.isOpen ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </div>

      {/* 图标 */}
      <div className="mr-2 opacity-70">
        {hasChildren ? <Layout className="h-4 w-4" /> : <FileCode className="h-4 w-4" />}
      </div>

      {/* 名称 */}
      <span className="flex-1 truncate">{node.data.name}</span>

      {/* 状态指示器 */}
      <div className="ml-2 flex items-center gap-1.5 opacity-70">
        {!isVisible && <EyeOff className="h-3 w-3 text-amber-500" />}
      </div>
    </div>
  );
}

export function RouteTree({ data, selectedId, onSelect, onDragEnd }: RouteTreeProps) {
  const treeRef = useRef<TreeApi<ArboristNode>>(null);

  // 转换数据格式
  const arboristData = useMemo(() => convertToArboristData(data), [data]);

  // 处理节点选择
  const handleSelect = useCallback(
    (nodes: NodeApi<ArboristNode>[]) => {
      if (nodes.length > 0) {
        const selected = nodes[0];
        onSelect(selected.data.routeData);
      }
    },
    [onSelect],
  );

  // 处理拖拽完成 - 调用外部回调
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

      // 如果有父节点，说明是移动到某个节点内
      if (parentNode) {
        const siblings = parentNode.children || [];
        const targetIndex = Math.min(args.index, siblings.length);

        if (targetIndex === 0) {
          // 插入到第一个位置 - after 第一个兄弟或 inside 父节点
          if (siblings.length > 0 && siblings[0].id !== dragId) {
            onDragEnd(dragId, siblings[0].id, "before");
          } else {
            onDragEnd(dragId, parentNode.id, "inside");
          }
        } else if (targetIndex >= siblings.length) {
          // 插入到最后一个位置
          const lastSibling = siblings[siblings.length - 1];
          if (lastSibling && lastSibling.id !== dragId) {
            onDragEnd(dragId, lastSibling.id, "after");
          } else {
            onDragEnd(dragId, parentNode.id, "inside");
          }
        } else {
          // 插入到中间位置
          const targetSibling = siblings[targetIndex];
          if (targetSibling && targetSibling.id !== dragId) {
            onDragEnd(dragId, targetSibling.id, "before");
          }
        }
      } else {
        // 移动到根级别
        const rootNodes = treeRef.current?.root.children || [];
        const targetIndex = Math.min(args.index, rootNodes.length);

        if (targetIndex === 0 && rootNodes.length > 0) {
          const firstRoot = rootNodes[0];
          if (firstRoot.id !== dragId) {
            onDragEnd(dragId, firstRoot.id, "before");
          }
        } else if (rootNodes.length > 0) {
          const targetNode = rootNodes[Math.min(targetIndex, rootNodes.length - 1)];
          if (targetNode && targetNode.id !== dragId) {
            onDragEnd(dragId, targetNode.id, "after");
          }
        }
      }
    },
    [onDragEnd],
  );

  // 判断是否可以放置 - 防止循环嵌套
  const disableDrop = useCallback(
    (args: {
      parentNode: NodeApi<ArboristNode>;
      dragNodes: NodeApi<ArboristNode>[];
      index: number;
    }) => {
      // 检查是否尝试将节点拖到自己的后代中
      const dragNode = args.dragNodes[0];
      if (!dragNode) return false;

      // isAncestorOf 方法会检查当前节点是否是目标节点的祖先
      return dragNode.isAncestorOf(args.parentNode);
    },
    [],
  );

  return (
    <div className="bg-card bg-opacity-50 flex h-full flex-col rounded-lg border">
      <div className="bg-muted/30 shrink-0 border-b p-3">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
          站点路由树 ({data.length})
        </h3>
        <p className="text-muted-foreground/60 mt-1 text-xs">拖拽节点进行排序和嵌套</p>
      </div>
      <ScrollArea className="flex-1 p-2">
        {data.length === 0 ? (
          <div className="text-muted-foreground p-4 text-center text-sm">暂无数据</div>
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
      </ScrollArea>
    </div>
  );
}
