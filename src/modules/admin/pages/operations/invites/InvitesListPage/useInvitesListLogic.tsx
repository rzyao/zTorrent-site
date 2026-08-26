import { useCallback, useMemo, useState } from "react";
import { useAccess } from "@/context/AccessContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Service as InvitesService } from "@/api/services/Service";
import { formatDate } from "@/modules/admin/utils/formatDate";
import Tag from "@/modules/admin/components/ui/tag";
import { Button } from "@/modules/admin/components/ui/button";
import type { Column } from "@/modules/admin/components/ui/data-table";
import { CodeCell } from "./components/CodeCell";
import { STATUS_COLOR_MAP, TYPE_COLOR_MAP } from "./constants";
import type { InviteRecord, InvitesListQuery, InviteStatus, InviteType } from "./types";

/**
 * 邀请列表页面逻辑 Hook
 * 使用 TanStack Query 进行数据管理
 */
export function useInvitesListLogic() {
  const queryClient = useQueryClient();

  // 分页状态
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // 筛选条件
  const [filters, setFilters] = useState<Omit<InvitesListQuery, "page" | "limit">>({});

  // 确认弹窗状态
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    type: "revoke" | "resend";
    title: string;
    content: string;
  } | null>(null);

  // 权限检查：统一从服务端校验后的 AccessContext 读取（不再信任前端 localStorage，避免篡改提权）
  const { access } = useAccess();
  const hasPerm = useCallback(
    (key: string) => access.username === "admin" || access.permissions.includes(key),
    [access],
  );

  // 构建查询参数
  const queryParams = useMemo(
    () => ({
      page,
      limit: pageSize,
      ...filters,
      sortBy: "createdAt" as const,
      order: "DESC" as const,
    }),
    [page, pageSize, filters],
  );

  // 使用 TanStack Query 获取数据
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "invites", "list", queryParams],
    queryFn: () => InvitesService.inviteRecordControllerListInvites(queryParams as any),
  });

  // 解析响应数据
  const items = useMemo(() => {
    const respData = (data as any)?.data;
    return Array.isArray(respData?.items) ? (respData.items as InviteRecord[]) : [];
  }, [data]);

  const total = useMemo(() => {
    const respData = (data as any)?.data;
    return Number(respData?.total || 0);
  }, [data]);

  // 撤销邀请 Mutation
  const revokeMutation = useMutation({
    mutationFn: (recordId: string) => InvitesService.inviteCoreControllerRevoke({ recordId }),
    onSuccess: () => {
      toast.success("已撤销");
      setConfirmOpen(false);
      setPendingAction(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "invites", "list"] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message || "撤销失败");
    },
  });

  // 重发邀请 Mutation
  const resendMutation = useMutation({
    mutationFn: (recordId: string) => InvitesService.inviteCoreControllerResend({ recordId }),
    onSuccess: () => {
      toast.success("已重发");
      setConfirmOpen(false);
      setPendingAction(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "invites", "list"] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message || "重发失败");
    },
  });

  // 撤销处理
  const handleRevoke = useCallback((record: InviteRecord) => {
    setPendingAction({
      id: record.id,
      type: "revoke",
      title: "确认撤销该邀请？",
      content: "仅允许未被接受且未过期的已发送邀请撤销；撤销后无法恢复。",
    });
    setConfirmOpen(true);
  }, []);

  // 重发处理
  const handleResend = useCallback((record: InviteRecord) => {
    setPendingAction({
      id: record.id,
      type: "resend",
      title: "确认重发该邀请？",
      content: "已接受或已撤销的邀请不可重发；过期的邀请重发后会重置过期时间并置为已发送。",
    });
    setConfirmOpen(true);
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (!pendingAction) return;
    if (pendingAction.type === "revoke") {
      revokeMutation.mutate(pendingAction.id);
    } else {
      resendMutation.mutate(pendingAction.id);
    }
  }, [pendingAction, revokeMutation, resendMutation]);

  // 导出处理
  const handleExport = useCallback(async () => {
    try {
      const resp = await InvitesService.inviteStatsControllerExport(filters as any);
      const url = (resp as any)?.data?.url;
      const expiresAt = (resp as any)?.data?.expiresAt;
      if (url) {
        toast.success(`导出文件已生成，有效期至：${expiresAt || "24小时内"}`);
        window.open(String(url), "_blank");
      } else {
        toast.error((resp as any)?.message || "导出失败");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "导出失败");
    }
  }, [filters]);

  // 搜索处理
  const onSearch = useCallback((values: Omit<InvitesListQuery, "page" | "limit">) => {
    setFilters(values);
    setPage(1);
  }, []);

  // 表格列定义
  const columns: Column<InviteRecord>[] = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 180,
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 170,
        render: (t: string) => formatDate(t),
      },
      {
        title: "发起人ID",
        dataIndex: "inviterUserId",
        key: "inviterUserId",
        width: 120,
      },
      {
        title: "被邀请邮箱",
        dataIndex: "inviteeEmail",
        key: "inviteeEmail",
        width: 200,
      },
      {
        title: "邀请码",
        dataIndex: "code",
        key: "code",
        width: 160,
        render: (v: string) => <CodeCell code={v} />,
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 100,
        render: (v: InviteStatus) => {
          const [color, label] = STATUS_COLOR_MAP[v] || ["default", v];
          return <Tag color={color}>{label}</Tag>;
        },
      },
      {
        title: "类型",
        dataIndex: "type",
        key: "type",
        width: 130,
        render: (v: InviteType) => {
          const [color, label] = TYPE_COLOR_MAP[v] || ["default", v];
          return <Tag color={color}>{label}</Tag>;
        },
      },
      {
        title: "过期/接受时间",
        key: "expiresOrAccepted",
        width: 170,
        render: (_, record) => formatDate(record.acceptedAt || record.expiresAt),
      },
      {
        title: "操作",
        key: "actions",
        width: 150,
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="small"
              disabled={!(hasPerm("manage-invites") && record.status === "sent")}
              onClick={() => handleRevoke(record)}
            >
              撤销
            </Button>
            <Button
              variant="default"
              size="small"
              disabled={
                !(
                  hasPerm("manage-invites") &&
                  (record.status === "sent" || record.status === "expired")
                )
              }
              onClick={() => handleResend(record)}
            >
              重发
            </Button>
          </div>
        ),
      },
    ],
    [hasPerm, handleRevoke, handleResend],
  );

  return {
    items,
    total,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    onSearch,
    columns,
    handleExport,
    // 弹窗状态
    confirmOpen,
    setConfirmOpen,
    pendingAction,
    handleConfirmAction,
    isProcessing: revokeMutation.isPending || resendMutation.isPending,
  };
}
