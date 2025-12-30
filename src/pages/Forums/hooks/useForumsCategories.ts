import { useQuery } from "@tanstack/react-query";
import { ForumsCategoriesService } from "@/api";

export function useForumsCategories() {
  return useQuery({
    queryKey: ["forums", "categories"],
    queryFn: async () => {
      const response = await ForumsCategoriesService.categoriesControllerFindAll();
      return response.data || [];
    },
    // Categories change rarely, so we can use a long stale time
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
