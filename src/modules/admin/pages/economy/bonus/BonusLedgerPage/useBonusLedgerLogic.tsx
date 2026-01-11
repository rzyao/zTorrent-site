import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BonusAdminService } from "@/api/services/BonusAdminService";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { formatDate } from "@/modules/admin/utils/formatDate";
import type { UserBonusLedger, BonusLedgerQuery } from "./types";
import { Button } from "@/modules/admin/components/ui/button";
import type { Column } from "@/modules/admin/components/ui/data-table";

export function useBonusLedgerLogic() {
  const { search } = useLocation();
  const queryClient = useQueryClient();
  const initUserId = useMemo(
    () => new URLSearchParams(search).get("userId") || undefined,
    [search],
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filters, setFilters] = useState<Omit<BonusLedgerQuery, "page" | "pageSize">>({
    userId: initUserId,
  });

  const queryParams = useMemo(
    () => ({
      ...filters,
      page,
      pageSize,
    }),
    [filters, page, pageSize],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "bonus", "ledger", queryParams],
    queryFn: () => BonusAdminService.bonusAccountControllerAdminListLedger(queryParams as any),
  });

  const ledgerData = (data?.data?.items || []) as UserBonusLedger[];
  const total = data?.data?.total || 0;

  const { execute: executeReverse } = useAsyncAction({
    successMessage: "已冲正",
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "bonus", "ledger"] }),
  });

  const handleReverse = useCallback(
    (record: UserBonusLedger) => {
      executeReverse(async () => {
        const adminUserId = localStorage.getItem("userId") || "0";
        await BonusAdminService.bonusAccountControllerAdminReverse({
          ledgerId: String(record.id || ""),
          adminUserId,
          reason: "admin_reverse",
        });
      });
    },
    [executeReverse],
  );

  const onSearch = useCallback((values: any) => {
    const range = values.range as [any, any] | undefined;
    setFilters({
      userId: values.userId?.trim() || undefined,
      type: values.type?.trim() || undefined,
      reason: values.reason?.trim() || undefined,
      externalRef: values.externalRef?.trim() || undefined,
      correlationId: values.correlationId?.trim() || undefined,
      from: range?.[0]?.toISOString(),
      to: range?.[1]?.toISOString(),
    });
    setPage(1);
  }, []);

  const columns: Column<UserBonusLedger>[] = useMemo(
    () => [
      {
        title: "时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 200,
        render: (s: string) => formatDate(s),
      },
      { title: "用户名", dataIndex: "username", key: "username", width: 160 },
      { title: "类型", dataIndex: "type", key: "type", width: 160 },
      { title: "原因", dataIndex: "reason", key: "reason", width: 200 },
      { title: "变动值", dataIndex: "delta", key: "delta", width: 140 },
      { title: "余额(后)", dataIndex: "balanceAfter", key: "balanceAfter", width: 160 },
      { title: "引用类型", dataIndex: "refType", key: "refType", width: 140 },
      { title: "引用ID", dataIndex: "refId", key: "refId", width: 140 },
      { title: "幂等键", dataIndex: "externalRef", key: "externalRef", width: 220 },
      { title: "关联ID", dataIndex: "correlationId", key: "correlationId", width: 220 },
      {
        title: "操作",
        key: "actions",
        fixed: "right" as any,
        width: 140,
        render: (_, record) => (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleReverse(record)}
            disabled={record.type === "ADMIN_REVERSE"}
          >
            冲正
          </Button>
        ),
      },
    ],
    [handleReverse],
  );

  const handleExport = useCallback(() => {
    // 暂时保持与原版一致的提示
    import("antd").then(({ message }) => {
      message.warning("导出功能暂不可用");
    });
  }, []);

  return {
    ledgerData,
    total,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    onSearch,
    columns,
    initUserId,
    handleExport,
  };
}
