import { useState, useEffect, useMemo, useCallback } from "react";
import { PunishmentDictsService } from "@/api/services/PunishmentDictsService";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { BAN_REASON_CATEGORY, DEFAULT_QUERY, BanReason, BanReasonQuery } from "./types";
import { Column } from "@/modules/admin/components/ui/data-table";
import { Switch } from "@/modules/admin/components/ui/switch";
import { Button } from "@/modules/admin/components/ui/button";

/**
 * 封禁原因管理核心逻辑 Hook
 * 负责状态管理、数据获取、列定义与 CRUD 操作
 */
export const useBanReasonsLogic = () => {
  // --- 状态管理 ---
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BanReason[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState<BanReasonQuery>(DEFAULT_QUERY);
  const [searchText, setSearchText] = useState("");

  // 弹窗状态
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<BanReason | null>(null);

  // 删除确认状态
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<BanReason | null>(null);

  // --- 异步操作 ---
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await PunishmentDictsService.punishmentDictsControllerList({
        category: BAN_REASON_CATEGORY,
        search: query.search || undefined,
        enabled: query.enabled,
        page: query.page,
        limit: query.limit,
      });

      setData((res.data?.items as BanReason[]) || []);
      setTotal(res.data?.total || 0);
    } catch (error) {
      console.error("加载封禁原因列表失败:", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // 触发搜索
  const handleSearch = useCallback(() => {
    setQuery((prev) => ({ ...prev, search: searchText || undefined, page: 1 }));
  }, [searchText]);

  // 删除操作
  const { execute: handleDelete } = useAsyncAction({
    successMessage: "删除成功",
    onSuccess: fetchList,
  });

  // 状态切换操作
  const { execute: handleToggleStatus } = useAsyncAction({
    successMessage: "状态更新成功",
    onSuccess: fetchList,
  });

  // --- 列定义 ---
  const columns = useMemo<Column<BanReason>[]>(
    () => [
      {
        key: "sort",
        title: "排序",
        dataIndex: "sort",
        width: 80,
        align: "center",
      },
      {
        key: "key",
        title: "键值",
        dataIndex: "key",
        width: 150,
      },
      {
        key: "label",
        title: "显示名称",
        dataIndex: "label",
        width: 200,
      },
      {
        key: "description",
        title: "描述说明",
        dataIndex: "description",
      },
      {
        key: "enabled",
        title: "启用",
        dataIndex: "enabled",
        width: 100,
        align: "center",
        render: (enabled: boolean, record) => (
          <Switch
            checked={enabled}
            onCheckedChange={(checked) =>
              handleToggleStatus(async () => {
                await PunishmentDictsService.punishmentDictsControllerUpdate({
                  id: record.id,
                  data: { enabled: checked },
                });
              })
            }
          />
        ),
      },
      {
        key: "createdAt",
        title: "创建时间",
        dataIndex: "createdAt",
        width: 180,
        render: (val: string) => {
          if (!val) return "-";
          return new Date(val).toLocaleString();
        },
      },
      {
        key: "actions",
        title: "操作",
        width: 150,
        align: "center",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="link"
              size="small"
              className="text-[14px]"
              onClick={() => {
                setEditRecord(record);
                setEditOpen(true);
              }}
            >
              编辑
            </Button>
            <Button
              variant="link"
              size="small"
              danger
              className="text-[14px]"
              onClick={() => {
                setDeleteRecord(record);
                setDeleteConfirmOpen(true);
              }}
            >
              删除
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete, handleToggleStatus],
  );

  // --- 效果钩子 ---
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    // 状态
    loading,
    data,
    total,
    query,
    setQuery,
    columns,
    // 搜索
    searchText,
    setSearchText,
    handleSearch,
    // 弹窗
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    editRecord,
    // 删除确认
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    deleteRecord,
    handleDelete,
    // 方法
    fetchList,
  };
};
