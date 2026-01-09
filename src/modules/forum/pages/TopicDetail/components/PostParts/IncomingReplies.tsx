import { ArrowDown, ChevronUp } from "lucide-react";
import { marked } from "marked";
import { PostData } from "../../types";
import { scrollToPost } from "../../utils/domUtils";

interface IncomingRepliesProps {
  replies?: PostData[];
  expanded: boolean;
  colors: any;
  onCollapse?: () => void;
}

export function IncomingReplies({ replies, expanded, colors, onCollapse }: IncomingRepliesProps) {
  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
        expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <div className="relative mt-2 border-t border-gray-100 pt-4 pl-4 dark:border-neutral-800">
          {/* 连接线 - 贯穿所有回复的头像 */}
          <div className="absolute top-4 bottom-12 left-[32px] w-0.5 -translate-x-1/2 bg-gray-200 dark:bg-neutral-700" />

          <div className="mt-3 space-y-3">
            {replies.map((reply) => (
              <div key={reply.id} className="relative z-10 flex gap-3">
                {/* 头像列 */}
                <div className="flex shrink-0 flex-col items-center">
                  <img
                    src={reply.avatar}
                    alt={reply.username}
                    className="relative z-10 h-8 w-8 rounded-full bg-white object-cover dark:bg-neutral-800"
                  />
                </div>

                {/* 内容列 */}
                <div className="flex min-w-0 flex-1 flex-col gap-2 border-b border-gray-100 pb-3 dark:border-neutral-800">
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
                  {/* 跳转到帖子按钮 */}
                  <button
                    onClick={() => scrollToPost(reply.id)}
                    className="flex w-fit items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-blue-500"
                  >
                    <ArrowDown className="h-3 w-3" />
                    <span>跳到帖子</span>
                  </button>
                </div>
              </div>
            ))}

            {/* 收起按钮 */}
            {onCollapse && (
              <button
                onClick={onCollapse}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-100 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                <ChevronUp className="h-4 w-4" />
                <span>收起</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
