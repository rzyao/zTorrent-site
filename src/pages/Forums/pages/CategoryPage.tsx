import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { ForumList } from "../components/ForumList";
import { type ForumOutletContext } from "../layouts";

/**
 * 分类页面
 * 显示特定分类下的帖子
 */
export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { searchQuery } = useOutletContext<ForumOutletContext>();

  if (!categoryId) {
    return <div className="flex h-64 items-center justify-center text-neutral-400">分类不存在</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">分类: {categoryId}</h1>
      <ForumList
        selectedCategory={categoryId}
        searchQuery={searchQuery}
        onTopicClick={(topicId) => {
          console.log("Navigate to topic:", topicId);
        }}
      />
    </div>
  );
}
