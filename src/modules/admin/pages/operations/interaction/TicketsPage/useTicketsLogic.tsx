import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { TicketsService } from "@/api/services/TicketsService";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { Button } from "@/modules/admin/components/ui/button";
import { Tag } from "@/modules/admin/components/ui/tag";
import { statusText, statusColor, priorityText, priorityColor, categoryText } from "./constants";
import type { TicketsQuery, TicketItem } from "./types";
import type { Column } from "@/modules/admin/components/ui/data-table";

const createTicketSchema = z.object({
  title: z.string().min(1, "请输入标题").max(200, "标题最长200个字符"),
  category: z.string().min(1, "请选择类别"),
  priority: z.string().min(1, "请选择优先级"),
  content: z.string().min(1, "请输入描述内容"),
});

type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

export function useTicketsLogic() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 查询状态
  const [query, setQuery] = useState<TicketsQuery>({
    page: 1,
    pageSize: 20,
    status: undefined,
    category: undefined,
    keyword: undefined,
  });

  // 新建工单弹窗
  const [createOpen, setCreateOpen] = useState(false);

  // 二次确认弹窗
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTicketId, setPendingTicketId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      category: "",
      priority: "",
      content: "",
    },
  });

  // 1. 获取列表 (React Query)
  const { data: listData, isLoading: loading } = useQuery({
    queryKey: ["tickets", query],
    queryFn: async () => {
      const res: any = await TicketsService.ticketsControllerList({
        page: query.page,
        pageSize: query.pageSize,
        status: query.status as any,
        category: query.category as any,
        keyword: query.keyword,
      });
      return {
        items: res?.data?.items ?? [],
        total: res?.data?.total ?? 0,
      };
    },
    placeholderData: (previousData) => previousData,
  });

  // 2. 获取统计 (React Query)
  const { data: stats } = useQuery({
    queryKey: ["tickets-stats"],
    queryFn: async () => {
      const res: any = await TicketsService.ticketsControllerStats();
      return res?.data || { pending: 0, processing: 0, resolved: 0, closed: 0 };
    },
    initialData: { pending: 0, processing: 0, resolved: 0, closed: 0 },
  });

  // Mutations
  const closeMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      await TicketsService.ticketsControllerClose({
        ticketId,
        reason: "后台关闭",
        clientRequestId: crypto.randomUUID(),
      } as any);
    },
    onSuccess: () => {
      toast.success("已关闭");
      setConfirmOpen(false);
      setPendingTicketId(null);
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-stats"] });
    },
    onError: (e: any) => {
      console.error(e?.message || "关闭失败");
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      await TicketsService.ticketsControllerConfirmResolved({
        ticketId,
        clientRequestId: crypto.randomUUID(),
      } as any);
    },
    onSuccess: () => {
      toast.success("已确认");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-stats"] });
    },
    onError: (e: any) => {
      console.error(e?.message || "操作失败");
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: CreateTicketFormValues) => {
      await TicketsService.ticketsControllerCreate(values as any);
    },
    onSuccess: () => {
      toast.success("新建成功");
      setCreateOpen(false);
      reset();
      setQuery((prev) => ({ ...prev, page: 1 }));
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-stats"] });
    },
    onError: (e: any) => {
      console.error(e?.message || "新建失败");
    },
  });

  // Actions
  const handleSearch = useCallback((values: Partial<TicketsQuery>) => {
    setQuery((prev) => ({ ...prev, ...values, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setQuery({ page: 1, pageSize: 20 });
  }, []);

  const handleCloseClick = useCallback((ticketId: string) => {
    setPendingTicketId(ticketId);
    setConfirmOpen(true);
  }, []);

  const handleConfirmClose = useCallback(() => {
    if (pendingTicketId) {
      closeMutation.mutate(pendingTicketId);
    }
  }, [pendingTicketId, closeMutation]);

  const handleConfirmResolved = useCallback(
    (ticketId: string) => {
      confirmMutation.mutate(ticketId);
    },
    [confirmMutation],
  );

  const onSubmitCreate = handleSubmit((values) => {
    createMutation.mutate(values);
  });

  // Columns
  const columns = useMemo<Column<TicketItem>[]>(
    () => [
      { key: "id", title: "工单ID", dataIndex: "id", width: 160 },
      { key: "title", title: "标题", dataIndex: "title", ellipsis: true },
      {
        key: "priority",
        title: "优先级",
        dataIndex: "priority",
        width: 100,
        render: (v: string) => <Tag color={priorityColor[v]}>{priorityText[v]}</Tag>,
      },
      {
        key: "status",
        title: "状态",
        dataIndex: "status",
        width: 100,
        render: (v: string) => <Tag color={statusColor[v]}>{statusText[v]}</Tag>,
      },
      {
        key: "category",
        title: "类别",
        dataIndex: "category",
        width: 100,
        render: (v: string) => categoryText[v],
      },
      { key: "createdBy", title: "创建人", dataIndex: "createdBy", width: 120 },
      {
        key: "createdAt",
        title: "创建时间",
        dataIndex: "createdAt",
        width: 160,
        render: (v: string) => formatDate(v),
      },
      {
        key: "action",
        title: "操作",
        align: "center",
        width: 240,
        render: (_, record) => (
          <div className="flex justify-center gap-2">
            <Button variant="link" size="small" onClick={() => navigate(record.id)}>
              详情
            </Button>
            <Button
              variant="link"
              danger
              size="small"
              disabled={record.status === "closed"}
              onClick={() => handleCloseClick(record.id)}
            >
              关闭
            </Button>
            <Button
              variant="link"
              size="small"
              disabled={record.status !== "resolved"}
              onClick={() => handleConfirmResolved(record.id)}
            >
              已解决
            </Button>
          </div>
        ),
      },
    ],
    [navigate, handleCloseClick, handleConfirmResolved],
  );

  return {
    data: listData?.items ?? [],
    loading,
    total: listData?.total ?? 0,
    stats,
    query,
    setQuery,
    columns,
    // 弹窗状态
    createOpen,
    setCreateOpen,
    createLoading: createMutation.isPending,
    control,
    errors,
    // 确认弹窗
    confirmOpen,
    setConfirmOpen,
    handleConfirmClose,
    isClosing: closeMutation.isPending,
    // 操作
    handleSearch,
    handleReset,
    onSubmitCreate,
  };
}
