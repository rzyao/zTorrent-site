import { useQuery } from "@tanstack/react-query";
import { ForumsTopicsService, ForumsPostsService } from "@/api";
import { TopicData, PostData, Participant } from "../types";

// 补充生成的类型定义中缺失的字段
interface ExtendedApiPost {
  id: string;
  content: string;
  floor: number;
  isSystem: boolean;
  replies_count?: number;
  like_count?: number;
  created_at: string;
  author?: {
    id: string;
    username: string;
    nickname?: string;
    avatar?: string;
    role?: string;
  };
  reply_to?: {
    id: string;
    floor: number;
    author?: {
      username: string;
    };
  } | null;
}

interface ExtendedApiTopic {
  id: string;
  title: string;
  content: string;
  views: number;
  reply_count: number;
  is_pinned: boolean;
  is_trending: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  last_reply_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    color?: string;
  };
  author?: {
    id: string;
    username: string;
    avatar?: string;
  };
  tags?: Array<{ id: string; name: string }>;
}

/**
 * 将 API 返回的帖子数据转换为组件需要的格式
 */
function transformPost(apiPost: ExtendedApiPost, index: number): PostData {
  const author = apiPost.author;
  const username = author?.username || "unknown";

  return {
    id: String(apiPost.id),
    username: username,
    name: author?.nickname || username,
    avatar: author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    role: author?.role || "user",
    content: apiPost.content || "",
    createdAt: formatDate(apiPost.created_at),
    likes: apiPost.like_count || 0,
    avatarSize: 45,
    isOp: index === 0,
    isSmallAction: apiPost.isSystem || false,
    // actionCode: apiPost.actionCode, // 暂时移除未定义的字段
    stats:
      index === 0
        ? {
            created: formatDate(apiPost.created_at),
            lastReply: "刚刚", // 暂时硬编码，应当从 topic 获取
            replies: apiPost.replies_count || 0,
            views: "0",
            users: 0,
            likes: apiPost.like_count || 0,
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

  if (diffMins < 1) {
    return "刚刚";
  } else if (diffMins < 60) {
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
    queryKey: ["forum", "topic", topicId],
    queryFn: async () => {
      const res = await ForumsTopicsService.topicsControllerFindOneByParam(topicId!);
      return res.data as unknown as ExtendedApiTopic;
    },
    enabled: !!topicId,
  });

  // 获取帖子列表
  const postsQuery = useQuery({
    queryKey: ["forum", "posts", topicId],
    queryFn: async () => {
      const res = await ForumsPostsService.postsControllerFindAll({
        topicId: topicId!,
        page: 1,
        limit: 100, // 获取足够多的帖子
      });
      return res.data;
    },
    enabled: !!topicId,
  });

  const isLoading = threadQuery.isLoading || postsQuery.isLoading;
  const isError = threadQuery.isError || postsQuery.isError;
  const error = threadQuery.error || postsQuery.error;

  // 转换数据为组件格式
  let topicData: TopicData | null = null;

  if (threadQuery.data && postsQuery.data) {
    const thread = threadQuery.data;
    const postsData = postsQuery.data;
    // 适配分页/列表返回结构
    const posts = (
      Array.isArray(postsData) ? postsData : (postsData as any).items || []
    ) as ExtendedApiPost[];

    // 提取参与者
    const participantsMap = new Map<string, Participant>();
    posts.forEach((post) => {
      const username = post.author?.username;
      if (username && !participantsMap.has(username)) {
        participantsMap.set(username, {
          username,
          avatar:
            post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        });
      }
    });

    topicData = {
      id: String(thread.id),
      title: thread.title || "",
      category: thread.category?.name || "常规",
      categoryColor: thread.category?.color || "bg-gray-200 text-gray-800",
      tags: thread.tags?.map((t) => t.name) || [],
      createdAt: formatDate(thread.created_at),
      views: thread.views || 0,
      replies: posts.length,
      participants: Array.from(participantsMap.values()).slice(0, 5),
      stats: {
        created: formatDate(thread.created_at),
        lastReply: formatDate(thread.last_reply_at || thread.updated_at),
        replies: posts.length,
        views: String(thread.views || 0),
        users: participantsMap.size,
        likes: 0, // 话题点赞数暂未从 API 获取
        links: 0,
      },
      posts: posts.map((post, index) => transformPost(post, index)),
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
