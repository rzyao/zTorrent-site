import { Reply, Share2, Flag } from "lucide-react";
import { TopicData } from "../types";
import { NotificationSelector } from "./NotificationSelector";
import { cn } from "@/utils/cn";
import { BookmarkButton } from "../../../components/Interaction/BookmarkButton";
import { ReportDialog } from "../../../components/Interaction/ReportDialog";
import { LikeButton } from "../../../components/Interaction/LikeButton";

import { useForumTheme } from "../../../context/ForumThemeContext";
import { ActionButton } from "../../../components/ui/ActionButton";

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
    <div className="mb-12">
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
          <ActionButton
            icon={Share2}
            className={cn(
              "hidden h-auto rounded-full border border-transparent px-4 py-2 font-medium shadow-none hover:border-[#0088CC] sm:flex",
              colors.footerButtonBg,
              colors.footerButtonText,
            )}
            color="custom" // 使用 custom 以获得正确的颜色变量或在 className 中覆盖
          >
            <span>Share</span>
          </ActionButton>

          {topicData?.id && (
            <>
              <LikeButton
                type="topic"
                targetId={topicData.id}
                initialLiked={topicData.isLiked}
                initialCount={topicData.stats.likes}
                className={cn(
                  "hidden h-auto rounded-full border border-transparent px-4 py-2 transition-all duration-200 hover:border-[#0088CC] sm:flex",
                  colors.footerButtonBg,
                  colors.footerButtonText,
                )}
              />
              <BookmarkButton
                topicId={topicData.id}
                initialBookmarked={topicData.isBookmarked}
                className={cn(
                  "hidden border border-transparent px-4 py-2 hover:border-[#0088CC] sm:flex",
                  colors.footerButtonBg,
                  colors.footerButtonText,
                )}
              />
              <ReportDialog
                targetType="topic"
                targetId={topicData.id}
                trigger={
                  <ActionButton
                    icon={Flag}
                    className={cn(
                      "hidden h-auto rounded-full border border-transparent px-4 py-2 font-medium shadow-none hover:border-[#0088CC] sm:flex",
                      colors.footerButtonBg,
                      colors.footerButtonText,
                    )}
                  >
                    <span>Flag</span>
                  </ActionButton>
                }
              />
            </>
          )}
          <ActionButton
            onClick={() => {
              // Get topic ID from props if available
              const topicId = topicData?.id;
              import("../../../components/Composer/ComposerStore").then(({ useComposerStore }) => {
                useComposerStore.getState().open("REPLY", {
                  replyToTopicId: topicId,
                  replyToTitle: topicData?.title,
                });
              });
            }}
            icon={Reply}
            className="h-auto rounded-full border border-transparent px-3 py-2 shadow-none"
          >
            Reply
          </ActionButton>
        </div>

        {/* Notification Status Selector */}
        <NotificationSelector />
      </div>
    </div>
  );
};
