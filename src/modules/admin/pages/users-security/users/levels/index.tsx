import { Plus } from "lucide-react";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { useLevelsLogic } from "./hooks/useLevelsLogic";
import { LevelEditModal } from "./components/LevelEditModal";
import { LevelDetailModal } from "./components/LevelDetailModal";
import { PermissionAssignModal } from "./components/PermissionAssignModal";
import { LevelFilterBar } from "./components/LevelFilterBar";

export default function LevelsPage() {
  const {
    levels,
    loading,
    total,
    query,
    columns,
    // 逻辑
    handleSearch,
    handleFilterChange,
    // 编辑
    editOpen,
    setEditOpen,
    editingLevel,
    setEditingLevel,
    handleSave,
    // 详情
    detailOpen,
    setDetailOpen,
    detailData,
    // 权限
    permOpen,
    setPermOpen,
    permTarget,
  } = useLevelsLogic();

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">等级权重管理</h1>
      </div>

      <DataTable
        columns={columns}
        dataSource={levels}
        rowKey="id"
        loading={loading}
        toolbarLeft={<LevelFilterBar onSearch={handleSearch} loading={loading} />}
        toolbarRight={
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => {
              setEditingLevel(null);
              setEditOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            新建等级
          </Button>
        }
        pagination={{
          current: query.page,
          pageSize: query.limit,
          total: total,
          onChange: (page, limit) => {
            handleFilterChange("page", page);
            if (limit !== query.limit) {
              handleFilterChange("limit", limit);
            }
          },
        }}
      />

      <LevelEditModal
        open={editOpen}
        onOpenChange={setEditOpen}
        level={editingLevel}
        onSave={handleSave}
      />

      <LevelDetailModal open={detailOpen} onOpenChange={setDetailOpen} data={detailData} />

      <PermissionAssignModal open={permOpen} onOpenChange={setPermOpen} target={permTarget} />
    </>
  );
}
