import { useRef, useState, useCallback, useEffect } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { Form, message } from "antd";
import { RecommendationsService } from "@/api/services/RecommendationsService";
import type { CreateRecommendationConfigDto } from "@/api/models/CreateRecommendationConfigDto";
import type { RecommendationConfigDto } from "@/api/models/RecommendationConfigDto";
import type { RecommendationTabDto } from "@/api/models/RecommendationTabDto";
import { DEFAULT_FORM_VALUES } from "../constants";

/**
 * 推荐配置页面逻辑 Hook
 * 封装表格数据请求、弹窗状态、CRUD 操作
 */
export function useRecommendationConfig() {
  // === 表格相关 ===
  const actionRef = useRef<ActionType>(undefined);

  // === 弹窗相关 ===
  const [modalVisible, setModalVisible] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<RecommendationConfigDto | undefined>(
    undefined,
  );
  const [form] = Form.useForm<CreateRecommendationConfigDto>();
  const isEdit = !!currentConfig;

  // === Tab 选项（供表单下拉使用）===
  const [tabOptions, setTabOptions] = useState<{ label: string; value: string }[]>([]);

  // 加载 Tab 列表
  const loadTabs = useCallback(async () => {
    try {
      const response = await RecommendationsService.recommendationsControllerListTabs();
      const tabs = response?.data ?? [];
      setTabOptions(
        tabs.map((t: RecommendationTabDto) => ({
          label: `${t.label}${t.categoryKey ? ` (${String(t.categoryKey)})` : " (全站)"}`,
          value: t.id,
        })),
      );
    } catch (e) {
      console.error("加载 Tab 列表失败", e);
    }
  }, []);

  // 弹窗打开时初始化表单
  useEffect(() => {
    if (modalVisible) {
      loadTabs();
      if (currentConfig) {
        // 编辑模式：回填表单
        const tabIds = ((currentConfig as any).tabs ?? []).map((t: RecommendationTabDto) => t.id);
        form.setFieldsValue({
          title: currentConfig.title,
          tabIds,
          type: currentConfig.type,
          timeRange: currentConfig.timeRange,
          limit: currentConfig.limit,
          sort: currentConfig.sort,
          enabled: currentConfig.enabled,
          style: currentConfig.style,
        } as any);
      } else {
        // 新建模式：重置并设置默认值
        form.resetFields();
        form.setFieldsValue(DEFAULT_FORM_VALUES as any);
      }
    }
  }, [modalVisible, currentConfig, form, loadTabs]);

  // === 表格数据请求 ===
  const fetchConfigs = useCallback(async () => {
    try {
      const response = await RecommendationsService.recommendationsControllerListConfigs();
      const items = response?.data ?? [];
      return {
        data: items,
        success: true,
        total: items.length,
      };
    } catch (error) {
      return { success: false, data: [] };
    }
  }, []);

  // === CRUD 操作 ===
  const handleCreate = useCallback(() => {
    setCurrentConfig(undefined);
    setModalVisible(true);
  }, []);

  const handleEdit = useCallback((record: RecommendationConfigDto) => {
    setCurrentConfig(record);
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await RecommendationsService.recommendationsControllerDeleteConfig({
        id,
      });
      message.success("删除成功");
      actionRef.current?.reload();
    } catch (e: any) {
      message.error(e.message || "删除失败");
    }
  }, []);

  const handleToggleEnabled = useCallback(async (id: string, enabled: boolean) => {
    try {
      await RecommendationsService.recommendationsControllerUpdateConfig({
        id,
        data: { enabled },
      });
      message.success("状态更新成功");
      actionRef.current?.reload();
    } catch (e: any) {
      message.error(e.message || "更新失败");
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: CreateRecommendationConfigDto) => {
      try {
        if (isEdit && currentConfig) {
          await RecommendationsService.recommendationsControllerUpdateConfig({
            id: currentConfig.id,
            data: values as any,
          });
          message.success("更新成功");
        } else {
          await RecommendationsService.recommendationsControllerCreateConfig(values);
          message.success("创建成功");
        }
        setModalVisible(false);
        actionRef.current?.reload();
        return true;
      } catch (error: any) {
        message.error(error.message || (isEdit ? "更新失败" : "创建失败"));
        return false;
      }
    },
    [isEdit, currentConfig],
  );

  return {
    // 表格
    actionRef,
    fetchConfigs,
    // 弹窗
    form,
    modalVisible,
    setModalVisible,
    isEdit,
    tabOptions,
    // 操作
    handleCreate,
    handleEdit,
    handleDelete,
    handleToggleEnabled,
    handleSubmit,
  };
}
