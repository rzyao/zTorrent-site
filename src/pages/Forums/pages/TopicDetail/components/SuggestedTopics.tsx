import { useNavigate } from "react-router-dom";
import { useForumsTopicsQuery } from "../../../hooks/useForumsTopicsQuery";
import { useForumTheme } from "../../../context/ForumThemeContext";
import { cn } from "@/components/ui/utils";

interface SuggestedTopicsProps {
  categoryId?: string;
  currentTopicId?: string;
}

export const SuggestedTopics = ({ categoryId, currentTopicId }: SuggestedTopicsProps) => {
  const navigate = useNavigate();
  const { colors } = useForumTheme();

  // 查询相关话题 (同分类)
  // 注意：我们这里用 "popular" 来模拟推荐
  const { allTopics } = useForumsTopicsQuery({
    categoryId: categoryId || "all",
    limit: 5,
    sortBy: "popular", // 推荐一些热门的
  });

  const topics = allTopics.filter((t) => t.id !== currentTopicId).slice(0, 5);

  if (topics.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className={cn("mb-3 text-[19px] font-bold", colors.titleColor)}>建议话题</h3>
      <div className="overflow-hidden">
        <div
          className={cn(
            "grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 border-b py-2 text-[15px] font-medium text-[#919191]",
            colors.dividerColor,
          )}
        >
          <div className="col-span-2">话题</div>
          <div className="w-16 text-center">回复</div>
          <div className="w-16 text-center">浏览</div>
          <div className="w-16 text-center">活动</div>
        </div>
        {topics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => navigate(`/forum/topic/${topic.id}`)}
            className={cn(
              "grid cursor-pointer grid-cols-[auto_1fr_auto_auto_auto] items-center gap-x-4 border-b py-3 text-sm",
              colors.dividerColor,
              "hover:bg-[#f9f9f9] dark:hover:bg-white/5",
            )}
          >
            {/* Posters Column */}
            <div className="flex w-8 justify-center">
              <img
                src={
                  topic.author?.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${topic.author?.username}`
                }
                alt="poster"
                className={`h-8 w-8 rounded-full border-2 ${colors.avatarBorder}`}
              />
            </div>
            <div className="min-w-0 pl-2">
              <div className={cn("truncate font-medium hover:underline", colors.titleColor)}>
                {topic.title}
              </div>
              <div className="mt-1 flex items-center gap-1">
                {/* Replaced Badge Style */}
                <span className="flex items-center gap-1">
                  <span
                    className="h-[9px] w-[9px]"
                    style={{ backgroundColor: topic.category?.color || "#999" }}
                  ></span>
                  <span className="text-[13px] font-bold text-[#919191]">
                    {topic.category?.name || "常规"}
                  </span>
                </span>
                {topic.tags &&
                  topic.tags.map((t) => (
                    <span key={t.id} className="ml-1 flex items-center text-[11px] text-[#919191]">
                      <span className="mr-0.5 inline-block h-1 w-1 rounded-full bg-[#919191]"></span>
                      {t.name}
                    </span>
                  ))}
              </div>
            </div>
            <div className={`w-16 text-center text-[#919191]`}>{topic.replyCount}</div>
            <div className={`w-16 text-center text-[#919191]`}>{topic.views}</div>
            <div className={`w-16 text-center text-[#919191]`}>
              {topic.lastReplyAt ? new Date(topic.lastReplyAt).toLocaleDateString() : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
