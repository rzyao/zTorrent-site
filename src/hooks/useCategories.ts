import { useQuery } from '@tanstack/react-query';
import { CategoriesService } from '@/api/services/CategoriesService';
import { CategoryDto } from '@/api/models/CategoryDto';

export interface CategoryNavData {
  label: string;
  slug: string;
  key: string; // 原始 key，用于 API 请求
  sort: number;
}

export function useCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories', 'user'],
    queryFn: async () => {
      const response = await CategoriesService.categoriesControllerListUserCategories();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // 转换数据适配 CategoryNav
  const navItems: CategoryNavData[] = [
    { label: '全部', slug: 'home', key: '', sort: -1 }, // 默认项
    ...(data?.map((cat: CategoryDto) => ({
      label: cat.label || cat.key || '未命名',
      slug: cat.key || '', // 简单处理，直接用 key 作为 slug，如果 key 包含特殊字符可能需要处理，但假设 key 是英文标识符
      key: cat.key || '',
      sort: cat.sort || 0,
    })) || []),
  ].sort((a, b) => a.sort - b.sort);

  return {
    categories: navItems,
    isLoading,
    error,
  };
}
