import { useState } from "react";
import {
  ThumbsUp,
  Share2,
  Bookmark,
  Reply,
  Link as LinkIcon,
  Flag,
  User as UserIcon,
  Shield,
  Heart,
  Clock,
} from "lucide-react";
import { PostData } from "../types";
import { topicData } from "../constants"; // 引用全局数据
import { marked } from "marked";

interface PostProps {
  post: PostData;
  postIndex: number; // 1-based index in the posts array
  isLast: boolean;
  colors: any;
  topicTitle?: string;
  topicId?: string;
  incomingReplies?: PostData[];
}

export function Post({
  post,
  postIndex,
  isLast,
  colors,
  topicTitle,
  topicId,
  incomingReplies,
}: PostProps) {
  const isSmallAction = post.isSmallAction;
  const [isReplyExpanded, setIsReplyExpanded] = useState(false);
  const [areIncomingRepliesExpanded, setAreIncomingRepliesExpanded] = useState(false);

  if (isSmallAction) {
    return (
      <div className="flex items-center gap-3 py-4 pl-[60px] text-sm text-neutral-500">
        {post.id === "4" && <Clock className="h-4 w-4" />}
        {post.id === "5" && <Reply className="h-4 w-4" />}
        <span>{post.content}</span>
      </div>
    );
  }

  return (
    <div
      id={`post-${postIndex}`}
      data-post-index={postIndex}
      className={`flex gap-3 py-3 ${!isLast ? `border-b ${colors.dividerColor}` : ""} group`}
    >
      {/* Avatar Column */}
      <div className="flex w-12 shrink-0 flex-col items-center pt-1">
        <img
          src={post.avatar}
          alt={post.username}
          className={`h-[45px] w-[45px] cursor-pointer rounded-full border-2 object-cover shadow-sm hover:opacity-90 ${colors.avatarBorder}`}
        />
      </div>

      {/* Content Column */}
      <div className="min-w-0 flex-1 pl-3">
        {/* Post Meta Header */}
        <div className="mb-2 flex items-center gap-2 text-base">
          <span className={`cursor-pointer font-bold hover:underline ${colors.usernameColor}`}>
            {post.username}
          </span>
          <span className={`text-[#919191] dark:text-neutral-400`}>{post.name}</span>
          {post.role === "admin" && (
            <span
              title="Administrator"
              className="cursor-pointer text-[#919191] dark:text-neutral-400"
            >
              <Shield className="h-4 w-4" />
            </span>
          )}
          <div className="ml-auto flex items-center gap-3">
            {post.replyTo && (
              <button
                onClick={() => setIsReplyExpanded(!isReplyExpanded)}
                className="flex items-center gap-1.5 text-sm text-[#919191] transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                <Reply className="h-3.5 w-3.5 scale-x-[-1]" />
                {post.replyTo.avatar && (
                  <img src={post.replyTo.avatar} className="h-4 w-4 rounded-full" alt="" />
                )}
                <span className="font-medium">{post.replyTo.username}</span>
              </button>
            )}
            <span className="text-[#919191] dark:text-neutral-400">{post.createdAt}</span>
          </div>
        </div>

        {isReplyExpanded && post.replyTo?.content && (
          <div className="mt-2 mb-3 rounded-md border-l-4 border-amber-500 bg-neutral-50 p-3 text-sm text-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-300">
            <div className="mb-2 flex items-center gap-2 font-medium">
              <Reply className="h-3 w-3 scale-x-[-1] text-neutral-400" />
              <span>{post.replyTo.username}</span>
              <span className="text-xs text-neutral-400">#{post.replyTo.floor}</span>
            </div>
            <div
              className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-0"
              dangerouslySetInnerHTML={{ __html: marked.parse(post.replyTo.content) as string }}
            />
          </div>
        )}

        <div
          className={`prose dark:prose-invert max-w-none text-lg leading-normal ${colors.textPrimary} [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:shadow-md`}
          dangerouslySetInnerHTML={{ __html: marked.parse(post.content) as string }}
        />
        {/* Post Actions Footer */}
        <div className="mt-4 flex items-center justify-end gap-4 select-none">
          <div className="flex items-center gap-1">
            <button
              className={`flex cursor-pointer items-center gap-1.5 rounded-full p-2 text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              title="like this post"
            >
              <Heart className="h-5 w-5" />
              {post.likes > 0 && <span className="text-sm font-normal">{post.likes}</span>}
            </button>
            <button
              className={`flex cursor-pointer items-center justify-center rounded-full p-2 text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              title="share a link to this post"
            >
              <LinkIcon className="h-5 w-5" />
            </button>
            <button
              className={`flex cursor-pointer items-center justify-center rounded-full p-2 text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              title="bookmark this post"
            >
              <Bookmark className="h-5 w-5" />
            </button>
            <button
              className={`hidden cursor-pointer items-center justify-center rounded-full p-2 text-[#A6A6A6] group-hover:flex hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              title="flag this post"
            >
              <Flag className="h-5 w-5" />
            </button>
          </div>

          {/* Main Reply Button for Post - Moved to right */}
          <button
            onClick={() => {
              // Determine Topic ID (Prop drilling or Params)
              // For now, let's use a dynamic import to avoid circular heavy dependencies if possible
              // But grabbing ID from URL is safer for specific post reply
              import("../../../components/Composer/ComposerStore").then(({ useComposerStore }) => {
                useComposerStore.getState().open("REPLY", {
                  replyToPostId: post.id,
                  replyToTitle: topicTitle,
                  replyToTopicId: topicId,
                });
              });
            }}
            className={`flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
          >
            <Reply className="h-5 w-5" />
            <span>Reply</span>
          </button>
        </div>

        {/* Incoming Replies (Bottom) */}
        {incomingReplies && incomingReplies.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setAreIncomingRepliesExpanded(!areIncomingRepliesExpanded)}
              className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-semibold text-[#A6A6A6] transition-colors hover:bg-neutral-200 hover:text-gray-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
            >
              <Reply className="h-4 w-4 scale-x-[-1] scale-y-[-1]" />
              {incomingReplies.length} Replies
            </button>

            {areIncomingRepliesExpanded && (
              <div className="mt-3 space-y-3 pl-4">
                {incomingReplies.map((reply) => (
                  <div
                    key={reply.id}
                    className="flex gap-3 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/30"
                  >
                    <img
                      src={reply.avatar}
                      alt={reply.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2 text-sm">
                        <span className={`font-bold ${colors.usernameColor}`}>
                          {reply.username}
                        </span>
                        <span className="text-xs text-neutral-500">{reply.createdAt}</span>
                      </div>
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-0"
                        dangerouslySetInnerHTML={{ __html: marked.parse(reply.content) as string }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
