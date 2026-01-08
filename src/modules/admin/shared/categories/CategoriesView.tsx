import { useMemo } from "react";
import { Button, Input, Select, Space, Table } from "antd";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";
import { useCategoryManagement } from "./hooks/useCategoryManagement";
import { useTableScroll } from "./hooks/useTableScroll";
import { getCategoryColumns } from "./columns";
import { CategoryModals } from "./components/CategoryModals";

interface CategoriesViewProps {
  kind: UpdateCategoryDto.kind;
  genre?: UpdateCategoryDto.genre;
}

export default function CategoriesView({ kind, genre }: CategoriesViewProps) {
  const {
    loading,
    treeData,
    searchText,
    enabledFilter,
    setSearchText,
    setSearch,
    setEnabledFilter,
    createOpen,
    createForm,
    createInitial,
    createKeyPrefix,
    setCreateOpen,
    openCreate,
    openCreateSub,
    submitCreate,
    editOpen,
    editForm,
    editInitial,
    editing,
    setEditOpen,
    openEdit,
    submitEdit,
    remove,
    toggleEnabled,
    toggleDefault,
  } = useCategoryManagement(kind, genre);

  const { containerRef, scrollY } = useTableScroll();

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

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col overflow-hidden rounded-lg bg-white p-4 shadow-sm"
    >
      {/* 顶部筛选与操作区域 */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Space.Compact className="w-[280px]">
          <Input
            allowClear
            placeholder="搜索键或名称"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => setSearch(searchText || undefined)}
          />
          <Button type="primary" onClick={() => setSearch(searchText || undefined)}>
            搜索
          </Button>
        </Space.Compact>

        <Select
          className="w-[140px]"
          value={enabledFilter}
          onChange={setEnabledFilter}
          options={[
            { label: "状�? 全部", value: undefined },
            { label: "状�? 启用", value: true },
            { label: "状�? 禁用", value: false },
          ]}
        />

        <div className="flex-1 text-right">
          <Button type="primary" onClick={openCreate}>
            新增分类
          </Button>
        </div>
      </div>

      {/* 数据表格区域 */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <Table
          bordered
          rowKey="id"
          loading={loading}
          dataSource={treeData}
          pagination={false}
          scroll={{ x: "max-content", y: scrollY }}
          columns={columns}
          expandable={{
            defaultExpandAllRows: false,
          }}
        />
      </div>

      {/* 弹窗组件集合 */}
      <CategoryModals
        createOpen={createOpen}
        createForm={createForm}
        createInitial={createInitial}
        createKeyPrefix={createKeyPrefix}
        onCancelCreate={() => setCreateOpen(false)}
        onSubmitCreate={submitCreate}
        editOpen={editOpen}
        editForm={editForm}
        editInitial={editInitial}
        editing={editing}
        onCancelEdit={() => setEditOpen(false)}
        onSubmitEdit={submitEdit}
      />
    </div>
  );
}
