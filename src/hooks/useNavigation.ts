import { useQuery } from "@tanstack/react-query";
import { NavigationService } from "@/api/services/NavigationService";
import { NavigationResponse } from "@/types/navigation";

export function useNavigation() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["navigation"],
    queryFn: async (): Promise<NavigationResponse> => {
      const response = await NavigationService.navigationControllerGetUserNavigation();

      // 处理空响应
      if (!response) {
        throw new Error("导航 API 返回空响应");
      }

      // 提取数据（兼容不同响应结构）
      const navData = (response as any).data || response;
      if (!navData || (!navData.desktop && !navData.mobile)) {
        throw new Error("导航数据结构无效");
      }

      return navData as NavigationResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 分钟缓存
    retry: 2,
  });

  return {
    desktop: data?.desktop || [],
    mobile: data?.mobile || [],
    isLoading,
    error,
  };
}
