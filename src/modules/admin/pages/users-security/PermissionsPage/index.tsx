import { useState } from "react";
import { Plus } from "lucide-react";
import { SearchInput } from "@/modules/admin/components/ui/search-input";
import { Button } from "@/modules/admin/components/ui/button";
import { Modal } from "@/modules/admin/components/ui/modal";
import { usePermissionsLogic } from "./hooks/usePermissionsLogic";
import { PermissionItem } from "./components/PermissionItem";
import { PermissionModal } from "./components/PermissionModal";
import { PermissionsPageProps, Permission } from "./types";
import { cn } from "@/utils/cn";

export default function PermissionsPage({ scope, title }: PermissionsPageProps) {
  const {
    permissions,
    loading,
    expandedIds,
    toggleExpand,
    searchText,
    setSearchText,
    typeFilter,
    setTypeFilter,
    isModalOpen,
    setIsModalOpen,
    editingPermission,
    parentId,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
  } = usePermissionsLogic({ scope });

  // Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteId) {
      handleDelete(deleteId);
      setDeleteId(null);
    }
  };

  const renderTree = (items: Permission[], level = 0): React.ReactNode => {
    return items.map((item) => {
      const isExpanded = expandedIds.has(item.id);
      return (
        <div key={item.id}>
          <PermissionItem
            permission={item}
            level={level}
            expanded={isExpanded}
            onToggleExpand={toggleExpand}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
            showExpand={!typeFilter}
          />
          {item.children && (isExpanded || typeFilter) && renderTree(item.children, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      {/* Search & Filter */}
      <div className="bg-card text-card-foreground shrink-0 rounded-lg border p-4 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              关键词
            </span>
            <SearchInput
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索权限名称、键或描述..."
              className="w-80"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              类型
            </span>
            <div className="bg-muted flex rounded-md p-1">
              {[
                { label: "全部", value: "all" },
                { label: "页面", value: "page" },
                { label: "按钮", value: "button" },
                { label: "接口", value: "api" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={cn(
                    "rounded-sm px-3 py-1 text-sm font-medium transition-all",
                    (typeFilter === "" && opt.value === "all") || typeFilter === opt.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
                  )}
                  onClick={() => setTypeFilter(opt.value === "all" ? "" : (opt.value as any))}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-card text-card-foreground flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{title || "权限管理"}</span>
            <span className="text-muted-foreground mt-1 text-xs font-normal">
              ({typeFilter ? "列表视图" : "树形视图"})
            </span>
          </div>
          <Button variant="primary" onClick={() => handleAdd()} className="rounded-full shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            添加根权限
          </Button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col overflow-auto p-0">
          {loading && permissions.length === 0 ? (
            <div className="space-y-4 p-8">
              {/* Skeleton fallback */}
              <div className="bg-muted/50 h-10 w-full animate-pulse rounded" />
              <div className="bg-muted/50 h-10 w-full animate-pulse rounded opacity-80" />
              <div className="bg-muted/50 h-10 w-full animate-pulse rounded opacity-60" />
            </div>
          ) : permissions.length > 0 ? (
            <div className="divide-border/50 divide-y">{renderTree(permissions)}</div>
          ) : (
            <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center p-12">
              <span className="mb-4">未找到匹配的权限节点</span>
              <Button variant="outline" onClick={() => handleAdd()}>
                <Plus className="mr-2 h-4 w-4" />
                创建第一个权限
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <PermissionModal
        open={isModalOpen}
        editingItem={editingPermission}
        parentId={parentId}
        scope={scope}
        loading={loading}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="确认删除"
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onOk={confirmDelete}
        okText="确认删除"
        cancelText="取消"
        width={400}
        okButtonProps={{ danger: true }}
      >
        <div className="text-foreground py-4 text-sm">
          确定要删除这个权限吗？
          <div className="mt-2 text-red-500">所有关联的子权限也会被永久删除，此操作无法撤销。</div>
        </div>
      </Modal>
    </div>
  );
}
