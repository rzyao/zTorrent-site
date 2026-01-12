import { useMemo, memo, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";
import { useCategoryManagement } from "./hooks/useCategoryManagement";
import { getCategoryColumns } from "./columns";
import { CategoryModals } from "./components/CategoryModals";
import { TreeTable } from "@/modules/admin/components/ui/tree-table";
import { Input } from "@/modules/admin/components/ui/input";
import { Button } from "@/modules/admin/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";

interface CategoriesViewProps {
  kind: UpdateCategoryDto.kind;
  genre?: UpdateCategoryDto.genre;
}

/**
 * 筛选栏组件 - 使用 memo 优化性能
 */
const CategoryFilterBar = memo(function CategoryFilterBar({
  onSearch,
  enabledFilter,
  onEnabledFilterChange,
  loading,
}: {
  onSearch: (text: string) => void;
  enabledFilter: boolean | undefined;
  onEnabledFilterChange: (value: boolean | undefined) => void;
  loading: boolean;
}) {
  const [localText, setLocalText] = useState("");

  const handleSearch = useCallback(() => {
    onSearch(localText);
  }, [localText, onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch],
  );

  return (
    <div className="flex items-center gap-3">
      {/* 搜索框 */}
      <div className="flex">
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="搜索键或名称..."
            className="w-[220px] rounded-r-none pl-9"
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          variant="primary"
          className="-ml-px rounded-l-none"
          onClick={handleSearch}
          loading={loading}
        >
          搜索
        </Button>
      </div>

      {/* 状态筛选 */}
      <Select
        value={enabledFilter === undefined ? "all" : String(enabledFilter)}
        onValueChange={(val) => onEnabledFilterChange(val === "all" ? undefined : val === "true")}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="状态筛选" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          <SelectItem value="true">已启用</SelectItem>
          <SelectItem value="false">已禁用</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

export default function CategoriesView({ kind, genre }: CategoriesViewProps) {
  const {
    loading,
    treeData,
    enabledFilter,
    setSearch,
    setEnabledFilter,
    createOpen,
    handleCreate,
    editOpen,
    editInitial,
    editing,
    setEditOpen,
    openEdit,
    handleEdit,
    remove,
    toggleEnabled,
    toggleDefault,
  } = useCategoryManagement(kind, genre);

  // 列定义
  const columns = useMemo(
    () =>
      getCategoryColumns({
        onEdit: openEdit,
        onAddSub: openCreateSub,
        onRemove: remove,
        onToggleEnabled: toggleEnabled,
        onToggleDefault: toggleDefault,
      }),
    [openEdit, openCreateSub, remove, toggleEnabled, toggleDefault],
  );

  // 搜索处理
  const handleSearch = useCallback(
    (text: string) => {
      setSearch(text || undefined);
    },
    [setSearch],
  );

  return (
    <>
      <TreeTable
        columns={columns}
        dataSource={treeData}
        rowKey="id"
        childrenKey="children"
        loading={loading}
        defaultExpandAll={false}
        toolbarLeft={
          <CategoryFilterBar
            onSearch={handleSearch}
            enabledFilter={enabledFilter}
            onEnabledFilterChange={setEnabledFilter}
            loading={loading}
          />
        }
        toolbarRight={
          <Button variant="primary" onClick={openCreate}>
            新增分类
          </Button>
        }
      />

      {/* 弹窗组件 */}
      <CategoryModals
        createOpen={createOpen}
        createInitial={createInitial}
        createKeyPrefix={createKeyPrefix}
        onCancelCreate={() => setCreateOpen(false)}
        handleCreate={handleCreate}
        editOpen={editOpen}
        editInitial={editInitial}
        editing={editing}
        onCancelEdit={() => setEditOpen(false)}
        handleEdit={handleEdit}
      />
    </>
  );
}
