import { Reply, Share2, Bookmark, Flag, ChevronDown } from "lucide-react";
import { TopicData } from "../types";

interface TopicFooterProps {
  topicData?: TopicData;
}

export const TopicFooter = ({ topicData }: TopicFooterProps) => {
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
      <div className="flex items-center gap-4 border-t border-[#e9e9e9] py-4 dark:border-neutral-700">
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

      {/* Topic Action Buttons */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded bg-[#0088CC] px-4 py-2 text-sm font-bold text-white transition-colors select-none hover:bg-[#006699]">
            <Reply className="h-4 w-4" />
            <span>Reply</span>
          </button>
          <button className="hidden items-center gap-2 rounded bg-neutral-200 px-3 py-2 text-sm font-medium text-[#222] transition-colors select-none hover:bg-neutral-300 sm:flex dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button className="hidden items-center gap-2 rounded bg-neutral-200 px-3 py-2 text-sm font-medium text-[#222] transition-colors select-none hover:bg-neutral-300 sm:flex dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
            <Bookmark className="h-4 w-4" />
            <span>Bookmark</span>
          </button>
          <button className="hidden items-center gap-2 rounded bg-neutral-200 px-3 py-2 text-sm font-medium text-[#222] transition-colors select-none hover:bg-neutral-300 sm:flex dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
            <Flag className="h-4 w-4" />
            <span>Flag</span>
          </button>
        </div>

        {/* Tracking Button */}
        <button className="flex items-center gap-2 rounded bg-neutral-200 px-3 py-2 text-sm font-medium text-[#222] transition-colors select-none hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
            <span>Tracking</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
