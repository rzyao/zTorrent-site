import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BonusAdminService } from "@/api/services/BonusAdminService";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import type { BonusAdjustment, ListBonusAdjustmentsDto } from "@/modules/admin/types/store";

export function useBonusAdjustments() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [userFilter, setUserFilter] = useState<string | undefined>(undefined);

  // 1. 数据查询
  const queryParams = useMemo<ListBonusAdjustmentsDto>(
    () => ({ userId: userFilter, page, pageSize: limit }),
    [userFilter, page, limit],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["bonus-adjustments", queryParams],
    queryFn: async () => {
      const resp: any = await BonusAdminService.bonusAccountControllerAdminListLedger(
        queryParams as any,
      );
      const data = resp?.data ?? resp;

      const items = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(resp?.items)
          ? resp.items
          : [];

      const total = Number(data?.total ?? resp?.total ?? items.length);

      return {
        items: items as BonusAdjustment[],
        total,
      };
    },
  });

  // 2. 调账操作
  const { execute: adjustBonus, loading: adjusting } = useAsyncAction({
    successMessage: "调账成功",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bonus-adjustments"] });
    },
  });

  const handleAdjust = async (values: {
    userId: string;
    amount: number;
    type: "credit" | "debit";
    reason: string;
    ref?: string;
  }) => {
    await adjustBonus(async () => {
      const delta = String(
        values.type === "debit"
          ? -Math.abs(Number(values.amount))
          : Math.abs(Number(values.amount)),
      );

      await BonusAdminService.bonusAccountControllerAdminAdjust({
        userId: String(values.userId),
        delta,
        reason: String(values.reason),
        externalRef: values.ref ? String(values.ref) : undefined,
      } as any);
    });
  };

  return {
    // 状态
    items: data?.items ?? [],
    total: data?.total ?? 0,
    loading: isLoading,
    adjusting,

    // 分页与筛选
    page,
    limit,
    userFilter,
    setPage,
    setLimit,
    setUserFilter,

    // 操作
    handleAdjust,
  };
}
