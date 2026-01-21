import { useState, useEffect, useCallback } from "react";
import { CategoriesService } from "@/api/services/CategoriesService";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";
import { toast } from "sonner";

export function useMovieCategories() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await CategoriesService.categoriesControllerTree({
        kind: "movie" as any,
        genre: UpdateCategoryDto.genre.GENERAL,
      });
      // 这里的成功码可能是 200 或 1000，或者直接判断 data 是否存在
      if (res.code === 200 || res.code === 1000 || res.data) {
        setData(res.data || []);
      } else {
        toast.error(res.message || "加载失败");
      }
    } catch (error: any) {
      toast.error(error.message || "系统错误");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (values: any) => {
    setLoading(true);
    try {
      const res = await CategoriesService.categoriesControllerCreate({
        ...values,
        kind: "movie" as any,
        genre: UpdateCategoryDto.genre.GENERAL,
      });
      if (res.code === 200 || res.code === 1000) {
        toast.success("创建成功");
        setIsCreateOpen(false);
        loadData();
      } else {
        toast.error(res.message || "创建失败");
      }
    } catch (error: any) {
      toast.error(error.message || "创建失败");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingItem?.id) return;
    setLoading(true);
    try {
      const res = await CategoriesService.categoriesControllerUpdate({
        id: editingItem.id,
        data: {
          ...values,
          kind: UpdateCategoryDto.kind.MOVIE,
          genre: UpdateCategoryDto.genre.GENERAL,
        },
      });
      if (res.code === 200 || res.code === 1000) {
        toast.success("更新成功");
        setIsEditOpen(false);
        setEditingItem(null);
        loadData();
      } else {
        toast.error(res.message || "更新失败");
      }
    } catch (error: any) {
      toast.error(error.message || "更新失败");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!id) return;
    if (!confirm("确定要删除该分类吗？")) return;
    setLoading(true);
    try {
      const res = await CategoriesService.categoriesControllerDelete({ id });
      if (res.code === 200 || res.code === 1000) {
        toast.success("删除成功");
        loadData();
      } else {
        toast.error(res.message || "删除失败");
      }
    } catch (error: any) {
      toast.error(error.message || "删除失败");
    } finally {
      setLoading(false);
    }
  };

  const toggleEnabled = async (item: any) => {
    if (!item?.id) return;
    try {
      const res = await CategoriesService.categoriesControllerUpdate({
        id: item.id,
        data: {
          enabled: !item.enabled,
        },
      });
      if (res.code === 200 || res.code === 1000) {
        toast.success(item.enabled ? "已禁用" : "已启用");
        loadData();
      }
    } catch (error: any) {
      toast.error("操作失败");
    }
  };

  return {
    loading,
    data,
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    setIsEditOpen,
    editingItem,
    setEditingItem,
    handleCreate,
    handleEdit,
    handleRemove,
    toggleEnabled,
    loadData,
  };
}
