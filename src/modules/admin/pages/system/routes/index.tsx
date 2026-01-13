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
import { Tabs, TabsList, TabsTrigger } from "@/modules/admin/components/ui/tabs";

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
    handleTreeMove,
  } = useRoutesLogic();

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
            <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新建
            </Button>
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="bg-card flex min-h-0 flex-1 flex-col rounded-lg border shadow-sm">
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              setSelectedNodeId(null);
            }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="border-b px-4">
              <TabsList className="bg-transparent p-0">
                <TabsTrigger
                  value="app"
                  className="data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 shadow-none transition-none focus-visible:ring-0"
                >
                  前台应用 (App)
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 shadow-none transition-none focus-visible:ring-0"
                >
                  管理后台 (Admin)
                </TabsTrigger>
                <TabsTrigger
                  value="forum"
                  className="data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 shadow-none transition-none focus-visible:ring-0"
                >
                  论坛社区 (Forum)
                </TabsTrigger>
              </TabsList>
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
          </Tabs>
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
              <Button variant="primary" danger onClick={handleConfirmDelete}>
                确认删除
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageContainer>
  );
}
