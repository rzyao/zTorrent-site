import { useQuery } from "@tanstack/react-query";
import { ForumThreadsService, ForumPostsService } from "@/api";
import { TopicData, PostData, Participant } from "../types";

/**
 * 将 API 返回的帖子数据转换为组件需要的格式
 */
function transformPost(apiPost: Record<string, any>, index: number): PostData {
  return {
    id: String(apiPost.id),
    username: apiPost.user?.username || apiPost.username || "unknown",
    name: apiPost.user?.nickname || apiPost.user?.username || apiPost.username || "",
    avatar:
      apiPost.user?.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiPost.user?.username || index}`,
    role: apiPost.user?.role,
    content: apiPost.content || "",
    createdAt: formatDate(apiPost.createdAt),
    likes: apiPost.likeCount || 0,
    avatarSize: 45,
    isOp: index === 0,
    isSmallAction: apiPost.isSmallAction || false,
    actionCode: apiPost.actionCode,
    stats:
      index === 0
        ? {
            created: formatDate(apiPost.createdAt),
            lastReply: "刚刚",
            replies: 0,
            views: "0",
            users: 0,
            likes: apiPost.likeCount || 0,
            links: 0,
          }
        : undefined,
  };
}

/**
 * 格式化日期为 Discourse 风格 (e.g., "May '13", "22h", "5m")
 */
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}分钟`;
  } else if (diffHours < 24) {
    return `${diffHours}小时`;
  } else if (diffDays < 30) {
    return `${diffDays}天`;
  } else {
    const month = date.toLocaleString("zh-CN", { month: "short" });
    const year = date.getFullYear();
    const currentYear = now.getFullYear();
    return currentYear === year ? month : `${year}年${month}`;
  }
}

/**
 * 获取话题详情的 Hook
 */
export function useTopicDetail(topicId: string | undefined) {
  // 获取主题详情
  const threadQuery = useQuery({
    queryKey: ["forum", "thread", topicId],
    queryFn: () => ForumThreadsService.forumThreadsControllerGet({ id: topicId! }),
    enabled: !!topicId,
  });

  // 获取帖子列表
  const postsQuery = useQuery({
    queryKey: ["forum", "posts", topicId],
    queryFn: () =>
      ForumPostsService.forumPostsControllerList({
        threadId: topicId!,
        page: 1,
        limit: 100, // 获取足够多的帖子
      }),
    enabled: !!topicId,
  });

  const isLoading = threadQuery.isLoading || postsQuery.isLoading;
  const isError = threadQuery.isError || postsQuery.isError;
  const error = threadQuery.error || postsQuery.error;

  // 转换数据为组件格式
  let topicData: TopicData | null = null;

  if (threadQuery.data?.data && postsQuery.data?.data) {
    const thread = threadQuery.data.data;
    const postsData = postsQuery.data.data;
    const posts = postsData.items || [];

    // 提取参与者
    const participantsMap = new Map<string, Participant>();
    posts.forEach((post: Record<string, any>) => {
      const username = post.user?.username || post.username;
      if (username && !participantsMap.has(username)) {
        participantsMap.set(username, {
          username,
          avatar:
            post.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        });
      }
    });

    topicData = {
      id: String(thread.id),
      title: thread.title || "",
      category: thread.category?.name || thread.categoryName || "general",
      categoryColor: thread.category?.color || "bg-gray-200 text-gray-800",
      tags: thread.tags || [],
      createdAt: formatDate(thread.createdAt),
      views: thread.viewCount || 0,
      replies: postsData.total || posts.length,
      participants: Array.from(participantsMap.values()).slice(0, 5),
      stats: {
        created: formatDate(thread.createdAt),
        lastReply: formatDate(thread.lastReplyAt || thread.updatedAt),
        replies: postsData.total || posts.length,
        views: String(thread.viewCount || 0),
        users: participantsMap.size,
        likes: thread.likeCount || 0,
        links: 0,
      },
      posts: posts.map((post: Record<string, any>, index: number) => transformPost(post, index)),
    };
  }

  return {
    topicData,
    isLoading,
    isError,
    error,
    refetch: () => {
      threadQuery.refetch();
      postsQuery.refetch();
    },
  };
}
