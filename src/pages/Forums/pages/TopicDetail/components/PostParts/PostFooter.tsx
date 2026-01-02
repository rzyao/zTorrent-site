import { Heart, Link as LinkIcon, Bookmark, Flag, Reply } from "lucide-react";
import { PostData } from "../../types";
import { useComposerStore } from "../../../../components/Composer/ComposerStore";

interface PostFooterProps {
  post: PostData;
  incomingReplies?: PostData[];
  areIncomingRepliesExpanded: boolean;
  onToggleIncomingReplies: () => void;
  topicTitle?: string;
  topicId?: string;
}

export function PostFooter({
  post,
  incomingReplies,
  areIncomingRepliesExpanded,
  onToggleIncomingReplies,
  topicTitle,
  topicId,
}: PostFooterProps) {
  const handleReply = () => {
    useComposerStore.getState().open("REPLY", {
      replyToPostId: post.id,
      replyToTitle: topicTitle,
      replyToTopicId: topicId,
    });
  };

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
          <button
            className={`flex cursor-pointer items-center gap-1.5 rounded-full p-2 text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
            title="点赞"
          >
            <Heart className="h-5 w-5" />
            {post.likes > 0 && <span className="text-sm font-normal">{post.likes}</span>}
          </button>
          <button
            className={`flex cursor-pointer items-center justify-center rounded-full p-2 text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
            title="分享链接"
          >
            <LinkIcon className="h-5 w-5" />
          </button>
          <button
            className={`flex cursor-pointer items-center justify-center rounded-full p-2 text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
            title="收藏"
          >
            <Bookmark className="h-5 w-5" />
          </button>
          <button
            className={`hidden cursor-pointer items-center justify-center rounded-full p-2 text-[#A6A6A6] group-hover:flex hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
            title="举报"
          >
            <Flag className="h-5 w-5" />
          </button>
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
