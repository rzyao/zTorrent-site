import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MoviesService } from "@/api/services/MoviesService";
import { ListMoviesDto } from "@/api/models/ListMoviesDto";
import { usePreferenceCategoriesStore } from "@/stores/preferenceCategoriesStore";
import type { GenreOption, SortKey } from "../types";

/**
 * useMoviesPage
 * 负责封装电影页的数据获取、导航与筛选状态
 * 将业务逻辑与展示层解耦，便于测试与复用
 */
export function useMoviesPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 视图筛选状态
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("rating");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  // 从全局 store 获取电影分类数据（优先使用 movie，兼容旧版 film）
  const movieCategories = usePreferenceCategoriesStore((state) => state.movie || state.film || []);

  // 根据 store 中的分类数据生成筛选选项
  // label 直接取自数据库 categories 表（经 preferenceCategoriesStore 解析）
  const genres: GenreOption[] = useMemo(() => {
    const visibleCategories = movieCategories
      .filter((c) => c.show)
      .map((c) => ({
        key: c.key,
        label: c.label || c.key,
      }));
    return [{ key: "all", label: "全部" }, ...visibleCategories];
  }, [movieCategories]);

  // 电影列表查询
  const {
    data: moviesData,
    isLoading: loading,
    error: queryError,
    isFetching,
  } = useQuery({
    queryKey: ["movies", { selectedGenre, searchQuery, sortBy }],
    queryFn: async () => {
      const requestBody: ListMoviesDto = {
        page: 1,
        limit: 100,
        categories: selectedGenre === "all" ? undefined : [selectedGenre],
        keyword: searchQuery || undefined,
        sortBy: sortBy as ListMoviesDto.sortBy,
        order: ListMoviesDto.order.DESC,
      };
      const response = await MoviesService.movieBaseControllerList(requestBody);
      return {
        items: response.data?.items || [],
        total: response.data?.total || 0,
      };
    },
    placeholderData: (previousData) => previousData,
  });

  const movies = moviesData?.items || [];
  const error = queryError ? (queryError as Error).message || "获取电影列表失败" : null;

  // 点击电影卡片跳转详情
  function handleMovieClick(movie: { id: string }) {
    navigate(`/app/movie/${movie.id}`);
  }

  // 重试加载
  function retry() {
    queryClient.invalidateQueries({ queryKey: ["movies"] });
  }

  return {
    // 数据
    movies,
    genres,
    loading,
    error,
    isFetching,
    // 受控状态
    searchQuery,
    sortBy,
    selectedGenre,
    // 更新器
    setSearchQuery,
    setSortBy,
    setSelectedGenre,
    // 行为
    handleMovieClick,
    retry,
  };
}
