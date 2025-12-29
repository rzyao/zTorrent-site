import { useOutletContext } from "react-router-dom";
import { ForumList } from "../components/ForumList";
import { type ForumOutletContext } from "../layouts";

/**
 * 论坛首页
 * 显示论坛帖子列表
 */
export function ForumHomePage() {
  const { selectedCategory, searchQuery } = useOutletContext<ForumOutletContext>();

  return (
    <ForumList
      selectedCategory={selectedCategory}
      searchQuery={searchQuery}
      onTopicClick={(topicId) => {
        // TODO: 使用路由导航到话题详情页
        console.log("Navigate to topic:", topicId);
      }}
    />
  );
}
