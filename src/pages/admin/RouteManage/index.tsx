import { useState, useCallback } from "react";
import { RouteTreeNodeDto } from "@/api/models/RouteTreeNodeDto";
import { PlatformAdminRoutesService } from "@/api/services/PlatformAdminRoutesService";
import { RouteTree } from "./components/RouteTree";
import { DetailsPanel } from "./components/DetailsPanel";
import { Button } from "@/components/ui/button";
import { customToast } from "@/hooks/useToast";
import { Plus, Upload, Loader2, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImportDialog } from "./components/ImportDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UpdateRouteDto } from "@/api/models/UpdateRouteDto";
import { SortRouteItemDto } from "@/api/models/SortRouteItemDto";

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
      if (found !== undefined) return found;
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

export default function RouteManagePage() {
  const queryClient = useQueryClient();
  const [selectedNode, setSelectedNode] = useState<RouteTreeNodeDto | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);

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
      };
      await PlatformAdminRoutesService.adminRoutesControllerUpdate(payload);
    },
    onSuccess: () => {
      customToast.success("保存成功");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
      queryClient.invalidateQueries({ queryKey: ["routeConfig"] });
    },
    onError: (err: any) => customToast.error("保存失败", { description: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await PlatformAdminRoutesService.adminRoutesControllerDelete({ id });
    },
    onSuccess: () => {
      customToast.success("删除成功");
      setSelectedNode(null);
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
    },
  });

  const sortMutation = useMutation({
    mutationFn: async (items: SortRouteItemDto[]) => {
      await PlatformAdminRoutesService.adminRoutesControllerSort({ items });
    },
    onSuccess: () => {
      customToast.success("排序已更新");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
      queryClient.invalidateQueries({ queryKey: ["routeConfig"] });
    },
    onError: (err: any) => customToast.error("排序失败", { description: err.message }),
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
      customToast.success("节点已移动");
      queryClient.invalidateQueries({ queryKey: ["adminRouteTree"] });
      queryClient.invalidateQueries({ queryKey: ["routeConfig"] });
    },
    onError: (err: any) => customToast.error("移动失败", { description: err.message }),
  });

  const handleDragEnd = useCallback(
    (activeId: string, targetId: string, position: "before" | "after" | "inside") => {
      if (activeId === targetId) return;
      const activeNode = findNode(treeData, activeId);
      const targetNode = findNode(treeData, targetId);
      if (!activeNode || !targetNode) return;

      const isAncestor = (parent: RouteTreeNodeDto, childId: string): boolean => {
        if (!parent.children) return false;
        for (const child of parent.children) {
          if (child.id === childId || isAncestor(child, childId)) return true;
        }
        return false;
      };
      if (isAncestor(activeNode, targetId)) {
        customToast.error("无法将父节点挂载到子节点下");
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
    [treeData, sortMutation, moveNodeMutation],
  );

  return (
    <div className="bg-background flex h-[calc(100vh-64px)] flex-col gap-4 p-6">
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">路由管理</h1>
          <p className="text-muted-foreground text-sm">可视化的动态路由配置中心</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            刷新
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            批量导入
          </Button>
          <Button size="sm" disabled>
            <Plus className="mr-2 h-4 w-4" />
            新建 (WIP)
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <div className="flex w-1/3 min-w-[300px] flex-col gap-2">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
          ) : (
            <RouteTree
              data={treeData}
              selectedId={selectedNode?.id || null}
              onSelect={setSelectedNode}
              onDragEnd={handleDragEnd}
            />
          )}
        </div>
        <div className="min-w-[400px] flex-1">
          <DetailsPanel
            node={selectedNode}
            onSave={updateMutation.mutate}
            onDelete={(id) => setNodeToDelete(id)}
            isSaving={updateMutation.isPending}
          />
        </div>
      </div>

      <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />

      <AlertDialog open={!!nodeToDelete} onOpenChange={(open) => !open && setNodeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除此路由？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除该路由节点及其子节点，无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (nodeToDelete) {
                  deleteMutation.mutate(nodeToDelete);
                  setNodeToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
