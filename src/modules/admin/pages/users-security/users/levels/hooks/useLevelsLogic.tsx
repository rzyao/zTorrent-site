import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LevelsService } from "@/api/services/LevelsService";
import { CreateLevelDto } from "@/api/models/CreateLevelDto";
import { UpdateLevelDto } from "@/api/models/UpdateLevelDto";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
import { LevelItem, LevelsQuery, DEFAULT_QUERY } from "../types";
import { Column } from "@/modules/admin/components/ui/data-table";
import { Tag } from "@/modules/admin/components/ui/tag";
import { Button } from "@/modules/admin/components/ui/button";
import { Switch } from "@/modules/admin/components/ui/switch";

/**
 * 等级管理模块核心逻辑库
 */
export const useLevelsLogic = () => {
  const queryClient = useQueryClient();

  // --- 基础状态 ---
  const [query, setQuery] = useState<LevelsQuery>(DEFAULT_QUERY);

  // 弹窗显隐控制
  const [editOpen, setEditOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [permOpen, setPermOpen] = useState(false);
  const [permTarget, setPermTarget] = useState<LevelItem | null>(null);

  // --- 列表查询 ---
  const { data: listData, isLoading: loading } = useQuery({
    queryKey: ["levels-list", query],
    queryFn: async () => {
      const res = await LevelsService.levelsCoreControllerList({
        page: query.page,
        limit: query.limit,
        label: query.label,
        key: query.key,
      });
      // 这里的结构转换是由于后端 DTO 在生成的 SDK 中可能嵌套在 data 下
      const items = res?.data?.items || (res as any)?.items || [];
      const totalCount = res?.data?.total || (res as any)?.total || 0;
      return { items, totalCount };
    },
  });

  const levels = listData?.items || [];
  const total = listData?.totalCount || 0;

  // --- 操作封装 ---
  const { execute: executeToggle } = useAsyncAction({
    successMessage: "更新状态成功",
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["levels-list"] }),
  });

  const { execute: executeDelete } = useAsyncAction({
    successMessage: "删除等级成功",
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["levels-list"] }),
  });

  const { execute: executeSave, loading: saveLoading } = useAsyncAction({
    successMessage: "保存成功",
    onSuccess: () => {
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["levels-list"] });
    },
  });

  // --- 事件处理 ---
  const handleSearch = useCallback((text: string) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      label: text || undefined,
    }));
  }, []);

  const handleFilterChange = useCallback((key: keyof LevelsQuery, value: any) => {
    setQuery((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  }, []);

  const handleToggle = (record: LevelItem) => {
    executeToggle(async () => {
      await LevelsService.levelsCoreControllerUpdate({
        id: record.id,
        data: {
          isActive: !record.isActive,
        } as UpdateLevelDto,
      });
    });
  };

  const handleEdit = (record: LevelItem) => {
    setEditingLevel(record);
    setEditOpen(true);
  };

  const handleSave = async (formData: any) => {
    await executeSave(async () => {
      if (editingLevel) {
        await LevelsService.levelsCoreControllerUpdate({
          id: editingLevel.id,
          data: formData as UpdateLevelDto,
        });
      } else {
        await LevelsService.levelsCoreControllerCreate(formData as CreateLevelDto);
      }
    });
  };

  const handleDelete = (id: string) => {
    executeDelete(async () => {
      await LevelsService.levelsCoreControllerRemove({ id });
    });
  };

  // --- 表格定义 ---
  const columns: Column<LevelItem>[] = useMemo(
    () => [
      {
        title: "权重标识",
        dataIndex: "key",
        key: "key",
        width: 150,
        render: (val: string) => <Tag color="blue">{val}</Tag>,
      },
      {
        title: "等级名称",
        dataIndex: "label",
        key: "label",
        width: 150,
      },
      {
        title: "级别",
        dataIndex: "rank",
        key: "rank",
        width: 100,
        render: (val: number) => <span className="font-mono font-medium">{val}</span>,
      },
      {
        title: "状态",
        dataIndex: "isActive",
        key: "isActive",
        width: 100,
        render: (_: any, record: LevelItem) => (
          <Switch checked={record.isActive} onCheckedChange={() => handleToggle(record)} />
        ),
      },
      {
        title: "操作",
        key: "actions",
        width: 250,
        render: (_: any, record: LevelItem) => (
          <div className="flex gap-2">
            <Button variant="link" size="small" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button
              variant="link"
              size="small"
              onClick={() => {
                setDetailData(record);
                setDetailOpen(true);
              }}
            >
              详情
            </Button>
            <Button
              variant="link"
              size="small"
              onClick={() => {
                setPermTarget(record);
                setPermOpen(true);
              }}
            >
              权限
            </Button>
            <Button variant="link" size="small" danger onClick={() => handleDelete(record.id)}>
              删除
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    levels,
    loading,
    total,
    query,
    columns,
    handleSearch,
    handleFilterChange,
    editOpen,
    setEditOpen,
    editingLevel,
    setEditingLevel,
    handleSave,
    saveLoading,
    detailOpen,
    setDetailOpen,
    detailData,
    permOpen,
    setPermOpen,
    permTarget,
  };
};
