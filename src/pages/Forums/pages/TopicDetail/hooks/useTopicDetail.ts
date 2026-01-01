import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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
  replyTo?: {
    id: string;
    floor: number;
    content?: string;
    author?: {
      username: string;
      avatar?: string;
    };
  } | null;
}

interface ExtendedApiTopic {
  id: string;
  title: string;
  content: string;
  views: number;
  replyCount: number;
  isPinned: boolean;
  isTrending: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  lastReplyAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    color?: string;
    icon?: string;
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
    replyTo: apiPost.replyTo
      ? {
          id: apiPost.replyTo.id,
          floor: apiPost.replyTo.floor,
          username: apiPost.replyTo.author?.username || "unknown",
          avatar: apiPost.replyTo.author?.avatar,
          content: apiPost.replyTo.content,
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

  // 获取帖子列表 - 无限滚动
  const postsQuery = useInfiniteQuery({
    queryKey: ["forum", "posts", topicId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await ForumsPostsService.postsControllerFindAll({
        topicId: topicId!,
        page: pageParam,
        limit: 20,
      });
      return res.data as unknown as {
        items: ExtendedApiPost[];
        total: number;
        page: number;
        limit: number;
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.limit);
      if (lastPage.page < totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
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
    // 合并所有页面的帖子
    const allPosts = postsQuery.data.pages.flatMap((page) => page.items || []) as ExtendedApiPost[];

    // 创建可变的帖子数组
    const posts: ExtendedApiPost[] = [...allPosts];

    // 只有当列表中没有 1 楼时才手动添加
    // 防止 API 已经返回了 1 楼导致重复
    const hasOP = posts.length > 0 && posts.some((p) => p.floor === 1);

    if (!hasOP) {
      // 构造 OP (1楼) - 基于 Topic 数据
      const opPost: ExtendedApiPost = {
        id: "topic-" + thread.id, // 前端标识为 Topic 主体
        content: thread.content,
        floor: 1,
        isSystem: false,
        created_at: thread.createdAt,
        like_count: 0, // 暂未从 Topic 获取点赞数
        replies_count: thread.replyCount,
        author: thread.author || {
          id: "unknown",
          username: "unknown",
          avatar: undefined,
        },
      } as ExtendedApiPost;

      // 将 OP 作为第一条数据 (1楼)
      posts.unshift(opPost);
    }

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
      categoryColor: thread.category?.color || "#999",
      categoryIcon: thread.category?.icon,
      tags: thread.tags?.map((t) => t.name) || [],
      createdAt: formatDate(thread.createdAt) || "未知",
      views: thread.views || 0,
      replies: posts.length,
      participants: Array.from(participantsMap.values()).slice(0, 5),
      stats: {
        created: formatDate(thread.createdAt) || "未知",
        lastReply: formatDate(thread.lastReplyAt || thread.updatedAt) || "刚刚",
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
    // 无限滚动相关
    fetchNextPage: postsQuery.fetchNextPage,
    hasNextPage: postsQuery.hasNextPage,
    isFetchingNextPage: postsQuery.isFetchingNextPage,
    refetch: () => {
      threadQuery.refetch();
      postsQuery.refetch();
    },
  };
}
