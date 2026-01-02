import { ArrowDown } from "lucide-react";
import { marked } from "marked";
import { PostData } from "../../types";
import { scrollToPost } from "../../utils/domUtils";

interface IncomingRepliesProps {
  replies?: PostData[];
  expanded: boolean;
  colors: any;
}

export function IncomingReplies({ replies, expanded, colors }: IncomingRepliesProps) {
  if (!replies || replies.length === 0 || !expanded) {
    return null;
  }

  return (
    <div className="mt-2 pl-4">
      <div className="mt-3 space-y-3">
        {replies.map((reply) => (
          <div
            key={reply.id}
            className="flex flex-col gap-2 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/30"
          >
            <div className="flex gap-3">
              <img
                src={reply.avatar}
                alt={reply.username}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2 text-sm">
                  <span className={`font-bold ${colors.usernameColor}`}>{reply.username}</span>
                  <span className="text-xs text-neutral-500">{reply.createdAt}</span>
                </div>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-0"
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(reply.content) as string,
                  }}
                />
              </div>
            </div>
            {/* 跳转到帖子按钮 */}
            <button
              onClick={() => scrollToPost(reply.id)}
              className="ml-11 flex w-fit items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-blue-500"
            >
              <ArrowDown className="h-3 w-3" />
              <span>跳到帖子</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
