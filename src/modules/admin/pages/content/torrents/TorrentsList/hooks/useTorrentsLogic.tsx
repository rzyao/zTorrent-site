import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CategoriesService } from "@/api/services/CategoriesService";
import { AdminTorrentsService } from "@/api/services/AdminTorrentsService";
import { TorrentsUploadService } from "@/api/services/TorrentsUploadService";
import { TorrentsReviewService } from "@/api/services/TorrentsReviewService";
import { AdminListTorrentsDto } from "@/api/models/AdminListTorrentsDto";
import { CreateTorrentDto } from "@/api/models/CreateTorrentDto";
import { UpdateTorrentDto } from "@/api/models/UpdateTorrentDto";
import { DeleteTorrentDto } from "@/api/models/DeleteTorrentDto";
import { ReviewDto } from "@/api/models/ReviewDto";
import { AdvancedRuleDto } from "@/api/models/AdvancedRuleDto";
import { TorrentItem, CategoryOption } from "../types";

export const useTorrentsLogic = () => {
  const queryClient = useQueryClient();

  // 基础状态
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<AdminListTorrentsDto["sortBy"] | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<AdminListTorrentsDto["order"] | undefined>(undefined);
  const [approvalStatus, setApprovalStatus] = useState<TorrentItem["approvalStatus"] | undefined>(
    undefined,
  );

  // 弹窗状态
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<TorrentItem | null>(null);
  const [advOpen, setAdvOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<ReviewDto.action | "approve" | "reject">(
    "approve",
  );
  const [batchDeleteOpen, setBatchDeleteOpen] = useState(false);

  // 高级搜索状态
  const [advRules, setAdvRules] = useState<
    { field: string; op: AdvancedRuleDto.op; value?: any; range?: [any, any] }[]
  >([]);
  const [advLogic, setAdvLogic] = useState<"AND" | "OR">("AND");

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // 1. 加载分类
  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "torrents", "categories"],
    queryFn: async () => {
      const resp = await CategoriesService.categoriesControllerTree({
        kind: "torrent",
        enabled: true,
      });
      const tree = resp?.data || [];
      const arr: any[] = [];
      for (const p of tree) {
        arr.push(p);
        if (p.children && Array.isArray(p.children)) {
          arr.push(...p.children);
        }
      }
      return arr
        .map((c) => ({
          label: String(c?.label ?? c?.key ?? ""),
          value: String(c?.id ?? c?.key ?? ""),
        }))
        .filter((x) => x.value) as CategoryOption[];
    },
  });

  // 2. 加载种子列表
  const queryParams: AdminListTorrentsDto & { approvalStatus?: string } = {
    page,
    limit,
    category: categoryFilter,
    sortBy,
    order: sortOrder,
    approvalStatus: approvalStatus || undefined,
    // 如果有高级规则且 advLogic 的逻辑
    logic: advLogic === "AND" ? AdminListTorrentsDto.logic.AND : AdminListTorrentsDto.logic.OR,
    rules: advRules.length > 0 ? (advRules as any) : undefined,
  };

  const { data, isLoading: loading } = useQuery({
    queryKey: ["admin", "torrents", "list", queryParams],
    queryFn: async () => {
      const resp: any = await AdminTorrentsService.torrentAdminControllerList(queryParams);
      const data = resp?.data;
      const sourceItems = data?.items || resp?.items || resp?.list || [];
      return {
        items: sourceItems.map((item: any) => ({
          ...item,
          key: item.id || item.key,
        })) as TorrentItem[],
        total: Number(data?.total || resp?.total || sourceItems.length || 0),
      };
    },
  });

  // 3. 操作 Mutations
  const createMutation = useMutation({
    mutationFn: (values: CreateTorrentDto) =>
      TorrentsUploadService.torrentUploadControllerUpload(values),
    onSuccess: () => {
      toast.success("新增种子成功");
      setCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin", "torrents", "list"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "新增种子失败");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: UpdateTorrentDto) =>
      TorrentsUploadService.torrentUploadControllerUpdate(values),
    onSuccess: () => {
      toast.success("更新种子成功");
      setEditOpen(false);
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "torrents", "list"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "更新种子失败");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => TorrentsUploadService.torrentUploadControllerDelete({ id } as any),
    onSuccess: () => {
      toast.success("删除成功");
      queryClient.invalidateQueries({ queryKey: ["admin", "torrents", "list"] });
    },
    onError: () => {
      toast.error("删除失败");
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({
      ids,
      action,
      note,
    }: {
      ids: string[];
      action: ReviewDto.action;
      note?: string;
    }) => {
      for (const id of ids) {
        await TorrentsReviewService.torrentReviewControllerReview({ id, action, note });
      }
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.action === ReviewDto.action.APPROVE ? "审核通过成功" : "审核驳回成功",
      );
      setReviewOpen(false);
      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ["admin", "torrents", "list"] });
    },
    onError: (e: any) => {
      toast.error(e?.message || "审核操作失败");
    },
  });

  // 批量删除
  const batchDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => AdminTorrentsService.torrentAdminControllerBatchDelete({ ids }),
    onSuccess: () => {
      toast.success("批量删除成功");
      setBatchDeleteOpen(false);
      setSelectedRowKeys([]);
      queryClient.invalidateQueries({ queryKey: ["admin", "torrents", "list"] });
    },
    onError: (e: any) => {
      toast.error(e?.message || "批量删除失败");
    },
  });

  // 4. 辅助函数
  const openCreate = () => setCreateOpen(true);

  const openEdit = (record: TorrentItem) => {
    setEditing(record);
    setEditOpen(true);
  };

  const submitCreate = async (values: CreateTorrentDto) => {
    await createMutation.mutateAsync(values);
  };

  const submitEdit = async (values: UpdateTorrentDto) => {
    if (!editing?.id) return;
    await updateMutation.mutateAsync({ ...values, id: editing.id });
  };

  const remove = async (id: string) => {
    await removeMutation.mutateAsync(id);
  };

  const doReview = async (ids: string[], action: ReviewDto.action, note?: string) => {
    await reviewMutation.mutateAsync({ ids, action, note });
  };

  const openBatchDelete = () => {
    if (selectedRowKeys.length === 0) return;
    setBatchDeleteOpen(true);
  };

  const batchRemove = async () => {
    if (selectedRowKeys.length === 0) return;
    await batchDeleteMutation.mutateAsync(selectedRowKeys);
  };

  return {
    loading,
    items: data?.items || [],
    page,
    setPage,
    limit,
    setLimit,
    total: data?.total || 0,
    searchText,
    setSearchText,
    categoryFilter,
    setCategoryFilter,
    categories,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    editing,
    setEditing,
    uploading: createMutation.isPending || updateMutation.isPending || reviewMutation.isPending,
    advOpen,
    setAdvOpen,
    advRules,
    setAdvRules,
    advLogic,
    setAdvLogic,
    approvalStatus,
    setApprovalStatus,
    reviewOpen,
    setReviewOpen,
    reviewAction,
    setReviewAction,
    selectedRowKeys,
    setSelectedRowKeys,
    batchDeleteOpen,
    setBatchDeleteOpen,
    openBatchDelete,
    batchRemove,
    openCreate,
    submitCreate,
    openEdit,
    submitEdit,
    remove,
    doReview,
    fetchAdminWithRules: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "torrents", "list"] }),
  };
};
