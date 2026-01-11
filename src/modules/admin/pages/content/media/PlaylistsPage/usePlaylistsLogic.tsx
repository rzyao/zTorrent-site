import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PlaylistsService } from "@/api/services/PlaylistsService";
import { PlaylistsReviewService } from "@/api/services/PlaylistsReviewService";
import { ReviewDto } from "@/api/models/ReviewDto";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { Column } from "@/modules/admin/components/ui/data-table";
import { Switch } from "@/modules/admin/components/ui/switch";
import { Button } from "@/modules/admin/components/ui/button";
import { Tag } from "@/modules/admin/components/ui/tag";
import {
  PlaylistItem,
  PlaylistQuery,
  DEFAULT_QUERY,
  ApprovalStatus,
  APPROVAL_STATUS_COLORS,
} from "./types";

/**
 * 片单管理核心逻辑 Hook
 * 负责数据获取、状态管理、列定义及 CRUD 操作
 */
export const usePlaylistsLogic = () => {
  const navigate = useNavigate();

  // --- 基础状态 ---
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PlaylistItem[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState<PlaylistQuery>(DEFAULT_QUERY);
  const [searchText, setSearchText] = useState("");

  // --- 行选择状态 ---
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // --- 弹窗状态 ---
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<PlaylistItem | null>(null);

  // --- 删除弹窗状态 ---
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<PlaylistItem | null>(null);

  // --- 审核弹窗状态 ---
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
  const [reviewIds, setReviewIds] = useState<string[]>([]);

  // --- 数据获取 ---
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const resp: any = await PlaylistsService.playlistCoreControllerAdminList({
        page: query.page,
        limit: query.limit,
        keyword: query.keyword || undefined,
        type: query.type as any, // 绕过类型检查以支持 UI 所有的业务类型
        visibility: query.visibility as any,
        ownerId: query.ownerUserId, // 映射 ownerUserId -> ownerId
        approvalStatus: query.approvalStatus,
      });
      const responseData = resp?.data;
      const sourceItems = responseData?.items || resp?.items || resp?.list || [];

      // 映射数据到标准格式
      setData(
        sourceItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          coverUrl: item.coverUrl,
          type: item.type,
          visibility: item.visibility,
          views: item.views,
          likes: item.likes,
          enabled: item.enabled,
          sort: item.sort,
          updatedAt: item.updatedAt,
          approvalStatus: item.approvalStatus,
          approvedAt: item.approvedAt,
        })),
      );
      setTotal(Number(responseData?.total || resp?.total || sourceItems.length || 0));
    } catch (error: any) {
      console.error("加载片单列表失败:", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // --- 搜索处理 ---
  const handleSearch = useCallback(() => {
    setQuery((prev) => ({ ...prev, keyword: searchText || undefined, page: 1 }));
  }, [searchText]);

  // --- 删除操作 ---
  const { execute: executeDelete, loading: deleteLoading } = useAsyncAction({
    successMessage: "删除成功",
    onSuccess: () => {
      setDeleteConfirmOpen(false);
      setDeleteRecord(null);
      fetchList();
    },
  });

  const handleDeleteExecute = useCallback(() => {
    if (deleteRecord) {
      executeDelete(async () => {
        await PlaylistsService.playlistCoreControllerDelete({ id: deleteRecord.id });
      });
    }
  }, [deleteRecord, executeDelete]);

  const openDeleteConfirm = useCallback((record: PlaylistItem) => {
    setDeleteRecord(record);
    setDeleteConfirmOpen(true);
  }, []);

  // --- 状态切换操作 ---
  const { execute: handleToggleEnabled } = useAsyncAction({
    successMessage: "状态更新成功",
    onSuccess: fetchList,
  });

  // --- 批量启用/禁用 ---
  const { execute: executeBatchEnable, loading: batchEnableLoading } = useAsyncAction({
    successMessage: "批量启用成功",
    onSuccess: () => {
      setSelectedIds([]);
      fetchList();
    },
  });

  const { execute: executeBatchDisable, loading: batchDisableLoading } = useAsyncAction({
    successMessage: "批量禁用成功",
    onSuccess: () => {
      setSelectedIds([]);
      fetchList();
    },
  });

  const handleBatchEnable = useCallback(() => {
    executeBatchEnable(async () => {
      for (const id of selectedIds) {
        await PlaylistsService.playlistCoreControllerUpdate({
          id,
          data: { enabled: true },
        } as any);
      }
    });
  }, [selectedIds, executeBatchEnable]);

  const handleBatchDisable = useCallback(() => {
    executeBatchDisable(async () => {
      for (const id of selectedIds) {
        await PlaylistsService.playlistCoreControllerUpdate({
          id,
          data: { enabled: false },
        } as any);
      }
    });
  }, [selectedIds, executeBatchDisable]);

  // --- 审核操作 ---
  const { execute: executeReview, loading: reviewLoading } = useAsyncAction({
    onSuccess: () => {
      setReviewOpen(false);
      setReviewIds([]);
      setSelectedIds([]);
      fetchList();
    },
  });

  const handleReviewExecute = useCallback(
    (note?: string) => {
      const action =
        reviewAction === "approve" ? ReviewDto.action.APPROVE : ReviewDto.action.REJECT;
      executeReview(async () => {
        for (const id of reviewIds) {
          await PlaylistsReviewService.playlistReviewControllerReview({
            id,
            action,
            note,
          });
        }
      });
    },
    [reviewIds, reviewAction, executeReview],
  );

  const openReviewApprove = useCallback(
    (ids: string[]) => {
      setReviewIds(ids);
      setReviewAction("approve");
      // 直接执行通过，无需填写备注
      executeReview(async () => {
        for (const id of ids) {
          await PlaylistsReviewService.playlistReviewControllerReview({
            id,
            action: ReviewDto.action.APPROVE,
          });
        }
      });
    },
    [executeReview],
  );

  const openReviewReject = useCallback((ids: string[]) => {
    setReviewIds(ids);
    setReviewAction("reject");
    setReviewOpen(true);
  }, []);

  // --- 导航方法 ---
  const openDetail = useCallback(
    (id: string) => {
      navigate(`/playlists/${id}`);
    },
    [navigate],
  );

  const openEdit = useCallback((record: PlaylistItem) => {
    setEditRecord(record);
    setEditOpen(true);
  }, []);

  // --- 列定义 ---
  const columns = useMemo<Column<PlaylistItem>[]>(
    () => [
      {
        key: "id",
        title: "ID",
        dataIndex: "id",
        width: 80,
        ellipsis: true,
      },
      {
        key: "title",
        title: "标题",
        dataIndex: "title",
        ellipsis: true,
      },
      {
        key: "coverUrl",
        title: "封面",
        dataIndex: "coverUrl",
        width: 100,
        ellipsis: true,
      },
      {
        key: "type",
        title: "类型",
        dataIndex: "type",
        width: 100,
        render: (type: string) => <Tag>{type || "-"}</Tag>,
      },
      {
        key: "visibility",
        title: "可见性",
        dataIndex: "visibility",
        width: 100,
        render: (visibility: string) => <Tag>{visibility || "-"}</Tag>,
      },
      {
        key: "views",
        title: "浏览",
        dataIndex: "views",
        width: 80,
        align: "right",
      },
      {
        key: "likes",
        title: "点赞",
        dataIndex: "likes",
        width: 80,
        align: "right",
      },
      {
        key: "enabled",
        title: "启用",
        dataIndex: "enabled",
        width: 80,
        align: "center",
        render: (enabled: boolean, record) => (
          <Switch
            checked={!!enabled}
            onCheckedChange={(checked) =>
              handleToggleEnabled(async () => {
                await PlaylistsService.playlistCoreControllerUpdate({
                  id: record.id,
                  data: { enabled: checked },
                } as any);
              })
            }
          />
        ),
      },
      {
        key: "sort",
        title: "排序",
        dataIndex: "sort",
        width: 80,
        align: "center",
      },
      {
        key: "updatedAt",
        title: "更新时间",
        dataIndex: "updatedAt",
        width: 160,
        render: (val: string) => formatDate(val),
      },
      {
        key: "approvalStatus",
        title: "审核状态",
        dataIndex: "approvalStatus",
        width: 100,
        align: "center",
        render: (status: ApprovalStatus) => (
          <Tag color={status ? APPROVAL_STATUS_COLORS[status] : "default"}>{status || "-"}</Tag>
        ),
      },
      {
        key: "approvedAt",
        title: "通过时间",
        dataIndex: "approvedAt",
        width: 160,
        render: (val: string) => formatDate(val),
      },
      {
        key: "actions",
        title: "操作",
        width: 240,
        render: (_, record) => (
          <div className="flex items-center gap-1">
            <Button
              variant="link"
              size="sm"
              className="text-[14px]"
              onClick={() => openDetail(record.id)}
            >
              详情
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-[14px]"
              onClick={() => openEdit(record)}
            >
              编辑
            </Button>
            <Button
              variant="link"
              size="sm"
              danger
              className="text-[14px]"
              onClick={() => openDeleteConfirm(record)}
            >
              删除
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-[14px]"
              onClick={() => openReviewApprove([record.id])}
            >
              通过
            </Button>
            <Button
              variant="link"
              size="sm"
              danger
              className="text-[14px]"
              onClick={() => openReviewReject([record.id])}
            >
              驳回
            </Button>
          </div>
        ),
      },
    ],
    [
      handleToggleEnabled,
      openDetail,
      openEdit,
      openDeleteConfirm,
      openReviewApprove,
      openReviewReject,
    ],
  );

  // --- 效果钩子 ---
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    // 基础状态
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
    // 行选择
    selectedIds,
    setSelectedIds,
    // 弹窗
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    editRecord,
    // 删除弹窗
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    deleteRecord,
    deleteLoading,
    handleDeleteExecute,
    // 批量操作
    handleBatchEnable,
    handleBatchDisable,
    batchEnableLoading,
    batchDisableLoading,
    // 审核弹窗
    reviewOpen,
    setReviewOpen,
    reviewAction,
    reviewIds,
    reviewLoading,
    handleReviewExecute,
    openReviewApprove,
    openReviewReject,
    // 方法
    fetchList,
  };
};
