import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ForumsTagGroupsService, CreateTagGroupDto, UpdateTagGroupDto, ForumTagGroup } from "@/api";
import { useAsyncAction } from "@/hooks/useAsyncAction";

export const tagGroupKeys = {
  all: ["forum", "tag-groups"] as const,
  lists: () => [...tagGroupKeys.all, "list"] as const,
  list: (filters: string) => [...tagGroupKeys.lists(), { filters }] as const,
  details: () => [...tagGroupKeys.all, "detail"] as const,
  detail: (id: string) => [...tagGroupKeys.details(), id] as const,
};

// Start of Fix: Define type with ID since generated type might miss it or it's implicitly there
export interface ForumTagGroupWithId extends ForumTagGroup {
  id: string;
}

interface TagGroupListResponse {
  items: ForumTagGroupWithId[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Hook to fetch all tag groups (paginated)
 */
export function useTagGroupsQuery(page = 1, limit = 50) {
  return useQuery({
    queryKey: tagGroupKeys.list(`page=${page}&limit=${limit}`),
    queryFn: async () => {
      const response = await ForumsTagGroupsService.tagGroupsControllerFindAll({ page, limit });
      // Force cast to include ID, assuming backend sends it
      return response.data as unknown as TagGroupListResponse;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single tag group by ID
 */
export function useTagGroupQuery(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: tagGroupKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const response = await ForumsTagGroupsService.tagGroupsControllerFindOne({ id });
      return response.data as unknown as ForumTagGroupWithId;
    },
    enabled: !!id && enabled,
  });
}

/**
 * Hook to create a new tag group
 */
export function useCreateTagGroupMutation() {
  const queryClient = useQueryClient();
  const { execute, loading } = useAsyncAction({
    successMessage: "标签组创建成功",
  });

  const mutate = async (data: CreateTagGroupDto) => {
    return execute(async () => {
      await ForumsTagGroupsService.tagGroupsControllerCreate(data);
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: tagGroupKeys.lists() });
    });
  };

  return { mutate, isLoading: loading };
}

/**
 * Hook to update a tag group
 */
export function useUpdateTagGroupMutation() {
  const queryClient = useQueryClient();
  const { execute, loading } = useAsyncAction({
    successMessage: "标签组更新成功",
  });

  const mutate = async (data: UpdateTagGroupDto) => {
    return execute(async () => {
      await ForumsTagGroupsService.tagGroupsControllerUpdate(data);
      // Invalidate list and detail queries
      queryClient.invalidateQueries({ queryKey: tagGroupKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: tagGroupKeys.detail(data.id) });
      }
    });
  };

  return { mutate, isLoading: loading };
}

/**
 * Hook to delete a tag group
 */
export function useDeleteTagGroupMutation() {
  const queryClient = useQueryClient();
  const { execute, loading } = useAsyncAction({
    successMessage: "标签组已删除",
  });

  const mutate = async (id: string) => {
    return execute(async () => {
      await ForumsTagGroupsService.tagGroupsControllerRemove({ id });
      queryClient.invalidateQueries({ queryKey: tagGroupKeys.lists() });
    });
  };

  return { mutate, isLoading: loading };
}
