import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { TorrentsSearchService } from "@/api/services/TorrentsSearchService";
import { useDictionaryLabels } from "@/hooks/useDictionary";
import { usePreferenceCategoriesStore } from "@/stores/preferenceCategoriesStore";
import { useLanguage } from "@/hooks/useLanguage";
import type { CategoryItem, SortOption } from "../types";

/**
 * useTorrentsList
 * 封装：数据加载、分类获取、筛选/排序/分页状态与派生数据。
 * - 职责：仅处理业务状态与副作用，不包含任何视图渲染逻辑。
 * - 不做旧代码兼容：假定接口返回 `{ data: { items: Torrent[], total: number } }`。
 */
export function useTorrentsList() {
  const { t } = useLanguage();
  // 词典：分类标签映射（仅在此处处理数据层逻辑）
  const { getCategoryLabel: rawGetCategoryLabel } = useDictionaryLabels();

  /**
   * 获取翻译后的分类标签
   * 优先使用 category.{key} 翻译，失败则回退到字典数据
   */
  const getCategoryLabel = useCallback(
    (key?: string) => {
      if (!key) return undefined;
      const label = rawGetCategoryLabel(key);
      // 如果 key 与翻译结果相同（即没有翻译），且 label 存在，则使用 label
      // 否则优先尝试翻译
      const translation = t(`category.${key}`);
      if (translation !== `category.${key}`) {
        return translation;
      }
      return label || key;
    },
    [t, rawGetCategoryLabel],
  );

  // 基本列表状态
  const [selectedCategory, setSelectedCategory] = useState<string>(t("app.all"));
  const [sortBy, setSortBy] = useState<SortOption["value"]>("latest");
  const [searchQuery, setSearchQuery] = useState<string>(""); // 输入框受控值
  const [committedSearch, setCommittedSearch] = useState<string>(""); // 实际触发请求的搜索词
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 50; // 保持与旧页面一致

  // 提交搜索（点击图标或按 Enter）
  const handleSearch = (value?: string) => {
    setCommittedSearch((value ?? searchQuery).trim());
    setCurrentPage(1); // 搜索时重置页码
  };

  // 直接从全局 store 获取种子分类数据（App 启动时已加载）
  const torrentCategories = usePreferenceCategoriesStore((state) => state.torrent);

  // 根据 store 中的分类数据生成分类选项（仅展示 show=true 的分类）
  const categories: CategoryItem[] = useMemo(() => {
    const visibleCategories = torrentCategories
      .filter((c) => c.show)
      .map((c) => ({
        key: c.key,
        // 优先使用翻译，如果翻译不存在则使用原有逻辑
        label: t(`category.${c.key}`, {
          defaultValue: c.label || getCategoryLabel(c.key) || c.key,
        }),
      }));
    return [{ label: t("app.all") }, ...visibleCategories];
  }, [torrentCategories, getCategoryLabel, t]);

  /**
   * 将展示标签映射为用于请求的分类键
   * - 设计原因：UI展示中文标签，而接口需要实际的分类键
   */
  const mapCategoryToKey = (label?: string) => {
    if (!label || label === t("app.all")) return undefined;
    return categories.find((c) => c.label === label)?.key || undefined;
  };

  /**
   * 排序字段映射：UI选项 → 接口 `orderBy`
   * - 业务约定：
   *   latest → uploadedAt
   *   seeders → seeders
   *   completed → completedCount
   *   rating → rating（仅前端本地排序，不参与接口）
   *   size → size
   */
  const mapOrderBy = (v: SortOption["value"]) => {
    if (v === "seeders") return "seeders";
    if (v === "size") return "size";
    if (v === "completed") return "completedCount";
    return "uploadedAt";
  };

  /**
   * 排序方向统一为 DESC（与旧页面一致）
   */
  const mapOrder = (_v: SortOption["value"]) => "DESC" as const;

  /**
   * React Query 缓存列表数据
   */
  const {
    data: torrentsData,
    isLoading,
    isFetching,
  } = useQuery<{ items: any[]; total: number }, Error>({
    queryKey: [
      "torrents",
      {
        page: currentPage,
        limit: itemsPerPage,
        // 使用原始 selectedCategory 确保切换"全部"时也能触发刷新
        selectedCategory,
        // 使用已提交的搜索词（而非实时输入值）
        search: committedSearch || undefined,
        orderBy: mapOrderBy(sortBy),
        order: mapOrder(sortBy),
      },
    ],
    queryFn: async (): Promise<{ items: any[]; total: number }> => {
      const resp: any = await TorrentsSearchService.torrentSearchControllerList({
        page: currentPage,
        limit: itemsPerPage,
        category: mapCategoryToKey(selectedCategory),
        // 将已提交的搜索关键字传给后端
        keyword: committedSearch || undefined,
        orderBy: mapOrderBy(sortBy) as any,
        order: mapOrder(sortBy) as any,
      });
      const data = resp?.data;
      return {
        items: Array.isArray(data?.items) ? (data.items as any[]) : [],
        total: Number(data?.total ?? 0),
      };
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const apiItems = torrentsData?.items ?? [];
  const total = torrentsData?.total ?? 0;

  // useEffect(() => {
  //   const items = torrentsData?.items ?? [];
  //   const t = torrentsData?.total ?? 0;
  //   setApiItems(items);
  //   setTotal(t);
  // }, [torrentsData]);

  /**
   * 排序派生
   * - 当选择 rating 时按评分降序，其余排序交由接口处理
   */
  const displayTorrents: any[] = useMemo(() => {
    if (sortBy === "rating") {
      return [...apiItems].sort((a, b) => Number(b?.rating ?? 0) - Number(a?.rating ?? 0));
    }
    return apiItems;
  }, [apiItems, sortBy]);

  const totalPages = useMemo(() => {
    return Math.ceil(total / itemsPerPage);
  }, [total, itemsPerPage]);

  return {
    // 数据与派生
    apiItems,
    displayTorrents,
    isLoading,
    isFetching,
    total,
    totalPages,
    categories,
    // 词典查询（供子组件使用）
    getCategoryLabel,
    // 控制状态
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    handleSearch, // 提交搜索
    currentPage,
    setCurrentPage,
    itemsPerPage,
  } as const;
}
