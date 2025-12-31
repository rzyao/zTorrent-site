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

interface PostProps {
  post: PostData;
  postIndex: number; // 1-based index in the posts array
  isLast: boolean;
  theme: string;
  colors: any;
}

export function Post({ post, postIndex, isLast, theme, colors }: PostProps) {
  const isSmallAction = post.isSmallAction;

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
          <div className="ml-auto flex items-center text-[#919191] dark:text-neutral-400">
            <span className="cursor-pointer hover:text-[#222] hover:underline dark:hover:text-neutral-200">
              {post.createdAt}
            </span>
          </div>
        </div>

        {/* Post Content */}
        <div
          className={`prose max-w-none text-lg leading-normal ${theme === "dark" ? "prose-invert" : ""} ${colors.textPrimary}`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Post Actions Footer */}
        <div className="mt-4 flex items-center justify-end gap-4 select-none">
          <div className="flex items-center gap-1">
            <button
              className={`flex cursor-pointer items-center gap-1.5 rounded-full p-2 text-[#A6A6A6] transition-all hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              title="like this post"
            >
              <Heart className="h-5 w-5" />
              {post.likes > 0 && <span className="text-sm font-normal">{post.likes}</span>}
            </button>
            <button
              className={`flex cursor-pointer items-center justify-center rounded-full p-2 text-[#A6A6A6] transition-all hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              title="share a link to this post"
            >
              <LinkIcon className="h-5 w-5" />
            </button>
            <button
              className={`flex cursor-pointer items-center justify-center rounded-full p-2 text-[#A6A6A6] transition-all hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              title="bookmark this post"
            >
              <Bookmark className="h-5 w-5" />
            </button>
            <button
              className={`hidden cursor-pointer items-center justify-center rounded-full p-2 text-[#A6A6A6] transition-all group-hover:flex hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
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
                  // We might need to fetch topicId from context or url if not passed
                });
              });
            }}
            className={`flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#A6A6A6] transition-all hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
          >
            <Reply className="h-5 w-5" />
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
