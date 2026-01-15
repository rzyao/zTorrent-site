import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TorrentsCommentsService } from "@/api/services/TorrentsCommentsService";
import { customToast } from "@/hooks/useToast";
import { Comment } from "../types";

export function useTorrentComments(torrentId?: string) {
  const queryClient = useQueryClient();

  // Query
  const {
    data: comments,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["torrent", "comments", torrentId],
    queryFn: async () => {
      if (!torrentId) return [];
      const resp = await TorrentsCommentsService.torrentCommentsControllerList({
        torrentId: String(torrentId),
        limit: 100,
        page: 1,
      });
      const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      const data = body?.data ?? body;
      if (Array.isArray(data?.items)) {
        return data.items.map((c: any) => ({
          id: c.id,
          user: c.userName || "匿名用户",
          userLevel: c.userLevel || "User",
          avatar: c.avatar || "",
          date: new Date(c.createdAt).toLocaleString(),
          content: c.content,
          thanks: c.likedCount || 0,
        })) as Comment[];
      }
      return [];
    },
    enabled: !!torrentId,
    initialData: [],
  });

  // Mutation
  const { mutateAsync: postComment, isPending: isPosting } = useMutation({
    mutationFn: async (content: string) => {
      if (!torrentId) throw new Error("No torrent ID");
      await TorrentsCommentsService.torrentCommentsControllerCreate({
        torrentId: String(torrentId),
        content,
      });
    },
    onSuccess: () => {
      customToast.success("发表成功");
      refetch();
    },
    onError: (e: any) => {
      customToast.error(e?.message || "发表失败");
    },
  });

  return {
    comments,
    isLoading,
    postComment,
    isPosting,
    refetch,
  };
}
