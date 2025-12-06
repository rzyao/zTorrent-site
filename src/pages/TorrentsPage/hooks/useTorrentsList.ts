import { useEffect, useMemo, useState } from 'react';
import { TorrentsService, UsersService } from '@/api';
import { getProfile } from '@/api/custom/auth';
import { useDictionaryLabels } from '@/hooks/useDictionary';
import type { CategoryItem, SortOption } from '../types';

/**
 * useTorrentsList
 * 封装：数据加载、分类获取、筛选/排序/分页状态与派生数据。
 * - 职责：仅处理业务状态与副作用，不包含任何视图渲染逻辑。
 * - 不做旧代码兼容：假定接口返回 `{ data: { items: Torrent[], total: number } }`。
 */
export function useTorrentsList() {
  // 词典：分类标签映射（仅在此处处理数据层逻辑）
  const { getCategoryLabel, refreshDictionaries } = useDictionaryLabels();

  // 基本列表状态
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [sortBy, setSortBy] = useState<SortOption['value']>('latest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 50; // 保持与旧页面一致

  // 加载态与原始数据
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiItems, setApiItems] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);

  // 分类项
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  /**
   * 将展示标签映射为用于请求的分类键
   * - 设计原因：UI展示中文标签，而接口需要实际的分类键
   */
  const mapCategoryToKey = (label?: string) => {
    if (!label || label === '全部') return undefined;
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
  const mapOrderBy = (v: SortOption['value']) => {
    if (v === 'seeders') return 'seeders';
    if (v === 'size') return 'size';
    if (v === 'completed') return 'completedCount';
    return 'uploadedAt';
  };

  /**
   * 排序方向统一为 DESC（与旧页面一致）
   */
  const mapOrder = (_v: SortOption['value']) => 'DESC' as const;

  /**
   * 加载列表数据
   * - 保持旧页面的分页、排序、分类请求参数一致
   * - 不做旧响应结构兼容处理
   */
  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        const resp = await TorrentsService.torrentsControllerListTorrentsForUser({
          page: currentPage,
          limit: itemsPerPage,
          category: mapCategoryToKey(selectedCategory),
          orderBy: mapOrderBy(sortBy) as any,
          order: mapOrder(sortBy) as any,
        });
        // 假定新接口返回 `{ data: { items, total } }`
        const data = resp?.data;
        if (!isCancelled) {
          setApiItems(Array.isArray(data?.items) ? (data.items as any[]) : []);
          setTotal(Number(data?.total ?? 0));
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    load();
    return () => { isCancelled = true; };
  }, [currentPage, selectedCategory, sortBy, itemsPerPage]);

  /**
   * 加载用户默认分类列表
   * - 设计：根据用户ID请求默认分类键，再通过词典映射为展示标签
   */
  useEffect(() => {
    let isCancelled = false;
    const loadCategories = async () => {
      try {
        const prof = await getProfile();
        const id = String(prof?.user?.id ?? prof?.user?._id ?? prof?.sub ?? '');
        if (!id) return;
        const resp = await UsersService.usersPreferencesControllerGetDefaultTorrentCategoryKeys({ id });
        const keys = Array.isArray(resp?.data) ? resp.data : [];
        // 先尝试映射；如词典未准备好则刷新后重试一次
        let mapped: CategoryItem[] = keys.map((key: string) => ({ key, label: getCategoryLabel(key) || key }));
        if (mapped.some((m) => !m.label || m.label === m.key)) {
          await refreshDictionaries();
          mapped = keys.map((key: string) => ({ key, label: getCategoryLabel(key) || key }));
        }
        if (!isCancelled) {
          setCategories([{ label: '全部' }, ...mapped]);
        }
      } catch {
        // 忽略错误：分类非关键阻塞，保持空列表即可
      }
    };
    loadCategories();
    return () => { isCancelled = true; };
  }, []);

  /**
   * 前端筛选与排序派生
   * - 搜索：标题包含（不区分大小写）
   * - 排序：当选择 rating 时按评分降序，其余排序交由接口处理，前端不再次排序
   */
  const filteredTorrents: any[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return apiItems.filter((t) => {
      if (q && !String(t.title ?? '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [apiItems, searchQuery]);

  const displayTorrents: any[] = useMemo(() => {
    if (sortBy === 'rating') {
      return [...filteredTorrents].sort((a, b) => Number(b?.rating ?? 0) - Number(a?.rating ?? 0));
    }
    return filteredTorrents;
  }, [filteredTorrents, sortBy]);

  const totalPages = useMemo(() => {
    return Math.ceil((total || filteredTorrents.length) / itemsPerPage);
  }, [total, filteredTorrents.length, itemsPerPage]);

  return {
    // 数据与派生
    apiItems,
    displayTorrents,
    isLoading,
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
    currentPage,
    setCurrentPage,
    itemsPerPage,
  } as const;
}
