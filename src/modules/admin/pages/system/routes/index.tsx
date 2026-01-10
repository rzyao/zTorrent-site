import { useState, useCallback, useMemo, memo } from "react";
import { AdminPageContainer } from "@/modules/admin/components/AdminPageContainer";
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
import { Button, Typography, Space, Spin, App, Flex, theme, Card } from "antd";
import {
  ReloadOutlined,
  CloudUploadOutlined,
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

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
  onExport,
  onImport,
  onCreate,
}: {
  isLoading: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onImport: () => void;
  onCreate: () => void;
}) {
  return (
    <Card size="small" styles={{ body: { padding: "12px 16px" } }}>
      <Flex justify="space-between" align="center">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            路由管理
          </Title>
          <Text type="secondary">可视化的动态路由配置中心</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined spin={isLoading} />} onClick={onRefresh}>
            刷新
          </Button>
          <Button icon={<DownloadOutlined />} onClick={onExport} disabled={isLoading}>
            导出
          </Button>
          <Button icon={<CloudUploadOutlined />} onClick={onImport}>
            批量导入
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            新建
          </Button>
        </Space>
      </Flex>
    </Card>
  );
});

function RouteManageContent() {
  const queryClient = useQueryClient();
  const { message, modal } = App.useApp();
  const { token } = theme.useToken();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("app");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Queries
  const {
    data: fullTreeData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adminRouteTree"],
    queryFn: async () => {
      const res = await PlatformAdminRoutesService.adminRoutesControllerGetFullTree();
      const list = (res as any)?.data || res;
      const data = Array.isArray(list) ? list : list ? [list] : [];

      const processNodes = (nodes: any[]): any[] => {
        return nodes.map((node) => ({
          ...node,
          isEnabled: node.isEnabled !== false,
          isVisible: node.isVisible !== false,
          children: node.children ? processNodes(node.children) : [],
        }));
      };

      return processNodes(data);
    },
  });

  // 分组逻辑：将 Admin/Forum 提升为顶级
  const groupedData = useMemo(() => {
    const groups = {
      app: [] as RouteTreeNodeDto[],
      admin: [] as RouteTreeNodeDto[],
      forum: [] as RouteTreeNodeDto[],
    };

    const traverseAndGroup = (nodes: RouteTreeNodeDto[]) => {
      nodes.forEach((node) => {
        if (node.layout === "admin") {
          groups.admin.push(node);
        } else if (node.layout === "forum") {
          groups.forum.push(node);
        } else {
          // 处理 App 节点中的嵌套情况
          const appNode = { ...node };
          if (node.children && node.children.length > 0) {
            const appChildren: RouteTreeNodeDto[] = [];
            // 递归检查子节点
            node.children.forEach((child) => {
              if (child.layout === "admin") {
                groups.admin.push(child); // 提升 Admin
              } else if (child.layout === "forum") {
                groups.forum.push(child); // 提升 Forum
              } else {
                appChildren.push(child); // 保留 App 子节点
              }
            });
            appNode.children = appChildren;
          }
          groups.app.push(appNode);
        }
      });
    };

    traverseAndGroup(fullTreeData);
    return groups;
  }, [fullTreeData]);

  // 当前 Tab 数据
  const currentTreeData = useMemo(() => {
    return groupedData[activeTab as keyof typeof groupedData] || [];
  }, [groupedData, activeTab]);

  // 选中节点查找 (需在全量数据中查找)
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return findNode(fullTreeData, selectedNodeId);
  }, [selectedNodeId, fullTreeData]);

  // Mutations
  const updateMutation = useMutation({
    mutationFn: async (node: RouteTreeNodeDto) => {
      const payload: UpdateRouteDto = {
        id: node.id,
        path: node.path,
        name: node.name,
        component: node.component,
        layout: node.layout as any, // 修正类型兼容性
        isVisible: node.isVisible,
        permissions: node.permissions,
        redirect: node.redirect,
        parentId: undefined,
        routeKey: node.id,
        isEnabled: (node as any).isEnabled,
        openInNewTab: (node as any).openInNewTab,
        icon: (node as any).icon,
      };
      await PlatformAdminRoutesService.adminRoutesControllerUpdate(payload);
    },
    onSuccess: () => {
      message.success("保存成功");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
    },
    onError: (err: any) => message.error(`保存失败: ${err.message}`),
  });

  const createMutation = useMutation({
    mutationFn: async (dto: CreateRouteDto) => {
      // 修正：强制转换 activeTab string 到 layout enum 类型
      const payload = { ...dto, layout: activeTab as any };
      await PlatformAdminRoutesService.adminRoutesControllerCreate(payload);
    },
    onSuccess: () => {
      message.success("创建成功");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
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
      message.success("移动成功");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
    },
    onError: (err: any) => message.error(`移动失败: ${err.message}`),
  });

  // Handlers - 将所有 hook 调用放在组件内部最顶层，确保初始化顺序
  const handleRefresh = useCallback(() => refetch(), [refetch]);

  const handleExport = useCallback(() => {
    if (!fullTreeData || fullTreeData.length === 0) {
      message.warning("无数据可导出");
      return;
    }
    const blob = new Blob([JSON.stringify(fullTreeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `routes-config-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    message.success("导出完成");
  }, [fullTreeData, message]);

  // 处理函数定义 - 确保所有 Handler 在 return 之前定义
  const handleDelete = useCallback(
    (id: string) => {
      modal.confirm({
        title: "确认删除？",
        content: "此操作将永久删除该路由及其子节点。",
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk: () => deleteMutation.mutate(id),
      });
    },
    [modal, deleteMutation],
  );

  const handleCreateSubmit = useCallback(
    async (values: CreateRouteDto) => {
      await createMutation.mutateAsync({ ...values, layout: activeTab as any });
    },
    [createMutation, activeTab],
  );

  const handleSave = useCallback(
    (node: RouteTreeNodeDto) => {
      updateMutation.mutate(node);
    },
    [updateMutation],
  );

  const handleSelect = useCallback((node: RouteTreeNodeDto) => {
    setSelectedNodeId(node.id);
  }, []);

  const handleDragEnd = useCallback(
    (activeId: string, targetId: string, position: "before" | "after" | "inside") => {
      if (activeId === targetId) return;

      const activeNode = findNode(currentTreeData, activeId);
      const targetNode = findNode(currentTreeData, targetId);

      if (!activeNode || !targetNode) {
        message.warning("只能在同一业务域内拖拽");
        return;
      }

      const activeLayout = activeNode.layout || "app";
      const targetLayout = targetNode.layout || "app";

      if (activeLayout !== targetLayout || activeLayout !== activeTab) {
        message.error("禁止跨业务布局拖拽节点");
        return;
      }

      if (isAncestor(activeNode, targetId)) {
        message.warning("无法挂载到子节点下");
        return;
      }

      // 执行移动逻辑...
      if (position === "inside") {
        const children = targetNode.children || [];
        const maxSort = children.reduce((max, c) => Math.max(max, c.sortOrder || 0), 0);
        moveNodeMutation.mutate({ id: activeId, parentId: targetId, sortOrder: maxSort + 10 });
      } else {
        const siblings = findSiblings(currentTreeData, targetId);
        if (!siblings) return;

        const activeParent = findParent(currentTreeData, activeId);
        const targetParent = findParent(currentTreeData, targetId);

        // 同级排序优化：如果父节点相同，使用批量排序接口
        if (activeParent?.id === targetParent?.id) {
          const sorted = [...siblings].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
          const oldIndex = sorted.findIndex((n) => n.id === activeId);
          if (oldIndex !== -1) sorted.splice(oldIndex, 1);

          const targetIndex = sorted.findIndex((n) => n.id === targetId);
          const newIndex = position === "before" ? targetIndex : targetIndex + 1;

          sorted.splice(newIndex, 0, activeNode);

          sortMutation.mutate(
            sorted.map((node, index) => ({ id: node.id, sortOrder: index * 10 })),
          );
        } else {
          // 跨父节点移动
          const newParentId = targetParent?.id || null;
          const baseSort = targetNode.sortOrder || 0;
          moveNodeMutation.mutate({
            id: activeId,
            parentId: newParentId,
            sortOrder: position === "before" ? baseSort - 5 : baseSort + 5,
          });
        }
      }
    },
    [currentTreeData, activeTab, sortMutation, moveNodeMutation, message],
  );

  const treeContainerStyle = useMemo(
    () => ({
      backgroundColor: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      border: `1px solid ${token.colorBorderSecondary}`,
      boxShadow: token.boxShadowTertiary,
    }),
    [token],
  );

  const tabItems = [
    { key: "app", label: "前台应用 (App)" },
    { key: "admin", label: "管理后台 (Admin)" },
    { key: "forum", label: "论坛社区 (Forum)" },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <PageHeader
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onImport={() => setIsImportOpen(true)}
        onCreate={() => setIsCreateOpen(true)}
      />

      {/* Tailwind Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500 dark:text-gray-400">
          {tabItems.map((tab) => (
            <li className="me-2" key={tab.key}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.key);
                  setSelectedNodeId(null);
                }}
                className={`inline-block rounded-t-lg border-b-2 p-4 transition-colors ${
                  activeTab === tab.key
                    ? "active border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                    : "border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-h-0 flex-1 gap-6">
        <div
          className="flex min-h-0 w-1/3 min-w-[320px] flex-col self-stretch"
          style={treeContainerStyle}
        >
          {isLoading ? (
            <Flex justify="center" align="center" className="flex-1">
              <Spin size="large" />
            </Flex>
          ) : (
            <RouteTree
              key={activeTab}
              data={currentTreeData}
              selectedId={selectedNodeId}
              onSelect={handleSelect}
              onDragEnd={handleDragEnd}
            />
          )}
        </div>

        <div className="min-h-0 min-w-[420px] flex-1 self-stretch">
          <DetailsPanel
            node={selectedNode}
            onSave={handleSave}
            onDelete={handleDelete}
            isSaving={updateMutation.isPending}
          />
        </div>
      </div>

      <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
      <CreateRouteModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        treeData={fullTreeData}
        initialLayout={activeTab}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}

// Wrapper for Antd Context
export default function RouteManagePage() {
  return (
    <AdminPageContainer>
      <App className="flex min-h-0 flex-1 flex-col">
        <RouteManageContent />
      </App>
    </AdminPageContainer>
  );
}
