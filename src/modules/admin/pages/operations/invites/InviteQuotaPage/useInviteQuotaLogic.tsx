import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Service as InvitesService } from "@/api/services/Service";
import { formatDate } from "@/modules/admin/utils/formatDate";
import Tag from "@/modules/admin/components/ui/tag";
import type { Column } from "@/modules/admin/components/ui/data-table";
import type { InviteQuota, InviteQuotaQuery } from "./types";

/**
 * 邀请名额页面逻辑 Hook
 * 使用 TanStack Query 进行数据管理
 */
export function useInviteQuotaLogic() {
  // 分页状态
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // 筛选条件
  const [filters, setFilters] = useState<Omit<InviteQuotaQuery, "page" | "limit">>({});

  // 构建查询参数
  const queryParams = useMemo(
    () => ({
      page,
      limit: pageSize,
      ...filters,
    }),
    [page, pageSize, filters],
  );

  // 使用 TanStack Query 获取数据
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "invites", "quota", queryParams],
    queryFn: () => InvitesService.inviteQuotaControllerListQuotas(queryParams),
  });

  // 解析响应数据
  const items = useMemo(() => {
    const respData = (data as any)?.data;
    return Array.isArray(respData?.items) ? (respData.items as InviteQuota[]) : [];
  }, [data]);

  const total = useMemo(() => {
    const respData = (data as any)?.data;
    return Number(respData?.total || 0);
  }, [data]);

  // 搜索处理
  const onSearch = useCallback(
    (values: { userId?: string; permanentOnly?: boolean; activeOnly?: boolean }) => {
      setFilters({
        userId: values.userId,
        permanentOnly: values.permanentOnly,
        activeOnly: values.activeOnly,
      });
      setPage(1); // 重置到第一页
    },
    [],
  );

  // 表格列定义
  const columns: Column<InviteQuota>[] = useMemo(
    () => [
      {
        title: "名额ID",
        dataIndex: "id",
        key: "id",
        width: 160,
      },
      {
        title: "用户ID",
        dataIndex: "userId",
        key: "userId",
        width: 140,
      },
      {
        title: "类型",
        dataIndex: "isPermanent",
        key: "isPermanent",
        width: 100,
        render: (v: boolean) =>
          v ? <Tag color="purple">永久</Tag> : <Tag color="default">临时</Tag>,
      },
      {
        title: "过期时间",
        dataIndex: "expiresAt",
        key: "expiresAt",
        width: 180,
        render: (v: string) => formatDate(v),
      },
      {
        title: "消耗时间",
        dataIndex: "consumedAt",
        key: "consumedAt",
        width: 180,
        render: (v: string) => formatDate(v),
      },
      {
        title: "消耗记录ID",
        dataIndex: "consumedRecordId",
        key: "consumedRecordId",
        width: 180,
      },
    ],
    [],
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
  };
}
