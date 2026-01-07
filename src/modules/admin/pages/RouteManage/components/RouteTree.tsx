import { useMemo, useCallback, Key, useState, memo, startTransition } from "react";
import { Tree, Typography, Empty, theme } from "antd";
import type { TreeProps, TreeDataNode } from "antd";
import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";

const { Text } = Typography;

interface RouteTreeProps {
  data: RouteTreeNodeDto[];
  selectedId: string | null;
  onSelect: (node: RouteTreeNodeDto) => void;
  onDragEnd?: (activeId: string, targetId: string, position: "before" | "after" | "inside") => void;
}

// 扩展 TreeDataNode
interface RouteTreeDataNode extends TreeDataNode {
  routeData: RouteTreeNodeDto;
  children?: RouteTreeDataNode[];
}

// 获取节点显示名称
function getDisplayName(node: RouteTreeNodeDto): string {
  if (typeof node.name === "string") return node.name;
  if (node.name && typeof node.name === "object") {
    const nameObj = node.name as Record<string, string>;
    return nameObj.zh || nameObj.en || nameObj.default || node.id;
  }
  return node.id;
}

// 构建 ID -> RouteTreeNodeDto 映射表
function buildNodeMap(nodes: RouteTreeNodeDto[]): Map<string, RouteTreeNodeDto> {
  const map = new Map<string, RouteTreeNodeDto>();
  const traverse = (list: RouteTreeNodeDto[]) => {
    list.forEach((node) => {
      map.set(node.id, node);
      if (node.children?.length) traverse(node.children);
    });
  };
  traverse(nodes);
  return map;
}

// 收集所有 keys
function collectAllKeys(nodes: RouteTreeNodeDto[]): string[] {
  const keys: string[] = [];
  const traverse = (list: RouteTreeNodeDto[]) => {
    list.forEach((node) => {
      keys.push(node.id);
      if (node.children?.length) traverse(node.children);
    });
  };
  traverse(nodes);
  return keys;
}

// 将 RouteTreeNodeDto[] 转换为 Antd Tree 数据结构
// 使用纯字符串 title，在 titleRender 中添加图标
function convertToTreeData(nodes: RouteTreeNodeDto[]): RouteTreeDataNode[] {
  const sorted = [...nodes].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return sorted.map((node) => {
    const hasChildren = node.children && node.children.length > 0;
    const displayName = getDisplayName(node);

    return {
      key: node.id,
      title: displayName,
      isLeaf: !hasChildren,
      children: hasChildren ? convertToTreeData(node.children!) : undefined,
      routeData: node,
    };
  });
}

// 检查 nodeA 是否是 nodeB 的祖先
function isAncestor(
  nodeMap: Map<string, RouteTreeNodeDto>,
  ancestorId: string,
  descendantId: string,
): boolean {
  const ancestor = nodeMap.get(ancestorId);
  if (!ancestor?.children) return false;

  const checkDescendant = (children: RouteTreeNodeDto[]): boolean => {
    for (const child of children) {
      if (child.id === descendantId) return true;
      if (child.children?.length && checkDescendant(child.children)) return true;
    }
    return false;
  };

  return checkDescendant(ancestor.children);
}

// 树头部组件
const TreeHeader = memo(function TreeHeader({
  count,
  borderColor,
  bgColor,
}: {
  count: number;
  borderColor: string;
  bgColor: string;
}) {
  return (
    <div className="shrink-0 border-b px-4 py-2" style={{ borderColor, backgroundColor: bgColor }}>
      <Text strong style={{ fontSize: 12, textTransform: "uppercase" }}>
        站点路由树 ({count})
      </Text>
      <div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          拖拽节点调整结构
        </Text>
      </div>
    </div>
  );
});

// 主组件
function RouteTreeInner({ data, selectedId, onSelect, onDragEnd }: RouteTreeProps) {
  const { token } = theme.useToken();

  // 受控展开状态
  const [expandedKeys, setExpandedKeys] = useState<Key[]>(() => collectAllKeys(data));

  // 构建节点映射表
  const nodeMap = useMemo(() => buildNodeMap(data), [data]);

  // 转换树数据
  const treeData = useMemo(() => convertToTreeData(data), [data]);

  // 展开/收起处理 - 直接更新,不使用 startTransition (纯 UI 操作应立即响应)
  const handleExpand = useCallback((keys: Key[]) => {
    setExpandedKeys(keys);
  }, []);

  // 选中处理 - 使用 startTransition 延迟触发
  const handleSelect: TreeProps["onSelect"] = useCallback(
    (_selectedKeys: Key[], info: any) => {
      const routeData = info.node?.routeData;
      if (routeData) {
        // 使用 startTransition 让 UI 先响应
        startTransition(() => {
          onSelect(routeData);
        });
      }
    },
    [onSelect],
  );

  // 拖拽处理
  const handleDrop: TreeProps["onDrop"] = useCallback(
    (info) => {
      if (!onDragEnd) return;

      const dragKey = info.dragNode.key as string;
      const dropKey = info.node.key as string;
      const dropPos = info.node.pos.split("-");
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

      if (info.dropToGap) {
        onDragEnd(dragKey, dropKey, dropPosition === -1 ? "before" : "after");
      } else {
        onDragEnd(dragKey, dropKey, "inside");
      }
    },
    [onDragEnd],
  );

  // 拖拽允许检查
  const allowDrop: TreeProps["allowDrop"] = useCallback(
    ({ dragNode, dropNode }) => {
      return !isAncestor(nodeMap, dragNode.key as string, dropNode.key as string);
    },
    [nodeMap],
  );

  // 标题渲染 - 显示禁用/隐藏状态
  const titleRender = useCallback((node: RouteTreeDataNode) => {
    const isDisabled = (node.routeData as any).isEnabled === false;
    const isHidden = node.routeData.isVisible === false;

    // 优先显示禁用状态
    if (isDisabled) {
      return <span style={{ color: "#ff4d4f" }}>{node.title as string} (已禁用)</span>;
    }

    // 其次显示隐藏状态
    if (isHidden) {
      return <span style={{ color: "#faad14" }}>{node.title as string} (已隐藏)</span>;
    }

    return node.title as string;
  }, []);

  // 缓存 selectedKeys 数组
  const selectedKeys = useMemo(() => (selectedId ? [selectedId] : []), [selectedId]);

  if (data.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <TreeHeader
          count={0}
          borderColor={token.colorBorderSecondary}
          bgColor={token.colorBgLayout}
        />
        <div className="flex flex-1 items-center justify-center">
          <Empty description="暂无路由数据" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TreeHeader
        count={data.length}
        borderColor={token.colorBorderSecondary}
        bgColor={token.colorBgLayout}
      />
      <div className="flex-1 overflow-auto p-2">
        <Tree<RouteTreeDataNode>
          expandedKeys={expandedKeys}
          onExpand={handleExpand}
          selectedKeys={selectedKeys}
          treeData={treeData}
          onSelect={handleSelect}
          titleRender={titleRender}
          draggable
          blockNode
          onDrop={handleDrop}
          allowDrop={allowDrop}
          style={{ background: "transparent" }}
          // 启用虚拟滚动,提升大型树性能
          virtual
          height={600}
        />
      </div>
    </div>
  );
}

// 导出 memo 包装的组件
export const RouteTree = memo(RouteTreeInner, (prevProps, nextProps) => {
  return (
    prevProps.data === nextProps.data &&
    prevProps.selectedId === nextProps.selectedId &&
    prevProps.onSelect === nextProps.onSelect &&
    prevProps.onDragEnd === nextProps.onDragEnd
  );
});
