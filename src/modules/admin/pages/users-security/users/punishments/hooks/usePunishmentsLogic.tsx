import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PunishmentsService } from "@/api/services/PunishmentsService";
import { UsersService } from "@/api/services/UsersService";
import { PunishmentDictsService } from "@/api/services/PunishmentDictsService";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { PunishmentRecord, DEFAULT_QUERY, PunishmentQuery, AdvRule } from "../types";
import { Column } from "@/modules/admin/components/ui/data-table";
import { Tag } from "@/modules/admin/components/ui/tag";
import { Button } from "@/modules/admin/components/ui/button";
import { ADV_OP_MAP } from "../constants";

export const usePunishmentsLogic = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // --- 状态定义 ---
  const [query, setQuery] = useState<PunishmentQuery>(() => ({
    ...DEFAULT_QUERY,
    userId: searchParams.get("userId") || undefined,
  }));

  const [searchText, setSearchText] = useState(searchParams.get("username") || "");

  // 弹窗状态
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [revokeRecord, setRevokeRecord] = useState<PunishmentRecord | null>(null);
  const [advOpen, setAdvOpen] = useState(false);
  const [advRules, setAdvRules] = useState<AdvRule[]>([]);
  // 使用 explicit string type 以匹配后端枚举
  const [advLogic, setAdvLogic] = useState<"AND" | "OR">("AND");

  // --- 字典数据加载 ---
  const { data: optionsData } = useQuery({
    queryKey: ["punishment-dicts"],
    queryFn: async () => {
      const [types, reasons, unbans] = await Promise.all([
        PunishmentDictsService.punishmentDictsControllerOptions({ category: "PUNISHMENT_TYPE" }),
        PunishmentDictsService.punishmentDictsControllerOptions({ category: "BAN_REASON" }),
        PunishmentDictsService.punishmentDictsControllerOptions({ category: "UNBAN_REASON" }),
      ]);
      return {
        typeOptions: (types.data || []).map((x: any) => ({ label: x.label, value: x.key })),
        reasonOptions: (reasons.data || []).map((x: any) => ({ label: x.label, value: x.key })),
        revokeReasonOptions: (unbans.data || []).map((x: any) => ({
          label: x.label,
          value: x.key,
        })),
      };
    },
    staleTime: 1000 * 60 * 10,
  });

  const typeOptions = optionsData?.typeOptions || [];
  const reasonOptions = optionsData?.reasonOptions || [];
  const revokeReasonOptions = optionsData?.revokeReasonOptions || [];

  // --- 列表分页查询 ---
  const {
    data: listData,
    isLoading: loading,
    refetch: fetchList,
  } = useQuery({
    queryKey: ["punishment-records", query, advRules, advLogic],
    queryFn: async () => {
      const hasAdvRules = advRules && advRules.length > 0;

      const res = await PunishmentsService.punishmentsControllerListPunishmentRecords({
        page: query.page,
        limit: query.limit,
        userId: query.userId,
        type: query.type,
        reason: query.reason,
        revoked: query.revoked,
        active: query.active,
        sortBy: query.sortBy as any,
        order: query.order as any,
        // 核心修复：仅在确实有高级规则时才传递 logic 和 rules
        ...(hasAdvRules
          ? {
              logic: advLogic as any,
              rules: advRules.map((r) => ({
                field: r.field as any,
                op: (ADV_OP_MAP[r.op] || r.op) as any,
                value: r.value as any,
                range: r.range as any,
              })),
            }
          : {}),
      });

      const items = (res as any)?.data?.items || (res as any)?.items || [];
      const totalCount = (res as any)?.data?.total || (res as any)?.total || 0;
      return { items, totalCount };
    },
  });

  const data = listData?.items || [];
  const total = listData?.totalCount || 0;

  // --- 交互逻辑 ---
  const handleSearch = useCallback(async () => {
    if (!searchText) {
      setQuery((prev) => ({ ...prev, userId: undefined, page: 1 }));
      return;
    }

    try {
      const res = (await UsersService.usersControllerListUsers({
        username: searchText,
        page: 1,
        limit: 1,
      })) as any;

      const users = res?.data?.items || res?.items || [];
      const firstUser = users[0];

      setQuery((prev) => ({
        ...prev,
        userId: firstUser ? String(firstUser.id) : "-1",
        page: 1,
      }));
    } catch (error) {
      console.error("搜索用户失败:", error);
    }
  }, [searchText]);

  const handleFilterChange = useCallback((key: keyof PunishmentQuery, value: any) => {
    setQuery((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setAdvRules([]);
    setAdvLogic("AND");
    setAdvOpen(false);
    setQuery((prev) => ({ ...prev, userId: undefined, page: 1 }));
    setSearchText("");
  }, []);

  // --- 撤销操作 ---
  const { execute: executeRevoke, loading: revokeLoading } = useAsyncAction({
    successMessage: "已撤销该处罚",
    onSuccess: () => {
      setRevokeOpen(false);
      setRevokeRecord(null);
      queryClient.invalidateQueries({ queryKey: ["punishment-records"] });
    },
  });

  const handleRevokeExecute = useCallback(
    async (formData: { reason: string; detailReason?: string }) => {
      if (revokeRecord?.id) {
        await executeRevoke(async () => {
          await PunishmentsService.punishmentsControllerRevoke({
            id: revokeRecord.id,
            revokeReason: formData.reason,
            revokeDetailReason: formData.detailReason,
          });
        });
      }
    },
    [revokeRecord, executeRevoke],
  );

  // --- 列配置 ---
  const columns = useMemo<Column<PunishmentRecord>[]>(
    () => [
      {
        key: "userUsername",
        title: "用户名",
        dataIndex: "userUsername",
        width: 120,
        render: (val) => val || "-",
      },
      {
        key: "type",
        title: "类型",
        dataIndex: "type",
        width: 120,
        render: (_, record) => <Tag variant="purple">{record.typeLabel || record.type || "-"}</Tag>,
      },
      {
        key: "reason",
        title: "原因",
        dataIndex: "reason",
        width: 150,
        render: (_, record) => record.reasonLabel || record.reason || "-",
      },
      {
        key: "startsAt",
        title: "开始时间",
        dataIndex: "startsAt",
        width: 160,
        render: (val) => (val ? new Date(val).toLocaleString() : "-"),
      },
      {
        key: "expiresAt",
        title: "截止时间",
        dataIndex: "expiresAt",
        width: 160,
        render: (val) => (val ? new Date(val).toLocaleString() : "-"),
      },
      {
        key: "recordSource",
        title: "状态",
        dataIndex: "recordSource",
        width: 100,
        render: (val) =>
          val === "active" ? <Tag variant="success">生效</Tag> : <Tag variant="default">失效</Tag>,
      },
      {
        key: "revoked",
        title: "撤销",
        dataIndex: "revoked",
        width: 100,
        render: (val) => (val ? <Tag variant="warning">已撤销</Tag> : "-"),
      },
      {
        key: "actions",
        title: "操作",
        width: 100,
        align: "center",
        render: (_, record) => (
          <Button
            variant="link"
            size="sm"
            disabled={record.recordSource !== "active" || !!record.revoked}
            onClick={() => {
              setRevokeRecord(record);
              setRevokeOpen(true);
            }}
          >
            撤销
          </Button>
        ),
      },
    ],
    [],
  );

  // 初始化 URL 搜索
  useEffect(() => {
    const username = searchParams.get("username");
    if (username) {
      handleSearch();
    }
  }, []);

  return {
    loading,
    data,
    total,
    query,
    columns,
    searchText,
    setSearchText,
    handleSearch,
    revokeOpen,
    setRevokeOpen,
    revokeRecord,
    advOpen,
    setAdvOpen,
    typeOptions,
    reasonOptions,
    revokeReasonOptions,
    revokeLoading,
    handleRevokeExecute,
    advRules,
    setAdvRules,
    advLogic,
    setAdvLogic,
    handleFilterChange,
    handleReset,
    fetchList,
  };
};
