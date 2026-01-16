import { useQuery } from "@tanstack/react-query";
import { ForumsTagsService } from "@/api";

export function useForumsTagsQuery() {
  return useQuery({
    queryKey: ["forums", "tags", "all"],
    queryFn: async () => {
      const limit = 200;
      const first = await ForumsTagsService.tagsControllerFindAll({ page: 1, limit });
      const firstData = first.data;
      const items = Array.isArray(firstData?.items) ? [...firstData.items] : [];
      const totalPages = Number(firstData?.totalPages || 1);

      const safeTotalPages = Number.isFinite(totalPages) ? Math.max(1, totalPages) : 1;
      for (let page = 2; page <= safeTotalPages; page++) {
        const res = await ForumsTagsService.tagsControllerFindAll({ page, limit });
        const pageItems = res.data?.items;
        if (!Array.isArray(pageItems) || pageItems.length === 0) break;
        items.push(...pageItems);
      }

      return items;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
