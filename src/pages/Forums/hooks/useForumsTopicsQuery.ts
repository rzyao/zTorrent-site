import { useQuery } from "@tanstack/react-query";
import { ForumsTopicsService } from "@/api";
import { ForumTopic } from "@/api/models/ForumTopic";

interface UseForumsTopicsQueryBaseProps {
  categoryId?: string;
  tag?: string;
  search?: string;
  page?: number;
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

export function useForumsTopicsQuery(props: UseForumsTopicsQueryBaseProps) {
  const { categoryId, tag, search, page = 1, limit = 20, sortBy = "latest" } = props;

  const query = useQuery({
    queryKey: ["forums", "topics", { categoryId, tag, search, page, limit, sortBy }],
    queryFn: async () => {
      // 这里的 requestBody 需要匹配 QueryTopicDto 的结构
      const requestBody: QueryTopicDto = {
        page,
        limit,
        search: tag ? `#${tag} ${search || ""}`.trim() : search, // 临时方案：通过 search 传递 tag，假设后端支持 #tag 搜索或全文检索
      };

      if (categoryId && categoryId !== "all") {
        // 特殊处理 "all", "trending", "new" 等前端路由参数
        if (categoryId === "trending") {
          // 如果后端 DTO 暂时没有 isTrending，我们优先使用 sort=activity 或 popular
          requestBody.sort = QueryTopicDto.sort.ACTIVITY;
        } else if (categoryId === "new") {
          requestBody.sort = QueryTopicDto.sort.LATEST;
        } else if (
          !["tech", "design", "gaming", "music", "learning", "competition"].includes(categoryId)
        ) {
          // 如果不是预定义的 slug，视为 ID
          requestBody.categoryId = categoryId;
        }
        // 注意：如果 categoryId 是 slug 且后端不支持，可能需要先转换 ID。
        // 根据用户要求，目前主要修复 sort 参数对接。
      }

      // 处理排序映射
      if (sortBy === "latest") {
        requestBody.sort = QueryTopicDto.sort.LATEST;
      } else if (sortBy === "popular") {
        requestBody.sort = QueryTopicDto.sort.POSTS; // 假设热门度按回复数排序
      } else if (sortBy === "trending") {
        requestBody.sort = QueryTopicDto.sort.ACTIVITY; // 活跃度
      }

      const response = await ForumsTopicsService.topicsControllerFindAll(requestBody);
      return response.data as unknown as ExtendedApiTopicListResponse;
    },
    placeholderData: (previousData) => previousData, // 保持上一页数据直到新数据到达
  });

  return query;
}
