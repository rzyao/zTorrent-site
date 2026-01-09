import { Reply, ArrowUp } from "lucide-react";
import { marked } from "marked";
import { scrollToPost } from "../.@/utils/cn/domUtils";

interface ReplyToData {
  id: string;
  floor: number;
  username: string;
  avatar?: string;
  content?: string;
}

// 简单的颜色生成逻辑，模拟 Discourse 风格
const DISCOURSE_COLORS = [
  "#d32f2f",
  "#c2185b",
  "#7b1fa2",
  "#512da8",
  "#303f9f",
  "#1976d2",
  "#0288d1",
  "#0097a7",
  "#00796b",
  "#388e3c",
  "#689f38",
  "#afb42b",
  "#fbc02d",
  "#ffa000",
  "#f57c00",
  "#e64a19",
  "#5d4037",
  "#616161",
  "#455a64",
];

function getAvatarColor(username: string) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DISCOURSE_COLORS.length;
  return DISCOURSE_COLORS[index];
}

interface PostReplyContextProps {
  replyTo: ReplyToData;
  colors: any;
}

export function PostReplyContext({ replyTo, colors }: PostReplyContextProps) {
  if (!replyTo.content) return null;

  return (
    <div className="relative mt-3 mb-1 flex gap-3">
      {/* 连接线 - 连接父楼层头像和本楼层头像 */}
      <div className="absolute top-[49px] -bottom-5 left-6 w-0.5 -translate-x-1/2 bg-gray-200 dark:bg-neutral-700" />

      {/* 头像 */}
      <div className="relative z-10 flex w-12 shrink-0 flex-col items-center pt-1">
        {replyTo.avatar ? (
          <img
            src={replyTo.avatar}
            className={`h-[45px] w-[45px] cursor-pointer rounded-full border-2 bg-white object-cover shadow-sm hover:opacity-90 dark:bg-neutral-800 ${colors.avatarBorder}`}
            alt={replyTo.username}
          />
        ) : (
          <div
            className={`flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded-full border-2 text-xl font-bold text-white shadow-sm hover:opacity-90 ${colors.avatarBorder}`}
            style={{ backgroundColor: getAvatarColor(replyTo.username) }}
          >
            {replyTo.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* 右侧内容列 */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 border-b border-neutral-200 pb-5 pl-3 dark:border-neutral-700">
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
  );
}
