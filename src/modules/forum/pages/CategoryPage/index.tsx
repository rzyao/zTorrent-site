import { useNavigate, useParams, Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { TopicList } from "../../components/TopicList";
import { type ForumOutletContext } from "../../layouts/ForumLayout";
import { ForumsCategoriesService } from "@/api";
import { useForumTheme } from "../../context/ForumThemeContext";
import { Loader2 } from "lucide-react";
import { CategoryHeader } from "./components/CategoryHeader";

/**
 * 分类页面
 * 显示特定分类下的帖子
 * 路由参数:
 * - key: 分类唯一标识 Key
 * - sortBy: 排序方式 (latest | hot)
 */
export function CategoryPage() {
  const { categoryKey, categoryId, tagName, sortBy } = useParams<{
    categoryKey?: string;
    categoryId?: string;
    tagName?: string;
    sortBy?: string;
  }>();
  const categoryKeyParam = categoryKey ?? categoryId;
  const { searchQuery } = useOutletContext<ForumOutletContext>();
  const navigate = useNavigate();
  const { colors } = useForumTheme();

  // 通过 key 获取类别详情，并从返回的 data 中提取 id 用于话题列表筛选
  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["forum", "category", "by-key", categoryKeyParam],
    queryFn: async () => {
      const response = await ForumsCategoriesService.categoriesControllerFindByKey({
        key: categoryKeyParam!,
      });
      return response.data;
    },
    enabled: !!categoryKeyParam,
  });

  // 加载类别信息中
  if (categoryKeyParam && isCategoryLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className={`h-8 w-8 animate-spin ${colors.textMuted}`} />
      </div>
    );
  }

  // 类别不存在：增加友好提示与引导
  if (categoryKeyParam && !category) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-5 text-center dark:border-neutral-700 dark:bg-neutral-800/50">
          <p className={`mb-2 ${colors.textSecondary}`}>分类不存在或已被删除</p>
          <p className={`text-sm ${colors.textMuted}`}>
            请使用分类的唯一标识 key（仅小写字母与短横线），例如：tech-news、general。
          </p>
          <div className="mt-3">
            <Link
              to="/forum/categories"
              className="text-blue-600 underline underline-offset-4 dark:text-amber-400"
            >
              前往所有类别页选择分类
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 标签页面但没有标签名
  if (!categoryKeyParam && !tagName) {
    return (
      <div className="flex h-64 items-center justify-center text-neutral-400">分类或标签不存在</div>
    );
  }

  // 解析排序方式，默认为 latest
  const validSortBy = sortBy === "hot" ? "hot" : "latest";
  // 选中分类的内部 ID（用于话题列表筛选），当后端未返回 id 时回退为 "all"
  const selectedCategoryId = (category as any)?.id ? String((category as any).id) : "all";

  return (
    <div className="flex flex-col">
      {/* 分类头部信息 */}
      {category && <CategoryHeader category={category} />}

      <TopicList
        selectedCategory={selectedCategoryId}
        categoryName={category?.name}
        selectedTag={tagName}
        searchQuery={searchQuery}
        sortBy={validSortBy}
        onTopicClick={(topicId) => {
          navigate(`/forum/topic/${topicId}`);
        }}
      />
    </div>
  );
}
