import { Link as LinkIcon, Reply, Pencil, CheckCircle2 } from "lucide-react";
import { PostData } from "../../types";
import { useComposerStore } from "../../../../components/Composer/ComposerStore";
import { LikeButton } from "../../../../components/Interaction/LikeButton";
import { BookmarkButton } from "../../../../components/Interaction/BookmarkButton";
import { ReportDialog } from "../../../../components/Interaction/ReportDialog";
import { ForumTopicBounty } from "../../../../types/bounty";
import { useBountyActions } from "../../hooks/useBountyActions";

interface PostFooterProps {
  post: PostData;
  incomingReplies?: PostData[];
  areIncomingRepliesExpanded: boolean;
  onToggleIncomingReplies: () => void;
  topicTitle?: string;
  topicId?: string;
  canEdit?: boolean;
  onEdit?: () => void;
  bounty?: ForumTopicBounty;
  isAuthor?: boolean;
  onUpdated?: () => void;
}

export function PostFooter({
  post,
  incomingReplies,
  areIncomingRepliesExpanded,
  onToggleIncomingReplies,
  topicTitle,
  topicId,
  canEdit,
  onEdit,
  bounty,
  isAuthor,
  onUpdated,
}: PostFooterProps) {
  const handleReply = () => {
    useComposerStore.getState().open("REPLY", {
      replyToPostId: post.id,
      replyToTitle: topicTitle,
      replyToTopicId: topicId,
    });
  };

  const { award } = useBountyActions(topicId, { onUpdated });
  const isWinner = bounty?.winnerPostId && String(bounty.winnerPostId) === String(post.id);
  const canAward =
    Boolean(
      isAuthor &&
      bounty &&
      bounty.status === "open" &&
      bounty.cancelRequestStatus !== "pending" &&
      topicId &&
      post.username !== undefined,
    ) && !post.isOp;

  return (
    <div className="mt-4 flex items-center gap-4 select-none">
      {/* 左侧：查看回复按钮 */}
      {incomingReplies && incomingReplies.length > 0 && (
        <button
          onClick={onToggleIncomingReplies}
          className="mr-auto flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-semibold text-[#A6A6A6] transition-colors hover:bg-neutral-200 hover:text-gray-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
        >
          <Reply className="h-4 w-4 scale-x-[-1] scale-y-[-1]" />
          {incomingReplies.length} 回复
        </button>
      )}

      {/* 右侧：操作按钮 + 回复 */}
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-1">
          {isWinner && (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/40 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              已采纳
            </span>
          )}
          {canAward && (
            <button
              onClick={() => award(post.id)}
              className="flex cursor-pointer items-center justify-center rounded-full px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:text-amber-400 dark:hover:bg-neutral-800"
              title="采纳并发放悬赏"
            >
              采纳
            </button>
          )}
          {/* 点赞 */}
          <LikeButton
            type={post.isOp ? "topic" : "post"}
            targetId={post.isOp && topicId ? topicId : post.id}
            initialLiked={post.isLiked}
            initialCount={post.likes}
          />

          {canEdit && (
            <button
              onClick={onEdit}
              className={`flex cursor-pointer items-center justify-center rounded-full p-2 text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              title="编辑"
            >
              <Pencil className="h-5 w-5" />
            </button>
          )}

          <button
            className={`flex cursor-pointer items-center justify-center rounded-full p-2 text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
            title="分享链接"
          >
            <LinkIcon className="h-5 w-5" />
          </button>

          {/* 收藏 (仅对主题帖显示，或话题全局显示) */}
          {post.isOp && topicId && (
            <BookmarkButton
              topicId={topicId}
              initialBookmarked={false} // 需要从话题数据获取，暂时传 false
              iconOnly
            />
          )}

          {/* 举报 */}
          <ReportDialog
            targetType={post.isOp ? "topic" : "post"}
            targetId={post.isOp && topicId ? topicId : post.id}
          />
        </div>

        {/* 帖子主回复按钮 */}
        <button
          onClick={handleReply}
          className={`flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
        >
          <Reply className="h-5 w-5" />
          <span>回复</span>
        </button>
      </div>
    </div>
  );
}
