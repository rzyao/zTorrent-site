import { useQuery } from "@tanstack/react-query";
import { ForumsCategoriesService } from "@/api";

export function useForumsCategories() {
  return useQuery({
    queryKey: ["forums", "categories"],
    queryFn: async () => {
      const response = await ForumsCategoriesService.categoriesControllerFindAll();
      const categories = response.data || [];
      // 增加前端稳定排序，优先按 sortOrder 升序，其次按 id
      return [...categories].sort((a: any, b: any) => {
        if (a.sortOrder !== b.sortOrder) {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        }
        return String(a.id).localeCompare(String(b.id));
      });
    },
    // Categories change rarely, so we can use a long stale time
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
