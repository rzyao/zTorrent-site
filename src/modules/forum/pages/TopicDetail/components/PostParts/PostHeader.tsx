import { Reply, Shield } from "lucide-react";
import { PostData } from "../../types";
import { ForumImage } from "@/modules/forum/components/ui/image";

interface PostHeaderProps {
  post: PostData;
  colors: any;
  isReplyExpanded: boolean;
  onToggleReply: () => void;
}

export function PostHeader({ post, colors, isReplyExpanded, onToggleReply }: PostHeaderProps) {
  return (
    <div className="mb-2 flex items-center gap-2 text-base">
      <span className={`cursor-pointer font-bold hover:underline ${colors.usernameColor}`}>
        {post.username}
      </span>
      <span className={`text-[#919191] dark:text-neutral-400`}>{post.name}</span>
      {post.role === "admin" && (
        <span title="Administrator" className="cursor-pointer text-[#919191] dark:text-neutral-400">
          <Shield className="h-4 w-4" />
        </span>
      )}
      <div className="ml-auto flex items-center gap-3">
        {/* 回复上下文（显示所回复的父楼层信息） */}
        {post.replyTo && (
          <button
            onClick={onToggleReply}
            className="flex items-center gap-1.5 text-sm text-[#919191] transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <Reply className="h-3.5 w-3.5 scale-x-[-1]" />
            {post.replyTo.avatar && (
              <ForumImage src={post.replyTo.avatar} className="h-4 w-4 rounded-full" alt="" />
            )}
            <span className="font-medium">{post.replyTo.username}</span>
          </button>
        )}
        <span className="text-[#919191] dark:text-neutral-400">{post.createdAt}</span>
      </div>
    </div>
  );
}
