import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RecommendationsService } from "@/api/services/RecommendationsService";
import type { RecommendationTabDto } from "@/api/models/RecommendationTabDto";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { formatDate } from "@/modules/admin/utils/formatDate";
import { Switch } from "@/modules/admin/components/ui/switch";
import { Tag } from "@/modules/admin/components/ui/tag";
import { Button } from "@/modules/admin/components/ui/button";
import { STRATEGY_TYPE_ENUM, DEFAULT_FORM_VALUES } from "./constants";
import type { RecommendationsQuery, RecommendationItem, RecommendationFormData } from "./types";
import type { Column } from "@/modules/admin/components/ui/data-table";

/**
 * 推荐配置页面逻辑 Hook
 * 使用 TanStack Query 管理服务端状态
 */
export function useRecommendationsLogic() {
  const queryClient = useQueryClient();

  // 查询参数
  const [query, setQuery] = useState<RecommendationsQuery>({
    page: 1,
    limit: 20,
    title: "",
  });

  // 弹窗相关
  const [modalVisible, setModalVisible] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<RecommendationItem | undefined>(undefined);
  const [formData, setFormData] = useState<RecommendationFormData>(DEFAULT_FORM_VALUES);
  const isEdit = !!currentConfig;

  // 删除确认弹窗
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string | null;
    title: string | null;
  }>({ open: false, id: null, title: null });

  // --- 异步操作 ---
  const { execute: executeDelete } = useAsyncAction({
    successMessage: "删除成功",
    onSuccess: () => {
      setDeleteConfirm({ open: false, id: null, title: null });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });

  const { execute: executeToggle } = useAsyncAction({
    successMessage: "状态更新成功",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });

  const { execute: executeSubmit, loading: submitLoading } = useAsyncAction({
    successMessage: isEdit ? "更新成功" : "创建成功",
    onSuccess: () => {
      setModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
  });

  // --- 使用 TanStack Query 获取配置列表 ---
  const { data: listData, isLoading: loading } = useQuery({
    queryKey: ["recommendations", query.title, query.type],
    queryFn: async () => {
      const response = await RecommendationsService.recommendationsControllerListConfigs();
      return response?.data ?? [];
    },
    select: (items) => {
      // 前端模拟过滤
      let filtered = items;
      if (query.title) {
        filtered = filtered.filter((item) =>
          item.title.toLowerCase().includes(query.title!.toLowerCase()),
        );
      }
      if (query.type) {
        filtered = filtered.filter((item) => item.type === query.type);
      }
      return filtered;
    },
  });

  const filteredFullData = listData ?? [];
  const total = filteredFullData.length;

  // 前端分页切片
  const startIndex = (query.page - 1) * query.limit;
  const endIndex = startIndex + query.limit;
  const data = filteredFullData.slice(startIndex, endIndex);

  // --- 获取 Tab 选项 ---
  const { data: tabOptions = [] } = useQuery({
    queryKey: ["recommendation-tabs"],
    queryFn: async () => {
      const response = await RecommendationsService.recommendationsControllerListTabs();
      const tabs = response?.data ?? [];
      return tabs.map((t: RecommendationTabDto) => ({
        label: `${t.label}${t.categoryKey ? ` (${String(t.categoryKey)})` : " (全站)"}`,
        value: t.id,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 分钟内不重新获取
  });

  // --- 搜索处理 ---
  const [searchText, setSearchText] = useState("");
  const handleSearch = useCallback(() => {
    setQuery((prev) => ({ ...prev, page: 1, title: searchText }));
  }, [searchText]);

  const handleReset = useCallback(() => {
    setSearchText("");
    setQuery({ page: 1, limit: 20, title: "", type: undefined });
  }, []);

  // --- 操作处理 ---
  const handleCreate = useCallback(() => {
    setCurrentConfig(undefined);
    setFormData(DEFAULT_FORM_VALUES);
    setModalVisible(true);
  }, []);

  const handleEdit = useCallback((record: RecommendationItem) => {
    setCurrentConfig(record);
    const tabIds = ((record as any).tabs ?? []).map((t: any) => t.id);
    setFormData({
      title: record.title,
      tabIds,
      type: record.type,
      timeRange: record.timeRange,
      limit: record.limit,
      sort: record.sort,
      enabled: record.enabled,
      style: record.style,
    });
    setModalVisible(true);
  }, []);

  const openDeleteConfirm = useCallback((record: RecommendationItem) => {
    setDeleteConfirm({ open: true, id: record.id, title: record.title });
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteConfirm.id) return;
    await executeDelete(async () => {
      await RecommendationsService.recommendationsControllerDeleteConfig({ id: deleteConfirm.id! });
    });
  }, [deleteConfirm.id, executeDelete]);

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirm({ open: false, id: null, title: null });
  }, []);

  const handleToggleEnabled = useCallback(
    async (id: string, enabled: boolean) => {
      await executeToggle(async () => {
        await RecommendationsService.recommendationsControllerUpdateConfig({
          id,
          data: { enabled },
        });
      });
    },
    [executeToggle],
  );

  const handleSubmit = useCallback(async () => {
    // 简单校验
    if (!formData.title?.trim()) return;
    if (!formData.tabIds?.length) return;
    if (!formData.type) return;

    await executeSubmit(async () => {
      if (isEdit && currentConfig) {
        await RecommendationsService.recommendationsControllerUpdateConfig({
          id: currentConfig.id,
          data: formData as any,
        });
      } else {
        await RecommendationsService.recommendationsControllerCreateConfig(formData as any);
      }
    });
  }, [formData, executeSubmit, isEdit, currentConfig]);

  // 更新表单字段
  const updateFormField = useCallback(
    <K extends keyof RecommendationFormData>(field: K, value: RecommendationFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  // --- 列定义 ---
  const columns = useMemo<Column<RecommendationItem>[]>(
    () => [
      {
        key: "title",
        title: "标题",
        dataIndex: "title",
        width: 150,
        ellipsis: true,
      },
      {
        key: "tabs",
        title: "关联 Tab",
        width: 200,
        render: (_, record) => {
          const tabs = (record as any).tabs ?? [];
          if (tabs.length === 0) return <Tag icon={null}>未关联</Tag>;
          return (
            <div className="flex flex-wrap gap-1">
              {tabs.map((t: RecommendationTabDto) => (
                <Tag key={t.id} color="blue" icon={null}>
                  {t.label}
                </Tag>
              ))}
            </div>
          );
        },
      },
      {
        key: "type",
        title: "策略",
        dataIndex: "type",
        width: 120,
        render: (v) => {
          const config = (STRATEGY_TYPE_ENUM as any)[v];
          return config ? config.text : v;
        },
      },
      {
        key: "timeRange",
        title: "时间范围",
        dataIndex: "timeRange",
        width: 100,
        render: (v) => (v === 0 ? "不限" : `${v}天`),
      },
      {
        key: "limit",
        title: "数量",
        dataIndex: "limit",
        width: 80,
      },
      {
        key: "sort",
        title: "排序",
        dataIndex: "sort",
        width: 80,
        sorter: true,
      },
      {
        key: "enabled",
        title: "状态",
        dataIndex: "enabled",
        width: 100,
        render: (enabled, record) => (
          <Switch
            checked={enabled}
            onCheckedChange={(checked) => handleToggleEnabled(record.id, checked)}
          />
        ),
      },
      {
        key: "createdAt",
        title: "创建时间",
        dataIndex: "createdAt",
        width: 160,
        render: (v) => formatDate(v),
      },
      {
        key: "action",
        title: "操作",
        width: 120,
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Button variant="link" size="sm" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button variant="link" size="sm" danger onClick={() => openDeleteConfirm(record)}>
              删除
            </Button>
          </div>
        ),
      },
    ],
    [handleEdit, openDeleteConfirm, handleToggleEnabled],
  );

  return {
    data,
    loading,
    total,
    query,
    setQuery,
    columns,
    // 搜索
    searchText,
    setSearchText,
    handleSearch,
    handleReset,
    // 弹窗
    modalVisible,
    setModalVisible,
    isEdit,
    formData,
    updateFormField,
    tabOptions,
    submitLoading,
    // 删除确认
    deleteConfirm,
    handleDelete,
    handleCancelDelete,
    // 操作
    handleCreate,
    handleSubmit,
  };
}
