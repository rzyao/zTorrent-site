import { useParams, useNavigate } from "react-router-dom";
import { TopicDetail } from "../components/TopicDetail";

/**
 * 话题详情页
 * 显示单个话题的详细内容和回复
 */
export function TopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  if (!topicId) {
    return <div className="flex h-64 items-center justify-center text-neutral-400">话题不存在</div>;
  }

  return <TopicDetail topicId={topicId} onBack={() => navigate("/forum")} />;
}
