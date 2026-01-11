import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BonusAdminService } from "@/api/services/BonusAdminService";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { Column } from "@/modules/admin/components/ui/data-table";
import { Button } from "@/modules/admin/components/ui/button";
import { Tag } from "tag";
import { UserBonusBalance, BonusBalanceQuery, DEFAULT_QUERY } from "./types";

/**
 * 魔力值余额管理核心逻辑 Hook
 */
export const useBonusBalancesLogic = () => {
  const navigate = useNavigate();

  // --- 状态管理 ---
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserBonusBalance[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState<BonusBalanceQuery>(DEFAULT_QUERY);

  // 搜索框独立状态，避免打字时触发请求
  const [searchText, setSearchText] = useState(query.userId || "");

  // 弹窗状态
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<UserBonusBalance | null>(null);

  // 删除(冻结/解冻)确认
  const [freezeConfirmOpen, setFreezeConfirmOpen] = useState(false);
  const [unfreezeConfirmOpen, setUnfreezeConfirmOpen] = useState(false);
  const [actionRecord, setActionRecord] = useState<UserBonusBalance | null>(null);

  // --- 数据获取 ---
  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const resp: any = await BonusAdminService.bonusAccountControllerAdminListBalances({
        page: query.page,
        pageSize: query.limit,
        userId: query.userId || undefined,
        isFrozen: query.isFrozen,
        min: query.min || undefined,
        max: query.max || undefined,
        sortBy: query.sortBy,
        order: query.order,
      } as any);

      const responseData = resp?.data || resp; // 兼容不同响应结构
      setData(responseData?.items || []);
      setTotal(responseData?.total || 0);
    } catch (error) {
      console.error("加载魔力值余额列表失败:", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // --- 搜索处理 ---
  const handleSearch = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      userId: searchText.trim() || undefined, // 只在确认时应用搜索词
      page: 1,
    }));
  }, [searchText]);

  // 辅助：重置查询
  const resetQuery = useCallback(() => {
    setSearchText("");
    setQuery(DEFAULT_QUERY);
  }, []);

  const updateQuery = useCallback((newQuery: Partial<BonusBalanceQuery>) => {
    setQuery((prev) => ({ ...prev, ...newQuery, page: 1 }));
  }, []);

  // --- 冻结操作 ---
  const { execute: executeFreeze, loading: freezeLoading } = useAsyncAction({
    successMessage: "冻结成功",
    onSuccess: () => {
      setFreezeConfirmOpen(false);
      fetchList();
    },
  });

  const handleFreezeExecute = useCallback(() => {
    if (actionRecord) {
      executeFreeze(async () => {
        await BonusAdminService.bonusAccountControllerFreezeAccount({
          userId: actionRecord.userId,
        });
      });
    }
  }, [actionRecord, executeFreeze]);

  // --- 解冻操作 ---
  const { execute: executeUnfreeze, loading: unfreezeLoading } = useAsyncAction({
    successMessage: "解冻成功",
    onSuccess: () => {
      setUnfreezeConfirmOpen(false);
      fetchList();
    },
  });

  const handleUnfreezeExecute = useCallback(() => {
    if (actionRecord) {
      executeUnfreeze(async () => {
        await BonusAdminService.bonusAccountControllerUnfreezeAccount({
          userId: actionRecord.userId,
        });
      });
    }
  }, [actionRecord, executeUnfreeze]);

  // --- 导航 ---
  const handleViewLedger = useCallback(
    (userId: string) => {
      // 假设 Ledger 页面的路由
      navigate(`/bonus/ledger?userId=${userId}`);
    },
    [navigate],
  );

  const openAdjust = useCallback((record: UserBonusBalance) => {
    setCurrentRecord(record);
    setAdjustOpen(true);
  }, []);

  const openFreezeConfirm = useCallback((record: UserBonusBalance) => {
    setActionRecord(record);
    setFreezeConfirmOpen(true);
  }, []);

  const openUnfreezeConfirm = useCallback((record: UserBonusBalance) => {
    setActionRecord(record);
    setUnfreezeConfirmOpen(true);
  }, []);

  // --- 列定义 ---
  const columns = useMemo<Column<UserBonusBalance>[]>(
    () => [
      {
        key: "userId",
        title: "用户ID",
        dataIndex: "userId",
        width: 120,
      },
      {
        key: "username",
        title: "用户名",
        dataIndex: "username",
        width: 150,
        render: (val: string) => val || "-",
      },
      {
        key: "balance",
        title: "可用余额",
        dataIndex: "balance",
        align: "right",
        width: 120,
        render: (val: string) => (
          <span className="font-mono font-medium text-green-600">{val}</span>
        ),
      },
      {
        key: "lockedBalance",
        title: "预占余额",
        dataIndex: "lockedBalance",
        align: "right",
        width: 120,
        render: (val: string) => <span className="font-mono text-gray-500">{val}</span>,
      },
      {
        key: "isFrozen",
        title: "状态",
        dataIndex: "isFrozen",
        align: "center",
        width: 100,
        render: (val: number) => (
          <Tag color={val === 1 ? "red" : "green"}>{val === 1 ? "冻结" : "正常"}</Tag>
        ),
      },
      {
        key: "updatedAt",
        title: "更新时间",
        dataIndex: "updatedAt",
        width: 160,
        render: (val: string) => formatDate(val),
      },
      {
        key: "actions",
        title: "操作",
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Button variant="link" size="sm" onClick={() => handleViewLedger(record.userId)}>
              流水
            </Button>
            <Button variant="link" size="sm" onClick={() => openAdjust(record)}>
              调账
            </Button>
            {record.isFrozen === 1 ? (
              <Button
                variant="link"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => openUnfreezeConfirm(record)}
              >
                解冻
              </Button>
            ) : (
              <Button variant="link" size="sm" danger onClick={() => openFreezeConfirm(record)}>
                冻结
              </Button>
            )}
          </div>
        ),
      },
    ],
    [handleViewLedger, openAdjust, openFreezeConfirm, openUnfreezeConfirm],
  );

  // --- 初始化 ---
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    loading,
    data,
    total,
    query,
    updateQuery,
    setQuery,
    // 搜索
    searchText,
    setSearchText,
    handleSearch,
    resetQuery,
    columns,
    // 弹窗
    adjustOpen,
    setAdjustOpen,
    currentRecord,
    // 冻结确认
    freezeConfirmOpen,
    setFreezeConfirmOpen,
    freezeLoading,
    handleFreezeExecute,
    // 解冻确认
    unfreezeConfirmOpen,
    setUnfreezeConfirmOpen,
    unfreezeLoading,
    handleUnfreezeExecute,
    // 确认操作记录
    actionRecord,
    // 刷新
    fetchList,
  };
};
