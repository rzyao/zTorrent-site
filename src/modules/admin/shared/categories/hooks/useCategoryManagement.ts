import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CategoriesService } from "@/api/services/CategoriesService";
import { UpdateCategoryDto } from "@/api/models/UpdateCategoryDto";
import { OpenAPI } from "@/api/core/OpenAPI";
import { request as apiRequest } from "@/api/core/request";
import type { CategoryItem, CreateCategoryFormValues } from "../types";

export function useCategoryManagement(
  kind: UpdateCategoryDto.kind,
  genre?: UpdateCategoryDto.genre,
) {
  // const { message } = App.useApp(); // Removed Antd App
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [enabledFilter, setEnabledFilter] = useState<boolean | undefined>(undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryItem | null>(null);

  // const [createForm] = Form.useForm<CreateCategoryFormValues>(); // Removed
  // const [editForm] = Form.useForm<UpdateCategoryDto>(); // Removed

  const [createInitial, setCreateInitial] = useState<Partial<CreateCategoryFormValues> | undefined>(
    undefined,
  );
  const [editInitial, setEditInitial] = useState<Partial<UpdateCategoryDto> | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const [createKeyPrefix, setCreateKeyPrefix] = useState<string | undefined>(undefined);

  // 1. 数据过滤逻辑
  const treeData = useMemo<CategoryItem[]>(() => {
    const kw = (search || "").trim().toLowerCase();

    const matchText = (n: CategoryItem) => {
      if (!kw) return true;
      return (n.key || "").toLowerCase().includes(kw) || (n.label || "").toLowerCase().includes(kw);
    };

    const matchEnabled = (n: CategoryItem) => {
      if (enabledFilter === undefined) return true;
      return Boolean(n.enabled) === Boolean(enabledFilter);
    };

    const filterRec = (nodes: CategoryItem[]): CategoryItem[] => {
      const res: CategoryItem[] = [];
      for (const node of nodes || []) {
        const children = filterRec(node.children || []);
        const selfMatch = matchText(node) && matchEnabled(node);
        if (selfMatch || children.length > 0) {
          res.push({
            ...node,
            children: children.length > 0 ? children : undefined,
          });
        }
      }
      return res;
    };
    return filterRec(items);
  }, [items, search, enabledFilter]);

  // 2. 数据加载
  async function loadList() {
    setLoading(true);
    try {
      const body: any = { kind };
      if (genre) body.genre = genre;
      const treeResp = await apiRequest(OpenAPI, {
        method: "POST",
        url: "/categories/tree",
        body,
        mediaType: "application/json",
      });
      const tree = (treeResp as any)?.data || [];
      const normalized = normalizeTree(tree);
      const roots = normalized.filter((n) => !n.parentId);
      setItems(roots);
    } catch (e) {
      toast.error((e as any)?.message || "分类树加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  // 3. 通用树处理工具
  function normalizeTree(nodes: any[]): CategoryItem[] {
    return (nodes || []).map((n: any) => {
      const t: "category" | "sub" | undefined = n?.parentId
        ? "sub"
        : n?.type === "category"
          ? "category"
          : n?.type === "sub"
            ? "sub"
            : undefined;
      const children = normalizeTree(n?.children || []);
      return {
        id: n?.id,
        key: n?.key,
        label: n?.label,
        description: n?.description ?? undefined,
        enabled: n?.enabled,
        isDefault: n?.isDefault,
        sort: n?.sort,
        createdAt: n?.createdAt,
        updatedAt: n?.updatedAt,
        type: t,
        parentId: n?.parentId,
        kind: n?.kind,
        genre: n?.genre,
        children: children.length > 0 ? children : undefined,
      };
    });
  }

  function findNodeById(nodes: CategoryItem[], id?: string): CategoryItem | undefined {
    if (!id) return undefined;
    for (const n of nodes || []) {
      if (n.id === id) return n;
      const found = findNodeById(n.children || [], id);
      if (found) return found;
    }
    return undefined;
  }

  function updateItemRecursive(
    list: CategoryItem[],
    id: string,
    updater: (node: CategoryItem) => CategoryItem,
  ): CategoryItem[] {
    return (list || []).map((n) => {
      if (n.id === id) return updater(n);
      const children = n.children ? updateItemRecursive(n.children, id, updater) : undefined;
      return children ? { ...n, children } : n;
    });
  }

  // 4. 业务操作
  const openCreate = () => {
    setCreateOpen(true);
    setCreateKeyPrefix(undefined);
    setCreateInitial({
      enabled: true,
      sort: 0,
      genre: genre ?? UpdateCategoryDto.genre.GENERAL,
      kind,
      parentId: undefined,
    });
  };

  const openCreateSub = (parentId: string) => {
    setCreateOpen(true);
    const node = findNodeById(items, parentId);
    setCreateKeyPrefix(node?.key || undefined);
    setCreateInitial({
      enabled: true,
      sort: 0,
      genre: genre ?? UpdateCategoryDto.genre.GENERAL,
      kind,
      parentId,
    });
  };

  const handleCreate = async (values: any) => {
    try {
      const payload: any = { ...values, kind };
      if (!payload.parentId) delete payload.parentId;

      if (createKeyPrefix) {
        const suffix = String((payload as any).keySuffix || "").trim();
        payload.key = suffix ? `${createKeyPrefix}.${suffix}` : `${createKeyPrefix}`;
        delete (payload as any).keySuffix;
      }

      await CategoriesService.categoriesControllerCreate(payload);
      setCreateOpen(false);
      toast.success("新增分类成功");
      loadList();
    } catch (e: any) {
      toast.error(e?.message || "新增分类失败");
    }
  };

  const openEdit = (record: CategoryItem) => {
    setEditing(record);
    setEditInitial({
      label: record.label,
      description: record.description ?? undefined,
      enabled: record.enabled,
      sort: record.sort,
      genre: (record.genre as any) ?? undefined,
    });
    setEditOpen(true);
  };

  const handleEdit = async (values: any) => {
    if (!editing?.id) return;
    try {
      await CategoriesService.categoriesControllerUpdate({
        id: editing.id,
        data: values,
      });
      setEditOpen(false);
      setEditing(null);
      toast.success("更新分类成功");
      loadList();
    } catch (e: any) {
      toast.error(e?.message || "更新分类失败");
    }
  };

  const remove = async (id?: string) => {
    if (!id) return;
    try {
      // 检查是否有子节点（防错校验）
      const node = findNodeById(items, id);
      if (node?.children && node.children.length > 0) {
        return;
      }

      await CategoriesService.categoriesControllerDelete({ id });
      toast.success("删除成功");
      loadList();
    } catch (e) {
      toast.error((e as any)?.message || "删除失败");
    }
  };

  const toggleEnabled = async (record: CategoryItem, value: boolean) => {
    if (!record.id) return;
    try {
      await CategoriesService.categoriesControllerUpdate({
        id: record.id,
        data: { enabled: value },
      });
      setItems((prev) =>
        updateItemRecursive(prev, record.id!, (node) => ({ ...node, enabled: value })),
      );
      toast.success(value ? "已启用" : "已禁用");
    } catch {
      toast.error("更新状态失败");
    }
  };

  const toggleDefault = async (record: CategoryItem, value: boolean) => {
    if (!record.id) return;
    try {
      await CategoriesService.categoriesControllerUpdate({
        id: record.id,
        data: { isDefault: value },
      });
      setItems((prev) =>
        updateItemRecursive(prev, record.id!, (node) => ({ ...node, isDefault: value })),
      );
      toast.success(value ? "已设置展示" : "已隐藏展示");
    } catch {
      toast.error("更新展示状态失败");
    }
  };

  return {
    loading,
    treeData,
    searchText,
    enabledFilter,
    setSearchText,
    setSearch,
    setEnabledFilter,

    // Create
    createOpen,
    createInitial,
    createKeyPrefix,
    setCreateOpen,
    openCreate,
    openCreateSub,
    handleCreate,

    // Edit
    editOpen,
    editInitial,
    editing,
    setEditOpen,
    openEdit,
    handleEdit,

    // Actions
    remove,
    toggleEnabled,
    toggleDefault,
    loadList,
  };
}
