import { useState, useCallback, useMemo, useEffect } from "react";
import { Form, Tag, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { TicketsService } from "@/api/services/TicketsService";
import type { CreateTicketDto } from "@/api/models/CreateTicketDto";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { Button } from "@/modules/admin/components/ui/button";
import { statusText, statusColor, priorityText, priorityColor, categoryText } from "./constants";
import type { TicketsQuery, TicketItem, TicketStats } from "./types";
import type { Column } from "@/modules/admin/components/ui/data-table";

export function useTicketsLogic() {
  const navigate = useNavigate();
  const [data, setData] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<TicketStats>({
    pending: 0,
    processing: 0,
    resolved: 0,
    closed: 0,
  });
  const [query, setQuery] = useState<TicketsQuery>({
    page: 1,
    pageSize: 20,
  });
  const [total, setTotal] = useState(0);

  // 新建工单弹窗
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm] = Form.useForm<CreateTicketDto>();

  const { execute: executeClose } = useAsyncAction({
    successMessage: "已关闭",
  });

  const { execute: executeConfirm } = useAsyncAction({
    successMessage: "已确认",
  });

  const { execute: executeCreate, loading: createLoading } = useAsyncAction({
    successMessage: "新建成功",
  });

  // 加载列表
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await TicketsService.ticketsControllerList({
        page: query.page,
        pageSize: query.pageSize,
        status: query.status as any,
        category: query.category as any,
        keyword: query.keyword,
      });
      setData(res?.data?.items ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (e) {
      console.error("加载工单列表失败", e);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // 加载统计
  const fetchStats = useCallback(async () => {
    try {
      const res: any = await TicketsService.ticketsControllerStats();
      setStats(res?.data || { pending: 0, processing: 0, resolved: 0, closed: 0 });
    } catch (e) {
      // 统计失败不影响主流程
    }
  }, []);

  useEffect(() => {
    loadData();
    fetchStats();
  }, [loadData, fetchStats]);

  // 处理搜索
  const handleSearch = useCallback((values: any) => {
    setQuery((prev) => ({ ...prev, ...values, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setQuery({ page: 1, pageSize: 20 });
  }, []);

  // 操作
  const handleClose = useCallback(
    async (ticketId: string) => {
      if (confirm("确认关闭该工单？")) {
        await executeClose(async () => {
          await TicketsService.ticketsControllerClose({
            ticketId,
            reason: "后台关闭",
          } as any);
          loadData();
          fetchStats();
        });
      }
    },
    [executeClose, loadData, fetchStats],
  );

  const handleConfirm = useCallback(
    async (ticketId: string) => {
      await executeConfirm(async () => {
        await TicketsService.ticketsControllerConfirmResolved({ ticketId } as any);
        loadData();
        fetchStats();
      });
    },
    [executeConfirm, loadData, fetchStats],
  );

  const handleSubmitCreate = useCallback(async () => {
    const values = await createForm.validateFields();
    await executeCreate(async () => {
      await TicketsService.ticketsControllerCreate(values as any);
      setCreateOpen(false);
      createForm.resetFields();
      setQuery((prev) => ({ ...prev, page: 1 }));
      fetchStats();
    });
  }, [createForm, executeCreate, fetchStats]);

  // 列定义
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
    [navigate, handleClose, handleConfirm],
  );

  return {
    data,
    loading,
    total,
    stats,
    query,
    setQuery,
    columns,
    // 弹窗
    createOpen,
    setCreateOpen,
    createLoading,
    createForm,
    // 操作
    handleSearch,
    handleReset,
    handleSubmitCreate,
  };
}
