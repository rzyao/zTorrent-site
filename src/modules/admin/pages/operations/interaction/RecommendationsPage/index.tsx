import { DataTable } from "@/modules/admin/components/ui/data-table";
import { SearchInput } from "@/modules/admin/components/ui/search-input";
import { Button } from "@/modules/admin/components/ui/button";
import { ConfirmModal } from "@/modules/admin/components/ui/modal";
import { Plus, Search } from "lucide-react";
import { useRecommendationsLogic } from "./useRecommendationsLogic";
import { RecommendationModal } from "./components/RecommendationModal";
import { StandardSelect as Select } from "@/modules/admin/components/ui/select";
import { STRATEGY_TYPE_OPTIONS } from "./constants";

export default function RecommendationsPage() {
  const {
    data,
    loading,
    total,
    query,
    setQuery,
    columns,
    // 搜索
    searchText,
    setSearchText,
    handleSearch,
    handleReset,
    // 弹窗
    modalVisible,
    setModalVisible,
    isEdit,
    formData,
    updateFormField,
    tabOptions,
    submitLoading,
    // 删除确认
    deleteConfirm,
    handleDelete,
    handleCancelDelete,
    // 操作
    handleCreate,
    handleSubmit,
  } = useRecommendationsLogic();

  return (
    <div className="flex h-full flex-col">
      <DataTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: query.page,
          pageSize: query.limit,
          total: total,
          onChange: (page, limit) => setQuery((prev) => ({ ...prev, page, limit })),
        }}
        toolbarLeft={
          <div className="flex items-center space-x-2">
            <SearchInput
              placeholder="搜索标题..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              wrapperClassName="w-64"
              enterButton={
                <>
                  <Search className="mr-1 h-4 w-4" />
                  搜索
                </>
              }
            />
            <Select
              value={query.type}
              onValueChange={(value) => setQuery((prev) => ({ ...prev, page: 1, type: value }))}
              options={STRATEGY_TYPE_OPTIONS}
              placeholder="筛选策略类型"
              className="w-56"
              allowClear
            />
          </div>
        }
        toolbarRight={
          <Button variant="primary" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            新建配置
          </Button>
        }
      />

      {/* 编辑/新建弹窗 */}
      <RecommendationModal
        open={modalVisible}
        onOpenChange={setModalVisible}
        isEdit={isEdit}
        formData={formData}
        updateFormField={updateFormField}
        tabOptions={tabOptions}
        onFinish={handleSubmit}
        loading={submitLoading}
      />

      {/* 删除确认弹窗 */}
      <ConfirmModal
        title="确认删除"
        content={`确定要删除配置「${deleteConfirm.title ?? ""}」吗？删除后前端将不再显示该板块。`}
        open={deleteConfirm.open}
        onCancel={handleCancelDelete}
        onOk={handleDelete}
      />
    </div>
  );
}
