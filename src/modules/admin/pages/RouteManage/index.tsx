import { useState, useCallback, useMemo, memo } from "react";
import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import { PlatformAdminRoutesService } from "@/api/services/PlatformAdminRoutesService";
import { RouteTree } from "./components/RouteTree";
import { DetailsPanel } from "./components/DetailsPanel";
import { ImportDialog } from "./components/ImportDialog";
import { CreateRouteModal } from "./components/CreateRouteModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateRouteDto } from "@/api/models/UpdateRouteDto";
import { SortRouteItemDto } from "@/api/models/SortRouteItemDto";
import { CreateRouteDto } from "@/api/models/CreateRouteDto";
import { Button, Typography, Space, Spin, App, Flex, theme } from "antd";
import { ReloadOutlined, CloudUploadOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// 辅助函数 - 移到组件外部避免重复创建
function findNode(nodes: RouteTreeNodeDto[], id: string): RouteTreeNodeDto | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function findParent(
  nodes: RouteTreeNodeDto[],
  targetId: string,
  parent: RouteTreeNodeDto | null = null,
): RouteTreeNodeDto | null {
  for (const node of nodes) {
    if (node.id === targetId) return parent;
    if (node.children) {
      const found = findParent(node.children, targetId, node);
      if (found !== null) return found;
    }
  }
  return null;
}

function findSiblings(nodes: RouteTreeNodeDto[], targetId: string): RouteTreeNodeDto[] | null {
  for (const node of nodes) {
    if (node.id === targetId) return nodes;
    if (node.children) {
      const found = findSiblings(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

function isAncestor(parent: RouteTreeNodeDto, childId: string): boolean {
  if (!parent.children) return false;
  for (const child of parent.children) {
    if (child.id === childId || isAncestor(child, childId)) return true;
  }
  return false;
}

// 页面头部组件
const PageHeader = memo(function PageHeader({
  isLoading,
  onRefresh,
  onImport,
  onCreate,
}: {
  isLoading: boolean;
  onRefresh: () => void;
  onImport: () => void;
  onCreate: () => void;
}) {
  return (
    <Flex justify="space-between" align="center">
      <div>
        <Title level={3} style={{ margin: 0 }}>
          路由管理
        </Title>
        <Text type="secondary">可视化的动态路由配置中心</Text>
      </div>
      <Space>
        <Button icon={<ReloadOutlined spin={isLoading} />} onClick={onRefresh}>
          刷新
        </Button>
        <Button icon={<CloudUploadOutlined />} onClick={onImport}>
          批量导入
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          新建
        </Button>
      </Space>
    </Flex>
  );
});

function RouteManageContent() {
  const queryClient = useQueryClient();
  const { message, modal } = App.useApp();
  const { token } = theme.useToken();

  // 使用 ID 而不是整个对象来跟踪选中状态
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Queries & Mutations
  const {
    data: treeData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminRouteTree"],
    queryFn: async () => {
      const res = await PlatformAdminRoutesService.adminRoutesControllerGetFullTree();
      const list = (res as any)?.data || res;
      return Array.isArray(list) ? list : list ? [list] : [];
    },
  });

  // 根据 ID 查找选中的节点
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return findNode(treeData, selectedNodeId);
  }, [selectedNodeId, treeData]);

  const updateMutation = useMutation({
    mutationFn: async (node: RouteTreeNodeDto) => {
      const payload: UpdateRouteDto = {
        id: node.id,
        path: node.path,
        name: node.name,
        component: node.component,
        layout: node.layout,
        isVisible: node.isVisible,
        permissions: node.permissions,
        redirect: node.redirect,
        parentId: undefined,
        routeKey: node.id,
        // 新增字段
        isEnabled: (node as any).isEnabled,
        openInNewTab: (node as any).openInNewTab,
      };
      await PlatformAdminRoutesService.adminRoutesControllerUpdate(payload);
    },
    onSuccess: () => {
      message.success("保存成功");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
      queryClient.invalidateQueries({ queryKey: ["routeConfig"] });
    },
    onError: (err: any) => message.error(`保存失败: ${err.message}`),
  });

  const createMutation = useMutation({
    mutationFn: async (dto: CreateRouteDto) => {
      const res = await PlatformAdminRoutesService.adminRoutesControllerCreate(dto);
      return res;
    },
    onSuccess: () => {
      message.success("创建成功");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
      queryClient.invalidateQueries({ queryKey: ["routeConfig"] });
    },
    onError: (err: any) => message.error(`创建失败: ${err.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await PlatformAdminRoutesService.adminRoutesControllerDelete({ id });
    },
    onSuccess: () => {
      message.success("删除成功");
      setSelectedNodeId(null);
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
    },
    onError: (err: any) => message.error(`删除失败: ${err.message}`),
  });

  const sortMutation = useMutation({
    mutationFn: async (items: SortRouteItemDto[]) => {
      await PlatformAdminRoutesService.adminRoutesControllerSort({ items });
    },
    onSuccess: () => {
      message.success("排序已更新");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
      queryClient.invalidateQueries({ queryKey: ["routeConfig"] });
    },
    onError: (err: any) => message.error(`排序失败: ${err.message}`),
  });

  const moveNodeMutation = useMutation({
    mutationFn: async (payload: { id: string; parentId: string | null; sortOrder: number }) => {
      await PlatformAdminRoutesService.adminRoutesControllerUpdate({
        id: payload.id,
        parentId: payload.parentId as any,
        sortOrder: payload.sortOrder,
        routeKey: payload.id,
      });
    },
    onSuccess: () => {
      message.success("节点已移动");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
      queryClient.invalidateQueries({ queryKey: ["routeConfig"] });
    },
    onError: (err: any) => message.error(`移动失败: ${err.message}`),
  });

  // Handlers - 使用 useCallback 避免不必要的重渲染
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleOpenImport = useCallback(() => {
    setIsImportOpen(true);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setIsCreateOpen(true);
  }, []);

  const handleSelect = useCallback((node: RouteTreeNodeDto) => {
    setSelectedNodeId(node.id);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      modal.confirm({
        title: "确认删除此路由？",
        content: "此操作将永久删除该路由节点及其子节点，无法撤销。",
        okText: "确认删除",
        cancelText: "取消",
        okType: "danger",
        onOk: () => deleteMutation.mutate(id),
      });
    },
    [modal, deleteMutation],
  );

  const handleCreateSubmit = useCallback(
    async (values: CreateRouteDto) => {
      await createMutation.mutateAsync(values);
    },
    [createMutation],
  );

  const handleSave = useCallback(
    (node: RouteTreeNodeDto) => {
      updateMutation.mutate(node);
    },
    [updateMutation],
  );

  const handleDragEnd = useCallback(
    (activeId: string, targetId: string, position: "before" | "after" | "inside") => {
      if (activeId === targetId) return;
      const activeNode = findNode(treeData, activeId);
      const targetNode = findNode(treeData, targetId);
      if (!activeNode || !targetNode) return;

      if (isAncestor(activeNode, targetId)) {
        message.warning("无法将父节点挂载到子节点下");
        return;
      }

      if (position === "inside") {
        const existingChildren = targetNode.children || [];
        const maxSort = existingChildren.reduce((max, c) => Math.max(max, c.sortOrder || 0), 0);
        moveNodeMutation.mutate({ id: activeId, parentId: targetId, sortOrder: maxSort + 10 });
      } else {
        const targetSiblings = findSiblings(treeData, targetId);
        if (!targetSiblings) return;
        const activeParent = findParent(treeData, activeId);
        const targetParent = findParent(treeData, targetId);

        if (activeParent?.id === targetParent?.id) {
          const sorted = [...targetSiblings].sort(
            (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
          );
          const currentIndex = sorted.findIndex((n) => n.id === activeId);
          const targetIndex = sorted.findIndex((n) => n.id === targetId);
          if (currentIndex !== -1) {
            const [moved] = sorted.splice(currentIndex, 1);
            const insertIndex =
              position === "before"
                ? targetIndex > currentIndex
                  ? targetIndex - 1
                  : targetIndex
                : targetIndex > currentIndex
                  ? targetIndex
                  : targetIndex + 1;
            sorted.splice(insertIndex, 0, moved);
            sortMutation.mutate(
              sorted.map((node, index) => ({ id: node.id, sortOrder: index * 10 })),
            );
          }
        } else {
          const newParentId = targetParent?.id || null;
          const baseSortOrder = targetNode.sortOrder || 0;
          moveNodeMutation.mutate({
            id: activeId,
            parentId: newParentId,
            sortOrder: position === "before" ? baseSortOrder - 5 : baseSortOrder + 5,
          });
        }
      }
    },
    [treeData, sortMutation, moveNodeMutation, message],
  );

  // 缓存容器样式
  const treeContainerStyle = useMemo(
    () => ({
      backgroundColor: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      border: `1px solid ${token.colorBorderSecondary}`,
    }),
    [token],
  );

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-4">
      <PageHeader
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onImport={handleOpenImport}
        onCreate={handleOpenCreate}
      />

      <div className="flex min-h-0 flex-1 gap-6">
        {/* Left Tree */}
        <div className="flex w-1/3 min-w-[320px] flex-col" style={treeContainerStyle}>
          {isLoading ? (
            <Flex justify="center" align="center" className="flex-1">
              <Spin size="large" />
            </Flex>
          ) : (
            <RouteTree
              data={treeData}
              selectedId={selectedNodeId}
              onSelect={handleSelect}
              onDragEnd={handleDragEnd}
            />
          )}
        </div>

        {/* Right Details */}
        <div className="min-w-[420px] flex-1">
          <DetailsPanel
            node={selectedNode}
            onSave={handleSave}
            onDelete={handleDelete}
            isSaving={updateMutation.isPending}
          />
        </div>
      </div>

      {/* Dialogs */}
      <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
      <CreateRouteModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        treeData={treeData}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}

// Wrapper for Antd Context
export default function RouteManagePage() {
  return (
    <App>
      <RouteManageContent />
    </App>
  );
}
