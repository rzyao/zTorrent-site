import {
  useMemo,
  useCallback,
  Key,
  useState,
  memo,
  startTransition,
  useRef,
  useEffect,
} from "react";
import { Tree, Typography, Empty, theme } from "antd";
import type { TreeProps, TreeDataNode } from "antd";
import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import DynamicIcon from "@/modules/admin/components/DynamicIcon";

const { Text, Title } = Typography;

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
    <div
      className="shrink-0 rounded-t-lg border-b px-6 py-4"
      style={{ borderColor, backgroundColor: bgColor }}
    >
      <Title level={5} style={{ margin: 0 }}>
        站点路由树 ({count})
      </Title>
      <Text type="secondary" style={{ fontSize: 12 }}>
        拖拽节点调整结构
      </Text>
    </div>
  );
});

// 主组件
function RouteTreeInner({ data, selectedId, onSelect, onDragEnd }: RouteTreeProps) {
  const { token } = theme.useToken();
  const containerRef = useRef<HTMLDivElement>(null);
  const [treeHeight, setTreeHeight] = useState(600);

  // 监听容器高度变化
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        // 减去安全余量防止溢出
        setTreeHeight(entry.contentRect.height - 20);
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

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

  // 标题渲染 - 显示图标、禁用/隐藏状态
  const titleRender = useCallback((node: RouteTreeDataNode) => {
    const isDisabled = (node.routeData as any).isEnabled === false;
    const isHidden = node.routeData.isVisible === false;
    const iconName = (node.routeData as any).icon as string | undefined;

    const titleText = node.title as string;
    let statusSuffix = "";
    let textColor: string | undefined;

    if (isDisabled) {
      statusSuffix = " (已禁用)";
      textColor = "#ff4d4f";
    } else if (isHidden) {
      statusSuffix = " (已隐藏)";
      textColor = "#faad14";
    }

    return (
      <span style={{ color: textColor, display: "inline-flex", alignItems: "center", gap: 6 }}>
        {iconName && <DynamicIcon iconName={iconName} size={14} />}
        <span>
          {titleText}
          {statusSuffix}
        </span>
      </span>
    );
  }, []);

  // 缓存 selectedKeys 数组
  const selectedKeys = useMemo(() => (selectedId ? [selectedId] : []), [selectedId]);

  if (data.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <TreeHeader
          count={0}
          borderColor={token.colorBorderSecondary}
          bgColor={token.colorBgContainer}
        />
        <div className="flex flex-1 items-center justify-center">
          <Empty description="暂无路由数据" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <TreeHeader
        count={data.length}
        borderColor={token.colorBorderSecondary}
        bgColor={token.colorBgContainer}
      />
      <div className="min-h-0 flex-1 overflow-hidden p-2" ref={containerRef}>
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
          height={treeHeight}
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
