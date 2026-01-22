import { Plus, Search } from "lucide-react";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Input } from "@/modules/admin/components/ui/input";
import { Button } from "@/modules/admin/components/ui/button";
import { usePunishmentTypesLogic } from "./usePunishmentTypesLogic";
import { PunishmentTypeModal } from "./PunishmentTypeModal";
import { ConfirmModal } from "@/modules/admin/components/ui/modal";
import { PunishmentDictsService } from "@/api/services/PunishmentDictsService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/admin/components/ui/select";

/**
 * 处罚类型管理页面
 */
export default function PunishmentTypes() {
  const {
    loading,
    data,
    total,
    query,
    setQuery,
    columns,
    searchText,
    setSearchText,
    handleSearch,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    editRecord,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    deleteRecord,
    handleDelete,
    fetchList,
  } = usePunishmentTypesLogic();

  return (
    <>
      {/* 头部标题 */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">处罚类型管理</h1>
      </div>

      {/* 列表及搜索 */}
      <DataTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        toolbarLeft={
          <div className="flex items-center gap-2">
            {/* 搜索框 + 搜索按钮 */}
            <div className="flex">
              <div className="relative">
                <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  placeholder="搜索键值、名称或描述..."
                  className="w-[240px] rounded-r-none pl-9"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button variant="primary" className="-ml-px rounded-l-none" onClick={handleSearch}>
                搜索
              </Button>
            </div>
            {/* 状态筛选 */}
            <Select
              value={query.enabled === undefined ? "all" : String(query.enabled)}
              onValueChange={(val) => {
                setQuery((prev) => ({
                  ...prev,
                  enabled: val === "all" ? undefined : val === "true",
                }));
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="true">已启用</SelectItem>
                <SelectItem value="false">已禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        toolbarRight={
          <Button
            variant="primary"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            新增处罚类型
          </Button>
        }
        pagination={{
          current: query.page,
          pageSize: query.limit,
          total: total,
          onChange: (page, limit) => {
            setQuery((prev) => ({ ...prev, page, limit }));
          },
        }}
      />

      {/* 弹窗组件 */}
      <PunishmentTypeModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        record={null}
        onSuccess={fetchList}
      />
      <PunishmentTypeModal
        open={editOpen}
        onOpenChange={setEditOpen}
        record={editRecord}
        onSuccess={fetchList}
      />

      <ConfirmModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="确认删除"
        content={`确定要删除处罚类型 "${deleteRecord?.label}" 吗?`}
        onOk={async () => {
          if (deleteRecord) {
            await handleDelete(async () => {
              await PunishmentDictsService.punishmentDictsControllerDelete({
                id: deleteRecord.id,
              });
            });
            setDeleteConfirmOpen(false);
          }
        }}
      />
    </>
  );
}
