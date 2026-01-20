import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { TopicList } from "../components/TopicList";
import { type ForumOutletContext } from "../layouts/ForumLayout";

/**
 * 论坛首页
 * 显示论坛帖子列表
 */
export function ForumHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCategory, searchQuery } = useOutletContext<ForumOutletContext>();

  const sortBy = location.pathname.endsWith("/hot") ? "hot" : "latest";

  return (
    <TopicList
      selectedCategory={selectedCategory}
      searchQuery={searchQuery}
      sortBy={sortBy}
      onTopicClick={(topicId) => {
        navigate(`/forum/topic/${topicId}`);
      }}
    />
  );
}
