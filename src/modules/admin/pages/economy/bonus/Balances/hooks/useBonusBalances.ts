import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BonusAdminService } from "@/api/services/BonusAdminService";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import type { UserBonusBalance } from "../types/bonus";

export function useBonusBalances(form: any) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState<"balance" | "lockedBalance" | "updatedAt">("updatedAt");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");

  // 1. 查询参数构造
  const queryParams = useMemo(() => {
    const v = form.getFieldsValue();
    return {
      userId: v.userId?.trim() || undefined,
      isFrozen: v.isFrozen === undefined ? undefined : v.isFrozen,
      min: v.min?.trim() || undefined,
      max: v.max?.trim() || undefined,
      page,
      pageSize,
      sortBy,
      order,
    };
  }, [form, page, pageSize, sortBy, order]);

  // 2. 数据查询
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["bonus-balances", queryParams],
    queryFn: async () => {
      const resp: any = await BonusAdminService.bonusAccountControllerAdminListBalances(
        queryParams as any,
      );
      return resp?.data || { items: [], total: 0, page: 1, pageSize: 20 };
    },
  });

  // 3. 业务操作 (冻结/解冻)
  const { execute: freezeAction } = useAsyncAction({
    successMessage: "已冻结",
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bonus-balances"] }),
  });

  const { execute: unfreezeAction } = useAsyncAction({
    successMessage: "已解冻",
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bonus-balances"] }),
  });

  const handleFreeze = async (userId: string) => {
    await freezeAction(async () => {
      await BonusAdminService.bonusAccountControllerFreezeAccount({ userId });
    });
  };

  const handleUnfreeze = async (userId: string) => {
    await unfreezeAction(async () => {
      await BonusAdminService.bonusAccountControllerUnfreezeAccount({ userId });
    });
  };

  return {
    items: (data?.items || []) as UserBonusBalance[],
    total: data?.total || 0,
    loading: isLoading,
    page,
    pageSize,
    sortBy,
    order,
    setPage,
    setPageSize,
    setSortBy,
    setOrder,
    refetch,
    handleFreeze,
    handleUnfreeze,
  };
}
