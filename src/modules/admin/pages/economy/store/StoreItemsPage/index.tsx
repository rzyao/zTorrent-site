import { Plus, Search } from "lucide-react";
import { DataTable } from "@/modules/admin/components/ui/data-table";
import { Input } from "@/modules/admin/components/ui/input";
import { Button } from "@/modules/admin/components/ui/button";
import { useStoreItemsLogic } from "./useStoreItemsLogic";
import { StoreItemModal } from "./components/StoreItemModal";

export default function StoreItemsPage() {
  const {
    loading,
    data,
    total,
    columns,
    query,
    pagination,
    setPagination,
    modalOpen,
    setModalOpen,
    editingItem,
    handleSearch,
    openCreate,
    loadList,
  } = useStoreItemsLogic();

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        dataSource={data}
        rowKey={(r) => r.id!}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.pageSize,
          total,
          onChange: (page, pageSize) => setPagination({ page, pageSize }),
        }}
        toolbarLeft={
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Input
                placeholder="搜索键/名称/类型/状态"
                value={query.searchText}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-[280px] rounded-r-none border-r-0 focus-visible:ring-0"
              />
              <Button
                variant="default"
                className="h-8 rounded-l-none border-l-stone-200 bg-stone-50 px-3 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900"
                onClick={() => handleSearch(query.searchText)}
              >
                <Search className="h-4 w-4 text-stone-500" />
              </Button>
            </div>
          </div>
        }
        toolbarRight={
          <Button onClick={openCreate} className="bg-primary text-primary-foreground h-8">
            <Plus className="mr-2 h-4 w-4" />
            新增商品
          </Button>
        }
      />

      <StoreItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadList}
        editingItem={editingItem}
      />
    </div>
  );
}
