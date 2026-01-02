import { Reply, ArrowUp } from "lucide-react";
import { marked } from "marked";
import { scrollToPost } from "../../utils/domUtils";

interface ReplyToData {
  id: string;
  floor: number;
  username: string;
  avatar?: string;
  content?: string;
}

interface PostReplyContextProps {
  replyTo: ReplyToData;
  colors: any;
}

export function PostReplyContext({ replyTo, colors }: PostReplyContextProps) {
  if (!replyTo.content) return null;

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700">
      <div className="relative my-3 flex gap-3 rounded-lg bg-neutral-50 py-3 dark:bg-neutral-800/30">
        {/* 连接线 - 连接父楼层头像和本楼层头像 */}
        <div className="absolute top-[65px] -bottom-6.5 left-6 w-0.5 -translate-x-1/2 bg-gray-200 dark:bg-neutral-700" />

        {/* 头像 */}
        {replyTo.avatar && (
          <div className="relative z-10 flex w-12 shrink-0 flex-col items-center pt-1">
            <img
              src={replyTo.avatar}
              className={`h-[45px] w-[45px] cursor-pointer rounded-full border-2 object-cover shadow-sm hover:opacity-90 ${colors.avatarBorder}`}
              alt=""
            />
          </div>
        )}

        {/* 右侧内容列 */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div>
            {/* 用户信息头部 */}
            <div className="mb-2 flex items-center gap-5">
              <div className="flex items-center gap-2 text-sm">
                <span className={`font-bold ${colors.usernameColor}`}>{replyTo.username}</span>
                <span className="text-xs text-neutral-500">#{replyTo.floor}</span>
              </div>

              {/* 跳转到帖子按钮 */}
              {replyTo.id && (
                <button
                  onClick={() => scrollToPost(replyTo!.id)}
                  className="flex cursor-pointer items-center gap-1 text-xs text-neutral-600 transition-colors hover:text-blue-500"
                  title="跳到帖子"
                >
                  <ArrowUp className="h-3 w-3" />
                  <span className="hidden sm:inline">跳到该帖子</span>
                </button>
              )}
            </div>

            {/* 内容 */}
            <div
              className="prose prose-sm dark:prose-invert line-clamp-3 max-w-none text-neutral-600 dark:text-neutral-300 [&>p]:mb-0"
              dangerouslySetInnerHTML={{
                __html: marked.parse(replyTo.content) as string,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
