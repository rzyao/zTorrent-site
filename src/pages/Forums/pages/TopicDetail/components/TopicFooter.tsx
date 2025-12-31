import { Reply, Share2, Bookmark, Flag } from "lucide-react";
import { TopicData } from "../types";
import { NotificationSelector } from "./NotificationSelector";
import { cn } from "@/components/ui/utils";

import { useForumTheme } from "../../../context/ForumThemeContext";

interface TopicFooterProps {
  topicData?: TopicData;
}

export const TopicFooter = ({ topicData }: TopicFooterProps) => {
  const { colors } = useForumTheme();
  // 如果没有传入 topicData，使用默认值
  const stats = topicData?.stats || {
    views: "0",
    likes: 0,
    replies: 0,
  };
  const participants = topicData?.participants || [];

  return (
    <div className="mt-8 mb-12">
      {/* Topic Map Summary */}
      <div className={cn("flex items-center gap-4 border-t py-4", colors.dividerColor)}>
        <div className="flex items-center gap-4 text-xs font-bold tracking-wide text-[#919191] uppercase">
          <span>
            {stats.views} <span className="font-normal text-[#919191] capitalize">Views</span>
          </span>
          <span>
            {stats.likes} <span className="font-normal text-[#919191] capitalize">Likes</span>
          </span>
          <span>
            {stats.replies} <span className="font-normal text-[#919191] capitalize">Replies</span>
          </span>
        </div>
        <div className="ml-auto flex -space-x-1.5">
          {participants.map((p) => (
            <img
              key={p.username}
              src={p.avatar}
              alt={p.username}
              className="h-6 w-6 rounded-full border-2 border-white dark:border-neutral-800"
            />
          ))}
        </div>
      </div>

      {/* Action Divider */}
      <div className={cn("mb-6 border-b", colors.dividerColor)}></div>

      {/* Topic Action Buttons */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <button
            className={cn(
              "hidden cursor-pointer items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium select-none hover:border-[#0088CC] sm:flex",
              colors.footerButtonBg,
              colors.footerButtonText,
            )}
          >
            <Share2 className="h-4 w-4 text-[#0088CC]" />
            <span>Share</span>
          </button>
          <button
            className={cn(
              "hidden cursor-pointer items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium select-none hover:border-[#0088CC] sm:flex",
              colors.footerButtonBg,
              colors.footerButtonText,
            )}
          >
            <Bookmark className="h-4 w-4 text-[#0088CC]" />
            <span>Bookmark</span>
          </button>
          <button
            className={cn(
              "hidden cursor-pointer items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium select-none hover:border-[#0088CC] sm:flex",
              colors.footerButtonBg,
              colors.footerButtonText,
            )}
          >
            <Flag className="h-4 w-4 text-[#0088CC]" />
            <span>Flag</span>
          </button>
          <button
            onClick={() => {
              // Get topic ID from props if available
              const topicId = topicData?.id;
              import("../../../components/Composer/ComposerStore").then(({ useComposerStore }) => {
                useComposerStore.getState().open("REPLY", { replyToTopicId: topicId });
              });
            }}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-transparent bg-[#0088CC] px-5 py-2 text-sm font-bold text-white select-none hover:border-white hover:bg-[#0088CC]"
          >
            <Reply className="h-4 w-4" />
            <span>Reply</span>
          </button>
        </div>

        {/* Notification Status Selector */}
        <NotificationSelector />
      </div>
    </div>
  );
};
