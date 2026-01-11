import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { StoreService } from "@/api/services/StoreService";
import type { StoreOrder, ListStoreOrdersDto } from "@/modules/admin/types/store";
import { formatDate } from "@/modules/admin/utils/formatDate";
import type { Column } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { Tag } from "tag";

export function useStoreOrdersLogic() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Query Filters
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [itemId, setItemId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<StoreOrder["status"] | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[string, string] | undefined>(undefined);

  // Detail Drawer State
  const [detailOrder, setDetailOrder] = useState<StoreOrder | null>(null);

  const queryParams: ListStoreOrdersDto = {
    page,
    pageSize,
    userId,
    itemId,
    status,
    from: dateRange?.[0],
    to: dateRange?.[1],
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["store-orders", queryParams],
    queryFn: () => StoreService.storeControllerListOrders(queryParams as any),
    placeholderData: (previousData) => previousData,
  });

  const orders = (data?.data?.items || []) as StoreOrder[];
  const total = data?.data?.total || 0;

  const handleSearch = useCallback((newUserId?: string, newItemId?: string) => {
    setUserId(newUserId || undefined);
    setItemId(newItemId || undefined);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setUserId(undefined);
    setItemId(undefined);
    setStatus(undefined);
    setDateRange(undefined);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
  }, []);

  const handleExportCsv = useCallback(() => {
    try {
      if (!orders || orders.length === 0) {
        toast.warning("当前列表无数据");
        return;
      }

      const headers = [
        "id",
        "userId",
        "itemId",
        "status",
        "pointsCharged",
        "quantity",
        "createdAt",
      ];
      const rows = orders.map((it) => [
        it.id,
        it.userId,
        it.itemId,
        it.status,
        it.pointsCharged,
        it.quantity,
        it.createdAt || "",
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("导出成功");
    } catch (e) {
      console.error(e);
      toast.error("导出失败");
    }
  }, [orders]);

  // 状态对应的 Tag variant 映射
  const getStatusVariant = (s: StoreOrder["status"]) => {
    switch (s) {
      case "delivered":
        return "success";
      case "failed":
        return "error";
      case "refunded":
        return "warning";
      case "paid":
        return "primary";
      default:
        return "default";
    }
  };

  const columns = useMemo<Column<StoreOrder>[]>(
    () => [
      { title: "订单ID", dataIndex: "id", key: "id", width: 180 },
      { title: "用户ID", dataIndex: "userId", key: "userId", width: 160 },
      { title: "商品ID", dataIndex: "itemId", key: "itemId", width: 160 },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 140,
        render: (s: StoreOrder["status"]) => <Tag variant={getStatusVariant(s)}>{s}</Tag>,
      },
      { title: "扣除魔力", dataIndex: "pointsCharged", key: "pointsCharged", width: 140 },
      { title: "数量", dataIndex: "quantity", key: "quantity", width: 100 },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 200,
        render: (t: string) => formatDate(t),
      },
      {
        title: "操作",
        key: "action",
        width: 160,
        render: (_, r) => (
          <Button variant="link" size="sm" onClick={() => setDetailOrder(r)}>
            交付详情
          </Button>
        ),
      },
    ],
    [setDetailOrder],
  );

  return {
    items: orders,
    total,
    loading: isLoading,
    page,
    pageSize,
    filters: {
      userId,
      itemId,
      status,
      dateRange,
    },
    setFilters: {
      setStatus,
      setDateRange,
    },
    handleSearch,
    handleReset,
    handlePageChange,
    handleExportCsv,
    columns,
    detailOrder,
    setDetailOrder,
  };
}
