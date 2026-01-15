import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SeriesService } from "@/api/services/SeriesService";
import { Service } from "@/api/services/Service";
import { ListSeriesDto } from "@/api/models/ListSeriesDto";
import { FavoriteActionDto } from "@/api/models/FavoriteActionDto";
import { useDictionaryLabels } from "@/hooks/useDictionary";
import { usePreferenceCategoriesStore } from "@/stores/preferenceCategoriesStore";
import type { GenreOption, SortKey, SeriesStatus, STATUS_OPTIONS } from "../types";

/**
 * useSeriesPage
 * 负责封装剧集页的数据获取、导航与筛选状态
 * 将业务逻辑与展示层解耦，便于测试与复用
 */
export function useSeriesPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 视图筛选状态
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("rating");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<SeriesStatus | "all">("all");

  const { getCategoryLabel } = useDictionaryLabels();
  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async ({ id, isCollected }: { id: string; isCollected: boolean }) => {
      const action: FavoriteActionDto = {
        targetType: FavoriteActionDto.targetType.SERIES,
        targetId: id,
      };
      if (isCollected) {
        await Service.favoritesControllerRemove(action);
      } else {
        await Service.favoritesControllerAdd(action);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series"] });
    },
  });

  // 处理收藏切换
  const handleToggleCollect = (id: string) => {
    const item = series.find((s) => s.id === id);
    if (item) {
      toggleFavorite({ id, isCollected: !!(item as any).isCollected });
    }
  };

  // 从全局 store 获取剧集分类数据
  const seriesCategories = usePreferenceCategoriesStore((state) => state.series || []);

  // 根据 store 中的分类数据生成筛选选项
  const genres: GenreOption[] = useMemo(() => {
    const visibleCategories = seriesCategories
      .filter((c) => c.show)
      .map((c) => ({ key: c.key, label: c.label || getCategoryLabel(c.key) || c.key }));
    return [{ key: "all", label: "全部" }, ...visibleCategories];
  }, [seriesCategories, getCategoryLabel]);

  // 剧集列表查询
  const {
    data: seriesData,
    isLoading: loading,
    error: queryError,
    isFetching,
  } = useQuery({
    queryKey: ["series", { selectedGenre, searchQuery, sortBy, selectedStatus }],
    queryFn: async () => {
      const requestBody: ListSeriesDto = {
        page: 1,
        limit: 100,
        categories: selectedGenre === "all" ? undefined : [selectedGenre],
        keyword: searchQuery || undefined,
        sortBy: sortBy as ListSeriesDto.sortBy,
        order: ListSeriesDto.order.DESC,
        status: selectedStatus === "all" ? undefined : (selectedStatus as ListSeriesDto.status),
      };
      const response = await SeriesService.seriesBaseControllerList(requestBody);
      return {
        items: response.data?.items || [],
        total: response.data?.total || 0,
      };
    },
    placeholderData: (previousData) => previousData,
  });

  const series = seriesData?.items || [];
  const error = queryError ? (queryError as Error).message || "获取剧集列表失败" : null;

  // 点击剧集卡片跳转详情
  function handleSeriesClick(item: { id: string }) {
    navigate(`/app/series/${item.id}`);
  }

  // 重试加载
  function retry() {
    queryClient.invalidateQueries({ queryKey: ["series"] });
  }

  return {
    // 数据
    series,
    genres,
    loading,
    error,
    isFetching,
    // 受控状态
    searchQuery,
    sortBy,
    selectedGenre,
    selectedStatus,
    // 更新器
    setSearchQuery,
    setSortBy,
    setSelectedGenre,
    setSelectedStatus,
    // 行为
    handleSeriesClick,
    handleToggleCollect,
    retry,
  };
}
