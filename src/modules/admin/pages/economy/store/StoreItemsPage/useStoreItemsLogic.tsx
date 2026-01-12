import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { StoreItem } from "@/modules/admin/types/store";
import { StoreService } from "@/api/services/StoreService";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { StoreItemsQuery } from "./types";
import { getColumns } from "./columns";

export function useStoreItemsLogic() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<StoreItem[]>([]);
  const [total, setTotal] = useState(0);

  // 筛选与分页状态
  const [query, setQuery] = useState<StoreItemsQuery>({
    searchText: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  // Modal 状态
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);

  // Delete Confirmation State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<StoreItem | null>(null);

  const { execute: executeToggle } = useAsyncAction({
    successMessage: "状态更新成功",
  });

  const { execute: executeDelete, loading: isDeleting } = useAsyncAction({
    successMessage: "删除成功",
    onSuccess: () => {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      loadList();
    },
  });

  // 加载数据
  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await StoreService.storeControllerListItemsPost({} as any);
      const data = resp?.data?.items || [];
      setItems(data as StoreItem[]);
      setTotal(resp?.data?.total || (data || []).length);
    } catch (err: any) {
      toast.error(err.message || "商品列表加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // 处理搜索
  const handleSearch = useCallback((value: string) => {
    setQuery((prev) => ({ ...prev, searchText: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // 前端过滤逻辑
  const filteredData = useMemo(() => {
    const s = query.searchText.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) =>
      [it.key, it.title, it.type, it.status].some((v) => String(v).toLowerCase().includes(s)),
    );
  }, [items, query.searchText]);

  // 当前分页数据
  const displayData = useMemo(() => {
    const { page, pageSize } = pagination;
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pagination]);

  // 操作处理
  const openCreate = useCallback(() => {
    setEditingItem(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((record: StoreItem) => {
    setEditingItem(record);
    setModalOpen(true);
  }, []);

  // Request Delete (Opens Dialog)
  const handleDeleteRequest = useCallback((record: StoreItem) => {
    setItemToDelete(record);
    setDeleteConfirmOpen(true);
  }, []);

  // Confirm Delete (API Call)
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    await executeDelete(async () => {
      await StoreService.storeControllerDeleteItem({
        id: itemToDelete.id!,
      });
    });
  }, [executeDelete, itemToDelete]);

  const handleToggle = useCallback(
    async (record: StoreItem, toActive: boolean) => {
      await executeToggle(async () => {
        await StoreService.storeControllerToggleItem({
          id: record.id!,
          status: (toActive ? "active" : "inactive") as any,
        });
        loadList();
      });
    },
    [executeToggle, loadList],
  );

  // 表格列定义
  const columns = useMemo(
    () =>
      getColumns({
        openEdit,
        handleDelete: handleDeleteRequest, // Pass request handler
        handleToggle,
      }),
    [openEdit, handleDeleteRequest, handleToggle],
  );

  return {
    loading,
    data: displayData,
    total: filteredData.length,
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
    // Delete state
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    itemToDelete,
    handleConfirmDelete,
    isDeleting,
  };
}
