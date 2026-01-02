import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { ForumsTopicsService, ForumsPostsService } from "@/api";
import { TopicData, PostData, Participant } from "../types";

// 补充生成的类型定义中缺失的字段
interface ExtendedApiPost {
  id: string;
  content: string;
  floor: number;
  postNumber?: number; // 话题内楼层号
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
  // 新增：后端显式返回的回复列表
  incomingReplies?: Array<{
    id: string;
    floor: number;
    content: string;
    author: {
      username: string;
      nickname?: string;
      avatar?: string;
    };
    created_at: string;
  }>;
  // 兼容 snake_case
  incoming_replies?: Array<{
    id: string;
    floor: number;
    content: string;
    author: {
      username: string;
      nickname?: string;
      avatar?: string;
    };
    created_at: string;
  }>;
}

interface ExtendedApiTopic {
  id: string;
  title: string;
  content: string;
  views: number;
  replyCount: number;
  postsCount?: number; // 新增：帖子总数
  highestPostNumber?: number; // 新增：最高楼层号
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

  const incomingReplies = apiPost.incomingReplies || apiPost.incoming_replies;

  return {
    id: String(apiPost.id),
    postNumber: apiPost.postNumber || apiPost.floor, // 使用后端返回的话题内楼层号
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
    // 直接使用后端返回的引用关系
    incomingReplies: incomingReplies?.map((reply) => ({
      id: reply.id,
      username: reply.author.username,
      name: reply.author.nickname || reply.author.username,
      avatar:
        reply.author.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author.username}`,
      role: "user",
      content: reply.content,
      createdAt: formatDate(reply.created_at),
      likes: 0,
      avatarSize: 20,
      isOp: false,
      isSmallAction: false,
    })),
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
 * @param topicId 话题 ID
 * @param options.nearPost 可选，指定要加载的楼层号附近的帖子
 */
export function useTopicDetail(topicId: string | undefined, options?: { nearPost?: number }) {
  const nearPost = options?.nearPost;

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
  // 如果指定了 nearPost，计算包含该楼层的页码作为初始页
  const PAGE_SIZE = 20;
  const initialPage = nearPost ? Math.max(1, Math.ceil(nearPost / PAGE_SIZE)) : 1;

  // queryKey 包含 nearPost 以在跳转时触发重新加载
  const postsQuery = useInfiniteQuery({
    queryKey: ["forum", "posts", topicId, nearPost ? `near-${nearPost}` : "default"],
    queryFn: async ({ pageParam }) => {
      // 重要：nearPost 只在初始请求时使用
      // 后续分页请求（向上/向下加载）不应传递 nearPost，否则后端会忽略 page 参数
      const isInitialRequest = pageParam === initialPage;

      const res = await ForumsPostsService.postsControllerFindAll({
        topicId: topicId!,
        page: pageParam,
        limit: PAGE_SIZE,
        nearPost: isInitialRequest ? nearPost : undefined, // 只在初始请求时传递
      });
      const data = res.data as unknown as {
        items: ExtendedApiPost[];
        total: number;
        page: number;
        limit: number;
        hasNext: boolean;
        hasPrevious: boolean;
      };
      // 关键修复：保存请求时的 pageParam 作为 requestedPage
      // 因为后端返回的 page 字段可能不准确（始终返回固定值）
      return {
        ...data,
        requestedPage: pageParam, // 前端追踪的真实页码
      };
    },
    initialPageParam: initialPage,
    getNextPageParam: (lastPage) => {
      // 使用前端追踪的 requestedPage 而非后端返回的 page
      if (lastPage.hasNext) {
        return lastPage.requestedPage + 1;
      }
      return undefined;
    },
    // 支持向前加载
    // 使用前端追踪的 requestedPage，彻底避免后端 page 字段错误导致的死循环
    getPreviousPageParam: (firstPage) => {
      // 只有当 requestedPage > 1 时才能继续向前加载
      if (firstPage.requestedPage > 1) {
        return firstPage.requestedPage - 1;
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

    // 调试日志：输出 pages 信息
    console.log("[useTopicDetail] Pages info:", {
      pageCount: postsQuery.data.pages.length,
      pagesDetails: postsQuery.data.pages.map((p, i) => ({
        index: i,
        requestedPage: p.requestedPage,
        itemCount: p.items?.length,
        firstFloor: p.items?.[0]?.floor,
        lastFloor: p.items?.[p.items.length - 1]?.floor,
      })),
      totalPostsBeforeDedup: allPosts.length,
    });

    // 去重：使用 Map 根据 ID 去重，保留最后出现的版本
    const postsMap = new Map<string, ExtendedApiPost>();
    allPosts.forEach((post) => {
      postsMap.set(String(post.id), post);
    });

    // 按 floor 排序，确保楼层顺序正确
    const posts: ExtendedApiPost[] = Array.from(postsMap.values()).sort(
      (a, b) => a.floor - b.floor,
    );

    // 调试日志：输出合并后的 posts 信息
    console.log("[useTopicDetail] Merged posts:", {
      totalPosts: posts.length,
      firstFloor: posts[0]?.floor,
      lastFloor: posts[posts.length - 1]?.floor,
    });

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

  // 计算真实的帖子总数（用于时间轴）
  // 使用 Math.max 获取最大合理值，因为后端 postsCount 可能返回错误的值
  const postsTotal = postsQuery.data?.pages?.[0]?.total;
  const highestPostNumber = threadQuery.data?.highestPostNumber;
  const postsCount = threadQuery.data?.postsCount;

  // 选择最大的值作为总数（更可靠）
  const totalPostsCount =
    Math.max(
      highestPostNumber ?? 0,
      postsTotal ?? 0,
      // postsCount 可能不准确，只在值合理时使用
      postsCount && postsCount > 20 ? postsCount : 0,
    ) || 0;

  return {
    topicData,
    isLoading,
    isError,
    error,
    // 话题真实帖子总数（用于时间轴）
    totalPostsCount,
    // 向下滚动
    fetchNextPage: postsQuery.fetchNextPage,
    hasNextPage: postsQuery.hasNextPage,
    isFetchingNextPage: postsQuery.isFetchingNextPage,
    // 向上滚动
    fetchPreviousPage: postsQuery.fetchPreviousPage,
    hasPreviousPage: postsQuery.hasPreviousPage,
    isFetchingPreviousPage: postsQuery.isFetchingPreviousPage,
    // 刷新
    refetch: () => {
      threadQuery.refetch();
      postsQuery.refetch();
    },
  };
}
