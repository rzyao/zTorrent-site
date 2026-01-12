import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlatformAdminRoutesService } from "@/api/services/PlatformAdminRoutesService";
import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import { CreateRouteDto } from "@/api/models/CreateRouteDto";
import { UpdateRouteDto } from "@/api/models/UpdateRouteDto";
import { SortRouteItemDto } from "@/api/models/SortRouteItemDto";

export function useRoutesLogic() {
  const queryClient = useQueryClient();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("app");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // --- Queries ---
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

  // --- Derived Data ---
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
          // Flatten App node children correctly logic...
          // Original logic:
          const appNode = { ...node };
          if (node.children && node.children.length > 0) {
            const appChildren: RouteTreeNodeDto[] = [];
            node.children.forEach((child) => {
              if (child.layout === "admin") {
                groups.admin.push(child);
              } else if (child.layout === "forum") {
                groups.forum.push(child);
              } else {
                appChildren.push(child);
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

  const currentTreeData = useMemo(() => {
    return groupedData[activeTab as keyof typeof groupedData] || [];
  }, [groupedData, activeTab]);

  // Find Helper
  const findNode = useCallback((nodes: RouteTreeNodeDto[], id: string): RouteTreeNodeDto | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return findNode(fullTreeData, selectedNodeId);
  }, [selectedNodeId, fullTreeData, findNode]);

  // --- Mutations ---
  const updateMutation = useMutation({
    mutationFn: async (node: RouteTreeNodeDto) => {
      const payload: UpdateRouteDto = {
        id: node.id,
        path: node.path,
        name: node.name,
        component: node.component,
        layout: node.layout as any,
        isVisible: node.isVisible,
        permissions: node.permissions,
        redirect: node.redirect,
        parentId: undefined, // Usually not updated here
        routeKey: node.id,
        isEnabled: (node as any).isEnabled,
        openInNewTab: (node as any).openInNewTab,
        icon: (node as any).icon,
      };
      await PlatformAdminRoutesService.adminRoutesControllerUpdate(payload);
    },
    onSuccess: () => {
      toast.success("保存成功");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
    },
    onError: (err: any) => toast.error(err.message || "保存失败"),
  });

  const createMutation = useMutation({
    mutationFn: async (dto: CreateRouteDto) => {
      const payload = { ...dto, layout: activeTab as any };
      await PlatformAdminRoutesService.adminRoutesControllerCreate(payload);
    },
    onSuccess: () => {
      toast.success("创建成功");
      setIsCreateOpen(false); // Close modal
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
    },
    onError: (err: any) => toast.error(err.message || "创建失败"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await PlatformAdminRoutesService.adminRoutesControllerDelete({ id });
    },
    onSuccess: () => {
      toast.success("删除成功");
      setSelectedNodeId(null);
      setIsDeleteConfirmOpen(false);
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
    },
    onError: (err: any) => toast.error(err.message || "删除失败"),
  });

  const sortMutation = useMutation({
    mutationFn: async (items: SortRouteItemDto[]) => {
      await PlatformAdminRoutesService.adminRoutesControllerSort({ items });
    },
    onSuccess: () => {
      toast.success("排序已更新");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
    },
    onError: (err: any) => toast.error(err.message || "排序失败"),
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
      toast.success("移动成功");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
    },
    onError: (err: any) => toast.error(err.message || "移动失败"),
  });

  // --- Handlers ---
  const handleRefresh = useCallback(() => refetch(), [refetch]);

  const handleCreate = useCallback(
    async (values: CreateRouteDto) => {
      // Hook form will call this
      await createMutation.mutateAsync(values);
    },
    [createMutation],
  );

  const handleExport = useCallback(() => {
    if (!fullTreeData || fullTreeData.length === 0) {
      toast.warning("无数据可导出");
      return;
    }
    const blob = new Blob([JSON.stringify(fullTreeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `routes-config-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("导出完成");
  }, [fullTreeData]);

  const handleDeleteRequest = useCallback((id: string) => {
    setDeleteId(id);
    setIsDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  }, [deleteId, deleteMutation]);

  return {
    // State
    selectedNodeId,
    setSelectedNodeId,
    activeTab,
    setActiveTab,
    isImportOpen,
    setIsImportOpen,
    isCreateOpen,
    setIsCreateOpen,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,

    // Data
    fullTreeData,
    currentTreeData,
    selectedNode,
    isLoading,

    // Actions
    handleRefresh,
    handleExport,
    handleCreate,
    handleDeleteRequest,
    handleConfirmDelete,
    updateMutation,
    createMutation, // exposed for pending state
    sortMutation,
    moveNodeMutation,
    findNode,
  };
}
