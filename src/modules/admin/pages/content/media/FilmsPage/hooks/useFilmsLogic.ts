import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MoviesService } from "@/api/services/MoviesService";
import { ListMoviesDto } from "@/api/models/ListMoviesDto";
import { MovieItem } from "../types";
import { useNavigate } from "react-router-dom";
import { FILM_CATEGORY_OPTIONS } from "../constants";
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";

/** 查询参数类型 */
interface FilmsQuery {
  page: number;
  limit: number;
  keyword?: string;
  category?: string;
  year?: string;
  genreIdsText: string;
  sortBy?: ListMoviesDto.sortBy;
  sortOrder?: ListMoviesDto.order;
}

/** 默认查询参数 */
const DEFAULT_QUERY: FilmsQuery = {
  page: 1,
  limit: 10,
  keyword: undefined,
  category: undefined,
  year: undefined,
  genreIdsText: "",
  sortBy: undefined,
  sortOrder: undefined,
};

/**
 * useFilmsLogic
 * 负责电影列表页面的业务逻辑 - 使用 TanStack Query
 */
export const useFilmsLogic = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- 查询参数状态 ---
  const [query, setQuery] = useState<FilmsQuery>(DEFAULT_QUERY);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // --- 删除弹窗状态 ---
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categoryOptions = FILM_CATEGORY_OPTIONS;

  // 解析 genreIds 文本为数组
  const parseGenreIds = (text: string): string[] | undefined => {
    const arr = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return arr.length ? arr : undefined;
  };

  // 构建 API 请求参数
  const apiParams = useMemo<ListMoviesDto>(
    () => ({
      page: query.page,
      limit: query.limit,
      keyword: query.keyword || undefined,
      categories: query.category ? [query.category] : undefined,
      year: query.year || undefined,
      genres: parseGenreIds(query.genreIdsText),
      sortBy: query.sortBy,
      order: query.sortOrder,
    }),
    [query],
  );

  // --- 使用 TanStack Query 获取列表数据 ---
  const { data: listData, isLoading: loading } = useQuery({
    queryKey: ["films-list", apiParams],
    queryFn: async () => {
      const resp = await MoviesService.movieBaseControllerList(apiParams);
      const items = (resp.data?.items as MovieItem[]) || [];
      const total = Number(resp.data?.total || 0);
      return { items, total };
    },
  });

  const items = listData?.items || [];
  const total = listData?.total || 0;

  // --- 删除操作 ---
  const { execute: executeDelete } = useAsyncAction({
    successMessage: "删除成功",
    onSuccess: () => {
      setDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["films-list"] });
    },
  });

  // --- 事件处理 (使用 useCallback 稳定引用) ---
  const handleSearch = useCallback(() => {
    setQuery((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleFilterChange = useCallback(
    <K extends keyof FilmsQuery>(key: K, value: FilmsQuery[K]) => {
      setQuery((prev) => ({
        ...prev,
        [key]: value,
        page: key !== "page" ? 1 : (value as number), // 非分页变更时重置页码
      }));
    },
    [],
  );

  const openRemove = useCallback((id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  }, []);

  const remove = useCallback(async () => {
    if (!deleteId) return;
    await executeDelete(async () => {
      await MoviesService.movieBaseControllerDelete({ id: deleteId } as any);
    });
  }, [deleteId, executeDelete]);

  const openDetail = useCallback(
    (id: string) => {
      navigate(`/app/movie/${id}`);
    },
    [navigate],
  );

  return {
    // 列表数据
    loading,
    items,
    total,
    // 查询状态
    query,
    setQuery,
    // 便捷访问器 (兼容旧接口)
    page: query.page,
    setPage: (v: number) => handleFilterChange("page", v),
    limit: query.limit,
    setLimit: (v: number) => handleFilterChange("limit", v),
    keyword: query.keyword || "",
    setKeyword: (v: string) => handleFilterChange("keyword", v || undefined),
    category: query.category,
    setCategory: (v: string | undefined) => handleFilterChange("category", v),
    year: query.year,
    setYear: (v: string | undefined) => handleFilterChange("year", v),
    genreIdsText: query.genreIdsText,
    setGenreIdsText: (v: string) => handleFilterChange("genreIdsText", v),
    sortBy: query.sortBy,
    setSortBy: (v: ListMoviesDto.sortBy | undefined) => handleFilterChange("sortBy", v),
    sortOrder: query.sortOrder,
    setSortOrder: (v: ListMoviesDto.order | undefined) => handleFilterChange("sortOrder", v),
    // 选中状态
    selectedRowKeys,
    setSelectedRowKeys,
    // 弹窗状态
    deleteOpen,
    setDeleteOpen,
    // 常量
    categoryOptions,
    // 操作方法
    handleSearch,
    openRemove,
    remove,
    openDetail,
  };
};
