import { Reply, Share2, Flag } from "lucide-react";
import { TopicData } from "../types";
import { NotificationSelector } from "./NotificationSelector";
import { cn } from "@/utils/cn";
import { BookmarkButton } from "../../../components/Interaction/BookmarkButton";
import { ReportDialog } from "../../../components/Interaction/ReportDialog";
import { LikeButton } from "../../../components/Interaction/LikeButton";

import { useForumTheme } from "../../../context/ForumThemeContext";
import { Button } from "../../../components/ui/button";

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
          {/* Share 按钮 */}
          <Button variant="default" className={cn("hidden rounded-full sm:flex")}>
            <Share2 className="size-4" />
            <span>分享</span>
          </Button>

          {topicData?.id && (
            <>
              {/* Like 按钮 */}
              <LikeButton
                type="topic"
                targetId={topicData.id}
                initialLiked={topicData.isLiked}
                initialCount={topicData.stats.likes}
                className="hidden sm:flex"
              />
              {/* Bookmark 按钮 */}
              <BookmarkButton
                topicId={topicData.id}
                initialBookmarked={topicData.isBookmarked}
                className="hidden sm:flex"
              />
              {/* Flag 按钮 */}
              <ReportDialog
                targetType="topic"
                targetId={topicData.id}
                trigger={
                  <Button variant="default" className={cn("hidden rounded-full sm:flex")}>
                    <Flag className="size-4" />
                    <span>举报</span>
                  </Button>
                }
              />
            </>
          )}
          {/* Reply 按钮 */}
          <Button
            variant="primary"
            className="rounded-full"
            onClick={() => {
              const topicId = topicData?.id;
              import("../../../components/Composer/ComposerStore").then(({ useComposerStore }) => {
                useComposerStore.getState().open("REPLY", {
                  replyToTopicId: topicId,
                  replyToTitle: topicData?.title,
                });
              });
            }}
          >
            <Reply className="size-4" />
            Reply
          </Button>
        </div>

        {/* Notification Status Selector */}
        <NotificationSelector className="h-9" />
      </div>
    </div>
  );
};
