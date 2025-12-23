import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Service, FavoriteActionDto } from "@/api";
import { toast } from "sonner";

interface UseFavoriteProps {
  targetType: FavoriteActionDto.targetType;
  targetId: string;
  /**
   * 初始收藏状态（来自详情接口）
   * 如果提供了此值，将跳过 check 接口请求
   */
  initialValue?: boolean;
  enabled?: boolean;
}

export function useFavorite({
  targetType,
  targetId,
  initialValue,
  enabled = true,
}: UseFavoriteProps) {
  const queryClient = useQueryClient();
  const queryKey = ["favorites", "check", targetType, targetId];

  // 如果提供了初始值，预设缓存
  // 这样 useQuery 会直接使用缓存值而不发起请求
  const hasInitialValue = initialValue !== undefined;

  // Check status
  const { data: isFavorite, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const resp = await Service.favoritesControllerCheck({ targetType, targetId });
      // 后端返回 { data: { favorited: boolean } }
      const data = resp.data as { favorited?: boolean; isFavorite?: boolean };
      return !!(data?.favorited ?? data?.isFavorite);
    },
    // 如果有初始值，禁用自动请求
    enabled: enabled && !!targetId && !hasInitialValue,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // 使用初始值作为占位数据
    initialData: hasInitialValue ? initialValue : undefined,
  });

  // Toggle mutation
  const { mutate: toggle, isPending: isToggling } = useMutation({
    mutationFn: async () => {
      const action = { targetType, targetId };
      if (isFavorite) {
        await Service.favoritesControllerRemove(action);
      } else {
        await Service.favoritesControllerAdd(action);
      }
    },
    onSuccess: () => {
      // 直接更新缓存值为翻转后的状态
      const newValue = !isFavorite;
      queryClient.setQueryData(queryKey, newValue);

      // 显示成功提示
      const msg = isFavorite ? "已取消收藏" : "已收藏";
      toast.success(msg);

      // 刷新收藏列表
      queryClient.invalidateQueries({ queryKey: ["favorites", "list"] });
    },
  });

  return {
    isFavorite,
    isLoading: isLoading || isToggling,
    toggle,
  };
}
