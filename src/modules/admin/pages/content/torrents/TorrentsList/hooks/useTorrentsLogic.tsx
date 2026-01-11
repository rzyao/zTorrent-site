import { useEffect, useMemo, useState } from "react";
import { App, Form } from "antd";
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
  const { message: msg } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TorrentItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [sortBy, setSortBy] = useState<AdminListTorrentsDto["sortBy"] | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<AdminListTorrentsDto["order"] | undefined>(undefined);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<TorrentItem | null>(null);
  const [createForm] = Form.useForm<CreateTorrentDto>();
  const [editForm] = Form.useForm<UpdateTorrentDto>();
  const [uploading, setUploading] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);
  const [advRules, setAdvRules] = useState<
    { field: string; op: AdvancedRuleDto.op; value?: any; range?: [any, any] }[]
  >([]);
  const [advLogic, setAdvLogic] = useState<"AND" | "OR">("AND");
  const [approvalStatus, setApprovalStatus] = useState<TorrentItem["approvalStatus"] | undefined>(
    undefined,
  );
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<ReviewDto.action | "approve" | "reject">(
    "approve",
  );
  const [reviewForm] = Form.useForm<{ note?: string }>();

  const query = useMemo<AdminListTorrentsDto>(
    () => ({
      page,
      limit,
      category: categoryFilter,
      sortBy,
      order: sortOrder,
      approvalStatus: approvalStatus || undefined,
    }),
    [categoryFilter, page, limit, sortBy, sortOrder, approvalStatus],
  );

  async function loadCategories() {
    try {
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
      const opts = arr.map((c) => ({
        label: String(c?.label ?? c?.key ?? ""),
        value: String(c?.id ?? c?.key ?? ""),
      }));
      setCategories(opts.filter((x) => x.value));
    } catch {}
  }

  async function loadList() {
    setLoading(true);
    try {
      const resp: any = await AdminTorrentsService.torrentAdminControllerList(query);
      const data = resp?.data;
      const sourceItems = data?.items || resp?.items || resp?.list || [];
      setItems(
        sourceItems.map((item: any) => ({
          id: item.id,
          key: item.key,
          title: item.title,
          category: item.category,
          categoryId: item.categoryId,
          size: item.size,
          seeders: item.seeders,
          leechers: item.leechers,
          completed: item.completed,
          createdAt: item.createdAt,
          uploader: item.uploader,
          uploaderId: item.uploaderId,
          enabled: item.enabled,
          name: item.name,
          description: item.description,
          approvalStatus: item.approvalStatus,
          approvedAt: item.approvedAt,
          visible: item.visible,
        })),
      );
      setTotal(Number(data?.total || resp?.total || sourceItems.length || 0));
    } catch (e) {
      msg.error("种子列表加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadList();
  }, [query]);

  function openCreate() {
    createForm.resetFields();
    setCreateOpen(true);
  }

  async function submitCreate() {
    try {
      const values = await createForm.validateFields();
      setUploading(true);
      await TorrentsUploadService.torrentUploadControllerUpload(values as CreateTorrentDto);
      setCreateOpen(false);
      msg.success("新增种子成功");
      loadList();
    } catch (error: any) {
      msg.error(error?.message || "新增种子失败");
    } finally {
      setUploading(false);
    }
  }

  function openEdit(record: TorrentItem) {
    setEditing(record);
    editForm.setFieldsValue({
      id: record.id,
      name: record.name,
      description: record.description,
      category: record.categoryId,
    });
    setEditOpen(true);
  }

  async function submitEdit() {
    if (!editing?.id) return;
    try {
      const values = await editForm.validateFields();
      await TorrentsUploadService.torrentUploadControllerUpdate({
        ...values,
        id: editing.id,
      } as UpdateTorrentDto);
      setEditOpen(false);
      setEditing(null);
      msg.success("更新种子成功");
      loadList();
    } catch (error: any) {
      msg.error(error?.message || "更新种子失败");
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    try {
      await TorrentsUploadService.torrentUploadControllerDelete({
        id,
      } as DeleteTorrentDto);
      msg.success("删除成功");
      loadList();
    } catch {
      msg.error("删除失败");
    }
  }

  async function doReview(ids: string[], action: ReviewDto.action, note?: string) {
    if (!ids.length) return;
    setUploading(true);
    try {
      for (const id of ids) {
        await TorrentsReviewService.torrentReviewControllerReview({ id, action, note });
      }
      msg.success(action === ReviewDto.action.APPROVE ? "审核通过成功" : "审核驳回成功");
      loadList();
    } catch (e: any) {
      msg.error(e?.message || "审核操作失败");
    } finally {
      setUploading(false);
    }
  }

  async function fetchAdminWithRules() {
    setLoading(true);
    try {
      const mapped = advRules.map((r) => {
        if (r.op === AdvancedRuleDto.op.BETWEEN && r.range && r.range.length === 2) {
          const [from, to] = r.range;
          return {
            field: r.field,
            op: AdvancedRuleDto.op.BETWEEN,
            range: [String(from), String(to)],
          };
        }
        const v = (() => {
          if (!r.value) return undefined;
          if (Array.isArray(r.value)) return r.value;
          if (typeof r.value?.toISOString === "function") return r.value.toISOString();
          return r.value;
        })();
        return { field: r.field, op: r.op, value: v };
      }) as any;
      const req: AdminListTorrentsDto = {
        category: categoryFilter,
        logic: advLogic === "AND" ? AdminListTorrentsDto.logic.AND : AdminListTorrentsDto.logic.OR,
        rules: mapped,
        page,
        limit,
      };
      const resp: any = await AdminTorrentsService.torrentAdminControllerList(req);
      const data = resp?.data;
      const sourceItems = data?.items || resp?.items || resp?.list || [];
      setItems(
        sourceItems.map((item: any) => ({
          id: item.id,
          key: item.key,
          title: item.title,
          category: item.category,
          categoryId: item.categoryId,
          size: item.size,
          seeders: item.seeders,
          leechers: item.leechers,
          completed: item.completed,
          createdAt: item.createdAt,
          uploader: item.uploader,
          uploaderId: item.uploaderId,
          enabled: item.enabled,
          name: item.name,
          description: item.description,
        })),
      );
      setTotal(Number(data?.total || resp?.total || sourceItems.length || 0));
    } catch (e) {
      msg.error("高级查询失败");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    items,
    page,
    setPage,
    limit,
    setLimit,
    total,
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
    createForm,
    editForm,
    uploading,
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
    reviewForm,
    loadList,
    openCreate,
    submitCreate,
    openEdit,
    submitEdit,
    remove,
    doReview,
    fetchAdminWithRules,
    msg,
  };
};
