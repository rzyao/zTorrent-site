import { useQuery } from "@tanstack/react-query";
import { ForumsTagsService } from "@/api";

export function useForumsTagsQuery() {
  return useQuery({
    queryKey: ["forums", "tags", "all"],
    queryFn: async () => {
      // Fetch all tags (limit 100 for now or implement scrolling in modal if needed)
      // Since default list is paginated, we use a large limit to simulate getting 'all'
      // or we can just fetch top tags. For customization we probably want *all*.
      // Let's assume fetching top 100 is enough for now given typical usage.
      const response = await ForumsTagsService.tagsControllerFindAll({ page: 1, limit: 100 });
      return response.data?.items || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
