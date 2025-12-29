import { useNavigate, useOutletContext } from "react-router-dom";
import { ForumList } from "./ForumList";
import { type ForumOutletContext } from "../layouts/ForumLayout";

/**
 * 论坛首页
 * 显示论坛帖子列表
 */
export function ForumHomePage() {
  const navigate = useNavigate();
  const { selectedCategory, searchQuery } = useOutletContext<ForumOutletContext>();

  return (
    <ForumList
      selectedCategory={selectedCategory}
      searchQuery={searchQuery}
      onTopicClick={(topicId) => {
        navigate(`/forum/topic/${topicId}`);
      }}
    />
  );
}
