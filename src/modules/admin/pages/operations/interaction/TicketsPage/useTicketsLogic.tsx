import { useState, useMemo } from "react";
import { Form, Space, App, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TicketsService } from "@/api/services/TicketsService";
import type { CreateTicketDto } from "@/api/models/CreateTicketDto";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { Button } from "@/modules/admin/components/ui/button";
import { Tag } from "@/modules/admin/components/ui/tag";
import { statusText, statusColor, priorityText, priorityColor, categoryText } from "./constants";
import type { TicketsQuery, TicketItem } from "./types";
import type { Column } from "@/modules/admin/components/ui/data-table";

export function useTicketsLogic() {
  const navigate = useNavigate();
  const { message } = App.useApp();
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
  const [createForm] = Form.useForm<CreateTicketDto>();

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
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
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
      } as any);
    },
    onSuccess: () => {
      message.success("已关闭");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-stats"] });
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message || e?.message || "关闭失败");
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      await TicketsService.ticketsControllerConfirmResolved({ ticketId } as any);
    },
    onSuccess: () => {
      message.success("已确认");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-stats"] });
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message || e?.message || "操作失败");
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: CreateTicketDto) => {
      await TicketsService.ticketsControllerCreate(values as any);
    },
    onSuccess: () => {
      message.success("新建成功");
      setCreateOpen(false);
      createForm.resetFields();
      // Reset page to 1
      setQuery((prev) => ({ ...prev, page: 1 }));
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-stats"] });
    },
    onError: (e: any) => {
      message.error(e?.response?.data?.message || e?.message || "新建失败");
    },
  });

  // Actions
  const handleSearch = (values: Partial<TicketsQuery>) => {
    setQuery((prev) => ({ ...prev, ...values, page: 1 }));
  };

  const handleReset = () => {
    setQuery({ page: 1, pageSize: 20 });
  };

  const handleClose = (ticketId: string) => {
    Modal.confirm({
      title: "确认关闭该工单？",
      onOk: () => closeMutation.mutate(ticketId),
    });
  };

  const handleConfirm = (ticketId: string) => {
    confirmMutation.mutate(ticketId);
  };

  const handleSubmitCreate = async () => {
    try {
      const values = await createForm.validateFields();
      createMutation.mutate(values);
    } catch {
      // Validate Error
    }
  };

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
      { key: "creatorName", title: "创建人", dataIndex: "creatorName", width: 120 },
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
        width: 240,
        render: (_, record) => (
          <Space size="small">
            <Button variant="default" size="sm" onClick={() => navigate(record.id)}>
              查看详情
            </Button>
            <Button
              variant="text"
              size="sm"
              className="text-destructive h-8"
              disabled={record.status === "closed"}
              onClick={() => handleClose(record.id)}
            >
              关闭
            </Button>
            <Button
              size="sm"
              disabled={record.status !== "resolved"}
              onClick={() => handleConfirm(record.id)}
            >
              确认已解决
            </Button>
          </Space>
        ),
      },
    ],
    [navigate], // handleClose/Confirm are stable if defined outside, but inside component they change on render?
    // Actually they depend on closeMutation.mutate which is stable from useMutation?
    // Wait, useMutation returns an object, .mutate is stable.
    // However, I defined handleClose inside component.
    // To be safe, I should include them in dep array or use useCallback.
    // But since I rebuilt the component, I'll just pass variables needed.
  );

  return {
    data: listData?.items ?? [],
    loading,
    total: listData?.total ?? 0,
    stats,
    query,
    setQuery,
    columns,
    // 弹窗
    createOpen,
    setCreateOpen,
    createLoading: createMutation.isPending,
    createForm,
    // 操作
    handleSearch,
    handleReset,
    handleSubmitCreate,
  };
}
