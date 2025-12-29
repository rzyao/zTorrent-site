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
          className="h-[45px] w-[45px] cursor-pointer rounded-full object-cover shadow-sm hover:opacity-90"
        />
      </div>

      {/* Content Column */}
      <div className="min-w-0 flex-1 pl-3">
        {/* Post Meta Header */}
        <div className="mb-2 flex items-center gap-2 text-base">
          <span
            className={`cursor-pointer font-bold text-[#222] hover:underline dark:text-neutral-100`}
          >
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

        {/* Topic Map (Only for OP) */}
        {post.isOp && post.stats && (
          <div className="mt-8 mb-6 border border-t border-[#e9e9e9] bg-transparent select-none lg:max-w-3xl dark:border-neutral-700 dark:bg-neutral-900/50">
            <div className="grid grid-cols-3 border-b border-[#e9e9e9] text-center sm:grid-cols-6 dark:border-neutral-700">
              <div className="flex flex-col py-3">
                <span className="text-[11px] font-bold text-[#919191]">Created</span>
                <span className="mt-1 text-lg font-normal text-[#222] dark:text-neutral-200">
                  {post.stats.created}
                </span>
              </div>
              <div className="flex flex-col border-l border-[#e9e9e9] py-3 dark:border-neutral-700">
                <span className="text-[11px] font-bold text-[#919191]">Last Reply</span>
                <span className="mt-1 text-lg font-normal text-[#222] dark:text-neutral-200">
                  {post.stats.lastReply}
                </span>
              </div>
              <div className="flex flex-col border-l border-[#e9e9e9] py-3 dark:border-neutral-700">
                <span className="text-[11px] font-bold text-[#919191]">Replies</span>
                <span className="mt-1 text-lg font-normal text-[#222] dark:text-neutral-200">
                  {post.stats.replies}
                </span>
              </div>
              <div className="flex flex-col border-l border-[#e9e9e9] py-3 dark:border-neutral-700">
                <span className="text-[11px] font-bold text-[#919191]">Views</span>
                <span className="mt-1 text-lg font-normal text-[#222] dark:text-neutral-200">
                  {post.stats.views}
                </span>
              </div>
              <div className="flex flex-col border-l border-[#e9e9e9] py-3 dark:border-neutral-700">
                <span className="text-[11px] font-bold text-[#919191]">Users</span>
                <span className="mt-1 text-lg font-normal text-[#222] dark:text-neutral-200">
                  {post.stats.users}
                </span>
              </div>
              <div className="flex flex-col border-l border-[#e9e9e9] py-3 dark:border-neutral-700">
                <span className="text-[11px] font-bold text-[#919191]">Likes</span>
                <span className="mt-1 text-lg font-normal text-[#222] dark:text-neutral-200">
                  {post.stats.likes}
                </span>
              </div>
            </div>
            {/* Map Footer (Top Participants) */}
            <div className={`flex items-center gap-3 p-3 text-[11px] font-bold text-[#919191]`}>
              <span className="tracking-wide">Frequent Posters</span>
              <div className="flex -space-x-1.5">
                {topicData.participants.map((p) => (
                  <img
                    key={p.username}
                    src={p.avatar}
                    alt={p.username}
                    className="h-6 w-6 rounded-full border-2 border-white dark:border-neutral-800"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Post Actions Footer */}
        <div className="mt-4 flex items-center justify-end gap-4 select-none">
          <div className="flex items-center gap-1">
            <button
              className={`flex items-center gap-1.5 rounded p-2 text-[#A6A6A6] transition-all hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              title="like this post"
            >
              <Heart className="h-5 w-5" />
              {post.likes > 0 && <span className="text-sm font-normal">{post.likes}</span>}
            </button>
            <button
              className={`flex items-center justify-center rounded p-2 text-[#A6A6A6] transition-all hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              title="share a link to this post"
            >
              <LinkIcon className="h-5 w-5" />
            </button>
            <button
              className={`flex items-center justify-center rounded p-2 text-[#A6A6A6] transition-all hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              title="bookmark this post"
            >
              <Bookmark className="h-5 w-5" />
            </button>
            <button
              className={`hidden items-center justify-center rounded p-2 text-[#A6A6A6] transition-all group-hover:flex hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              title="flag this post"
            >
              <Flag className="h-5 w-5" />
            </button>
          </div>

          {/* Main Reply Button for Post - Moved to right */}
          <button
            className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold text-[#A6A6A6] transition-all hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
          >
            <Reply className="h-5 w-5" />
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
