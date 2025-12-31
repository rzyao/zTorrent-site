import { useNavigate, useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ForumList } from "./ForumList";
import { type ForumOutletContext } from "../layouts/ForumLayout";
import { ForumsCategoriesService } from "@/api";
import { useForumTheme } from "../context/ForumThemeContext";
import { Loader2 } from "lucide-react";

/**
 * 分类页面
 * 显示特定分类下的帖子
 * 路由参数:
 * - categoryId: 分类 ID
 * - sortBy: 排序方式 (latest | hot)
 */
export function CategoryPage() {
  const { categoryId, tagName, sortBy } = useParams<{
    categoryId: string;
    tagName: string;
    sortBy: string;
  }>();
  const { searchQuery } = useOutletContext<ForumOutletContext>();
  const navigate = useNavigate();
  const { colors } = useForumTheme();

  // 通过 ID 获取类别详情
  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["forum", "category", "by-id", categoryId],
    queryFn: async () => {
      const response = await ForumsCategoriesService.categoriesControllerFindOne({
        id: categoryId!,
      });
      return response.data;
    },
    enabled: !!categoryId,
  });

  // 加载类别信息中
  if (categoryId && isCategoryLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className={`h-8 w-8 animate-spin ${colors.textMuted}`} />
      </div>
    );
  }

  // 类别不存在
  if (categoryId && !category) {
    return <div className="flex h-64 items-center justify-center text-neutral-400">分类不存在</div>;
  }

  // 标签页面但没有标签名
  if (!categoryId && !tagName) {
    return (
      <div className="flex h-64 items-center justify-center text-neutral-400">分类或标签不存在</div>
    );
  }

  // 解析排序方式，默认为 latest
  const validSortBy = sortBy === "hot" ? "hot" : "latest";

  return (
    <ForumList
      selectedCategory={categoryId || "all"}
      categoryName={category?.name}
      selectedTag={tagName}
      searchQuery={searchQuery}
      sortBy={validSortBy}
      onTopicClick={(topicId) => {
        navigate(`/forum/topic/${topicId}`);
      }}
    />
  );
}
