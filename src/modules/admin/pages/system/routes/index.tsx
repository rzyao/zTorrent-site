import { useCallback, useMemo } from "react";
import { AdminPageContainer } from "@/modules/admin/components/AdminPageContainer";
import { RouteTree } from "./components/RouteTree";
import { DetailsPanel } from "./components/DetailsPanel";
import { ImportDialog } from "./components/ImportDialog";
import { CreateRouteModal } from "./components/CreateRouteModal";
import { useRoutesLogic } from "./hooks/useRoutesLogic";
import { Button } from "@/modules/admin/components/ui/button";
import { Plus, RefreshCw, Upload, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/modules/admin/components/ui/dialog";

// Fallback Tabs if UI component missing
function SimpleTabs({ value, onValueChange, children }: any) {
  return (
    <div className="w-full">
      <div className="border-b">
        <nav className="flex space-x-4 px-4" aria-label="Tabs">
          {children}
        </nav>
      </div>
    </div>
  );
}

// Main Page Component
export default function RouteManagePage() {
  const {
    selectedNodeId,
    setSelectedNodeId, // We might need to select via ID
    activeTab,
    setActiveTab,
    isImportOpen,
    setIsImportOpen,
    isCreateOpen,
    setIsCreateOpen,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    fullTreeData,
    currentTreeData,
    selectedNode,
    isLoading,
    handleRefresh,
    handleExport,
    handleCreate,
    handleDeleteRequest,
    handleConfirmDelete,
    updateMutation,
    moveNodeMutation,
    findNode,
  } = useRoutesLogic();

  // Handle Tree Move (Arborist)
  const handleTreeMove = useCallback(
    ({
      dragIds,
      parentId,
      index,
    }: {
      dragIds: string[];
      parentId: string | null;
      index: number;
    }) => {
      const dragId = dragIds[0];
      if (!dragId) return;

      // Optimistic validation
      const draggedNode = findNode(fullTreeData, dragId);
      if (!draggedNode) return;

      // 1. Calculate new SortOrder
      // We need to find the target siblings (children of parentId)
      let siblings: any[] = [];
      if (parentId) {
        const parent = findNode(fullTreeData, parentId);
        siblings = parent?.children || [];
      } else {
        // Root level siblings (in the current Tab/View context? or global roots?)
        // Full tree data roots.
        siblings = fullTreeData.filter((n: any) => !n.parentId);
        // Wait, data structure might be nested roots.
        // Actually currentTreeData is what we view. Arborist allows dropping anywhere?
        // We should use 'fullTreeData' to be safe about global structure,
        // but 'currentTreeData' reflects what is visible.
        // If parentId is null, it means root of the tree provided to Arborist.

        // Using currentTreeData because Arborist operates on that.
        siblings = currentTreeData;
      }

      // Remove self from siblings if present (to calculate index correctly)
      // Arborist 'index' is the NEW index.
      const otherSiblings = siblings.filter((s) => s.id !== dragId);

      // Calculate sortOrder
      let newSortOrder = 0;

      if (otherSiblings.length === 0) {
        newSortOrder = 0;
      } else if (index === 0) {
        newSortOrder = (otherSiblings[0].sortOrder || 0) - 10;
      } else if (index >= otherSiblings.length) {
        const last = otherSiblings[otherSiblings.length - 1];
        newSortOrder = (last.sortOrder || 0) + 10;
      } else {
        const prev = otherSiblings[index - 1];
        const next = otherSiblings[index];
        newSortOrder = ((prev.sortOrder || 0) + (next.sortOrder || 0)) / 2;
      }

      // Call Mutation
      moveNodeMutation.mutate({
        id: dragId,
        parentId: parentId || null,
        sortOrder: newSortOrder,
      });
    },
    [fullTreeData, currentTreeData, findNode, moveNodeMutation],
  );

  const handleSelect = useCallback(
    (node: any) => {
      setSelectedNodeId(node ? node.id : null);
    },
    [setSelectedNodeId],
  );

  return (
    <AdminPageContainer>
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {/* Header */}
        <div className="bg-card flex items-center justify-between rounded-lg border p-4 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">路由管理</h2>
            <p className="text-muted-foreground text-sm">可视化的动态路由配置中心</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              刷新
            </Button>
            <Button variant="default" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              导出
            </Button>
            <Button variant="default" size="sm" onClick={() => setIsImportOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              导入
            </Button>
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新建
            </Button>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="bg-card flex min-h-0 flex-1 flex-col rounded-lg border shadow-sm">
          <div className="border-b px-4">
            <div className="flex space-x-6">
              {["app", "admin", "forum"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedNodeId(null);
                  }}
                  className={`border-b-2 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground hover:border-muted border-transparent"
                  } `}
                >
                  {tab === "app" && "前台应用 (App)"}
                  {tab === "admin" && "管理后台 (Admin)"}
                  {tab === "forum" && "论坛社区 (Forum)"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1">
            {/* Tree Panel */}
            <div className="bg-muted/10 w-1/3 min-w-[320px] border-r p-4">
              {isLoading ? (
                <div className="text-muted-foreground flex h-full items-center justify-center">
                  加载中...
                </div>
              ) : (
                <RouteTree
                  data={currentTreeData}
                  selectedId={selectedNodeId}
                  onSelect={handleSelect}
                  onMove={handleTreeMove}
                />
              )}
            </div>

            {/* Details Panel */}
            <div className="bg-background flex-1 p-4">
              <DetailsPanel
                node={selectedNode}
                onSave={(node) => updateMutation.mutate(node)}
                onDelete={(id) => handleDeleteRequest(id)}
                isSaving={updateMutation.isPending}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <ImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
        <CreateRouteModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          treeData={fullTreeData}
          initialLayout={activeTab}
          onSubmit={handleCreate}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认删除？</DialogTitle>
              <DialogDescription>
                此操作将永久删除该路由及其所有子节点，操作无法撤销。
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="default" onClick={() => setIsDeleteConfirmOpen(false)}>
                取消
              </Button>
              <Button danger onClick={handleConfirmDelete}>
                确认删除
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageContainer>
  );
}
