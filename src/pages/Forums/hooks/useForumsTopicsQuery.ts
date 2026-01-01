import { useInfiniteQuery } from "@tanstack/react-query";
import { ForumsTopicsService } from "@/api";
import { ForumTopic } from "@/api/models/ForumTopic";

interface UseForumsTopicsQueryBaseProps {
  categoryId?: string;
  tag?: string;
  search?: string;
  limit?: number;
  sortBy?: "latest" | "popular" | "trending";
}

// 补充类型定义，因为生成的类型可能不完整
interface ExtendedApiTopicListResponse {
  items: ExtendedApiTopic[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 复用 useTopicDetail 中定义的 ExtendedApiTopic 接口 (理想情况下应该提取到公共 types 文件)
// 在这里重新定义一次以保持独立性，或者放入 common types
export interface ExtendedApiTopic extends Omit<ForumTopic, "tags"> {
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
  };
  author?: {
    id: string;
    username: string;
    avatar?: string;
  };
  tags?: Array<{ id: string; name: string }>;
  participants?: Array<{
    id: string;
    username: string;
    avatar?: string;
  }>;
  lastReplier?: {
    id: string;
    username: string;
    avatar?: string;
  };
}

import { QueryTopicDto } from "@/api/models/QueryTopicDto";

/**
 * 无限滚动版本的话题列表查询 Hook
 * 使用 useInfiniteQuery 支持上拉加载更多
 */
export function useForumsTopicsQuery(props: UseForumsTopicsQueryBaseProps) {
  const { categoryId, tag, search, limit = 20, sortBy = "latest" } = props;

  const query = useInfiniteQuery({
    queryKey: ["forums", "topics", { categoryId, tag, search, limit, sortBy }],
    queryFn: async ({ pageParam = 1 }) => {
      // 构建 requestBody
      const requestBody: QueryTopicDto = {
        page: pageParam,
        limit,
        search: tag ? `#${tag} ${search || ""}`.trim() : search,
      };

      if (categoryId && categoryId !== "all") {
        if (categoryId === "trending") {
          requestBody.sort = QueryTopicDto.sort.ACTIVITY;
        } else if (categoryId === "new") {
          requestBody.sort = QueryTopicDto.sort.LATEST;
        } else if (
          !["tech", "design", "gaming", "music", "learning", "competition"].includes(categoryId)
        ) {
          requestBody.categoryId = categoryId;
        }
      }

      // 处理排序映射
      if (sortBy === "latest") {
        requestBody.sort = QueryTopicDto.sort.LATEST;
      } else if (sortBy === "popular") {
        requestBody.sort = QueryTopicDto.sort.POSTS;
      } else if (sortBy === "trending") {
        requestBody.sort = QueryTopicDto.sort.ACTIVITY;
      }

      const response = await ForumsTopicsService.topicsControllerFindAll(requestBody);
      return response.data as unknown as ExtendedApiTopicListResponse;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // 如果当前页小于总页数，则返回下一页页码
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined; // 没有更多数据
    },
    // 保持数据刷新
    staleTime: 1000 * 60, // 1 分钟后数据变旧
  });

  // 便于使用：将所有页面的 items 合并成一个数组
  const allTopics = query.data?.pages.flatMap((page) => page.items) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;

  return {
    ...query,
    allTopics,
    total,
  };
}
