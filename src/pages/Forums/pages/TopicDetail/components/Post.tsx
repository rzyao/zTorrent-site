import { useState, useMemo, useCallback, memo, Fragment } from "react";
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
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { PostData } from "../types";
import { topicData } from "../constants"; // 引用全局数据
import { marked } from "marked";
import { SelectionPopover } from "./SelectionPopover";
import { useComposerStore } from "../../../components/Composer/ComposerStore";
import { QuoteBlock, QuoteData } from "./QuoteBlock";

/**
 * 解析 HTML 中的 blockquote，提取引用信息
 * 返回分段内容：普通 HTML 和引用块交替
 */
interface ContentSegment {
  type: "html" | "quote";
  content: string;
  quoteData?: QuoteData;
}

// BBCode [quote] 解析器
function processBBCodeQuotes(text: string): string {
  // 正则匹配 [quote="username, post:x, topic:y"]content[/quote]
  // 同时支持 [quote=username]
  return text.replace(
    /\[quote="?([^",]+)(?:,\s*post:([^",]+))?(?:,\s*topic:([^",\]]+))?"?\]([\s\S]*?)\[\/quote\]/gi,
    (match, username, postId, topicId, content) => {
      const dataAttrs = [
        `data-username="${username.trim()}"`,
        postId ? `data-post-id="${postId.trim()}"` : "",
        topicId ? `data-topic-id="${topicId.trim()}"` : "",
      ]
        .filter(Boolean)
        .join(" ");

      // 确保内容后续作为 Markdown 处理，但包裹在 HTML 中
      // 我们使用 parseContentWithQuotes 可识别的特定结构
      return `<blockquote ${dataAttrs}><p><strong>${username.trim()}:</strong></p>\n${content}\n</blockquote>`;
    },
  );
}

function parseContentWithQuotes(html: string): ContentSegment[] {
  const segments: ContentSegment[] = [];

  // 匹配 blockquote 标签
  // 格式: <blockquote ...options>...</blockquote>
  const blockquoteRegex = /<blockquote([^>]*)>([\s\S]*?)<\/blockquote>/gi;

  let lastIndex = 0;
  let match;

  while ((match = blockquoteRegex.exec(html)) !== null) {
    // 添加 blockquote 之前的 HTML
    if (match.index > lastIndex) {
      segments.push({
        type: "html",
        content: html.substring(lastIndex, match.index),
      });
    }

    const attrs = match[1];
    const blockquoteContent = match[2];

    // 从属性中提取元数据
    const topicIdMatch = attrs.match(/data-topic-id="([^"]+)"/);
    const postIdMatch = attrs.match(/data-post-id="([^"]+)"/);
    const usernameAttrMatch = attrs.match(/data-username="([^"]+)"/);

    let username = usernameAttrMatch ? usernameAttrMatch[1] : "";
    let content = blockquoteContent;

    // 如果没有属性元数据（旧格式），尝试从内容解析
    if (!username) {
      let usernameMatch = blockquoteContent.match(
        /<p>\s*<strong>@?([^<]+)<\/strong>:?\s*([\s\S]*)/i,
      );
      if (!usernameMatch) {
        usernameMatch = blockquoteContent.match(/<p>\s*@?([^:<]+):\s*<\/p>([\s\S]*)/i);
      }
      if (usernameMatch) {
        username = usernameMatch[1].trim();
        content = usernameMatch[2];
      }
    } else {
      // 如果是从 BBCode 转换来的，内容可能包含 <p><strong>username:</strong></p>，需要移除
      content = content.replace(/<p>\s*<strong>[^<]+<\/strong>:?\s*<\/p>/i, "");
    }

    if (username) {
      // 清理 content 中的 HTML 标签，保留换行结构
      content = content
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<p[^>]*>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .trim();

      // 尝试解析楼层号 (格式: username #floor)
      // 只有在没有 postId 时才依赖这个作为 fallback
      const floorMatch = username.match(/(.+)\s*#(\d+)/);

      segments.push({
        type: "quote",
        content: match[0], // 原始 HTML 作为 fallback
        quoteData: {
          username: floorMatch ? floorMatch[1].trim() : username,
          floor: floorMatch ? parseInt(floorMatch[2], 10) : undefined,
          postId: postIdMatch ? postIdMatch[1] : undefined,
          topicId: topicIdMatch ? topicIdMatch[1] : undefined,
          content: content,
          isCrossTopic: !!((topicIdMatch && topicIdMatch[1]) || (postIdMatch && postIdMatch[1])),
        },
      });
    } else {
      // 无法解析，作为普通 blockquote 渲染
      segments.push({
        type: "html",
        content: match[0],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // 添加剩余内容
  if (lastIndex < html.length) {
    segments.push({
      type: "html",
      content: html.substring(lastIndex),
    });
  }

  return segments;
}

// 使用 memo 优化 PostContent，防止重渲染导致文本选择丢失
const PostContent = memo(
  ({
    content,
    className,
    onMouseUp,
    colors,
  }: {
    content: string;
    className: string;
    onMouseUp: () => void;
    colors?: any;
  }) => {
    // 1. 将 BBCode [quote] 转换为 HTML <blockquote>
    // 2. 将 Markdown 解析为 HTML
    const html = useMemo(() => {
      const processed = processBBCodeQuotes(content);
      return marked.parse(processed) as string;
    }, [content]);

    const segments = useMemo(() => parseContentWithQuotes(html), [html]);

    // 处理跳转到原帖
    const handleQuoteNavigate = useCallback((topicId: string, postId?: string) => {
      // 跨话题跳转
      window.location.href = `/forum/topic/${topicId}${postId ? `#post-${postId}` : ""}`;
    }, []);

    return (
      <div className={className} onMouseUp={onMouseUp}>
        {segments.map((segment, index) => (
          <Fragment key={index}>
            {segment.type === "quote" && segment.quoteData ? (
              <QuoteBlock
                quote={segment.quoteData}
                onNavigate={handleQuoteNavigate}
                colors={colors}
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: segment.content }} />
            )}
          </Fragment>
        ))}
      </div>
    );
  },
);
PostContent.displayName = "PostContent";

interface PostProps {
  post: PostData;
  postIndex: number; // 从 1 开始的帖子索引
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

  // 文本选择浮层状态
  const [selectionMenu, setSelectionMenu] = useState<{ x: number; y: number; text: string } | null>(
    null,
  );

  const handleScrollToPost = (targetId: string) => {
    // 尝试直接通过 ID 获取元素（适用于已使用 post.id 作为 ID 的情况）
    // 但 Post 组件的 DOM id 是 `post-${postIndex}`，而这里我们拿到的可能是数据库 ID
    // TODO: 最好统一使用 `post-${id}` 或 `post-floor-${floor}`。
    // 假设 Post 组件已被 key=post.id 渲染，我们需要找到对应的 DOM 节点。

    // 纠正：我们需要找到带有 data-post-db-id="${targetId}" 的元素。
    // 我们已经在 Post 组件渲染时添加了这个属性。

    const targetElement = document.querySelector(`[data-post-db-id="${targetId}"]`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      targetElement.classList.add("ring-2", "ring-blue-500", "transition-all", "duration-500");
      setTimeout(() => {
        targetElement.classList.remove("ring-2", "ring-blue-500");
      }, 2000);
    } else {
      // 以后可以处理未加载的情况
      console.warn(`Post ${targetId} not found in current view.`);
      // 备选方案：如果页面本来就支持 #post-ID 的锚点，可以尝试修改 URL？
      // window.location.hash = `#post-${targetId}`;
    }
  };

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectionMenu(null);
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setSelectionMenu(null);
      return;
    }

    // 确保选区在当前帖子内
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // 显示菜单
    setSelectionMenu({
      x: rect.left + rect.width / 2,
      y: rect.top, // 固定定位使用视口坐标
      text,
    });
  }, []);

  const handleQuote = () => {
    if (!selectionMenu) return;

    const composer = useComposerStore.getState();
    const replyContextTitle = topicTitle
      ? `${topicTitle} (回复 #${postIndex} ${post.username})`
      : undefined;

    // 根据编辑器模式生成不同的引用格式
    let quoteContent: string;

    if (composer.isRichText) {
      // 富文本模式：使用 HTML blockquote，携带完整元数据
      const escapedText = selectionMenu.text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");

      const topicIdAttr = topicId ? `data-topic-id="${topicId}"` : "";
      const postIdAttr = post.id ? `data-post-id="${post.id}"` : "";

      quoteContent = `<blockquote 
        ${topicIdAttr}
        ${postIdAttr}
        data-username="${post.username}"
      ><p><strong>${post.username}:</strong></p><p>${escapedText}</p></blockquote><p></p>`;
    } else {
      // Markdown 模式：使用 [quote] 标签，携带完整元数据
      // 格式: [quote="username, post:postId, topic:topicId"]content[/quote]
      const parts = [`"${post.username}`];
      if (post.id && String(post.id).trim() !== "") parts.push(`post:${post.id}`);
      if (topicId && String(topicId).trim() !== "") parts.push(`topic:${topicId}`);

      const meta = parts.join(", ") + '"';

      quoteContent = `[quote=${meta}]\n${selectionMenu.text}\n[/quote]\n\n`;
    }

    // 创建引用信息
    const quoteInfo = {
      postId: post.id,
      username: post.username,
      floor: postIndex,
      content: selectionMenu.text,
    };

    if (!composer.isOpen) {
      composer.open("REPLY", {
        replyToPostId: post.id,
        replyToTitle: replyContextTitle,
        replyToTopicId: topicId,
        body: quoteContent,
        quotes: [quoteInfo],
        selectedQuoteIndex: 0,
      });
    } else {
      composer.appendContent(quoteContent);
      // 添加引用到列表
      composer.addQuote(quoteInfo);
      composer.updateDraft({
        replyToTitle: replyContextTitle,
      });
    }

    // 清除选区
    setSelectionMenu(null);
    window.getSelection()?.removeAllRanges();
  };

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
    <>
      {/* 展开的回复引用内容 */}
      {isReplyExpanded && post.replyTo?.content && (
        <div className="mb-3 flex flex-col gap-2 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/30">
          <div className="mb-1 flex items-center gap-2 text-xs text-neutral-400">
            <Reply className="h-3 w-3 scale-x-[-1]" />
            <span>回复楼层</span>
          </div>
          <div className="flex gap-3">
            {/* 头像 */}
            {post.replyTo.avatar && (
              <div className="mt-1 shrink-0">
                <img
                  src={post.replyTo.avatar}
                  className="h-8 w-8 rounded-full object-cover"
                  alt=""
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              {/* 用户信息头部 */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className={`font-bold ${colors.usernameColor}`}>
                    {post.replyTo.username}
                  </span>
                  <span className="text-xs text-neutral-500">#{post.replyTo.floor}</span>
                </div>
              </div>

              {/* 内容 */}
              <div
                className="prose prose-sm dark:prose-invert line-clamp-3 max-w-none text-neutral-600 dark:text-neutral-300 [&>p]:mb-0"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(post.replyTo.content) as string,
                }}
              />
            </div>
          </div>

          {/* 跳转到帖子按钮 */}
          {post.replyTo.id && (
            <button
              onClick={() => handleScrollToPost(post.replyTo!.id)}
              className="ml-11 flex w-fit items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-blue-500"
            >
              <ArrowUp className="h-3 w-3" />
              <span>跳到帖子</span>
            </button>
          )}
        </div>
      )}
      <div
        id={`post-${postIndex}`}
        data-post-index={postIndex}
        data-post-db-id={post.id}
        className={`flex gap-3 py-3 ${!isLast ? `border-b ${colors.dividerColor}` : ""} group`}
      >
        {/* 头像列 */}
        <div className="flex w-12 shrink-0 flex-col items-center pt-1">
          <img
            src={post.avatar}
            alt={post.username}
            className={`h-[45px] w-[45px] cursor-pointer rounded-full border-2 object-cover shadow-sm hover:opacity-90 ${colors.avatarBorder}`}
          />
        </div>

        {/* 内容列 */}
        <div className="min-w-0 flex-1 pl-3">
          {/* 帖子元数据头部 */}
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
              {/* 回复上下文（显示所回复的父楼层信息） */}
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

          {/* 帖子正文内容 (Markdown/HTML) */}
          <PostContent
            content={post.content}
            className={`prose dark:prose-invert max-w-none text-base leading-normal ${colors.textPrimary} [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:shadow-md`}
            onMouseUp={handleMouseUp}
            colors={colors}
          />

          {/* 文本选择浮层 */}
          {selectionMenu && (
            <SelectionPopover
              x={selectionMenu.x}
              y={selectionMenu.y}
              onQuote={handleQuote}
              onClose={() => setSelectionMenu(null)}
            />
          )}
          {/* 帖子操作底部栏 */}
          <div className="mt-4 flex items-center gap-4 select-none">
            {/* 左侧：查看回复按钮 */}
            {incomingReplies && incomingReplies.length > 0 && (
              <button
                onClick={() => setAreIncomingRepliesExpanded(!areIncomingRepliesExpanded)}
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
                onClick={() => {
                  // 确定话题 ID (通过 Props 传递或参数)
                  // 目前为了避免循环依赖，使用动态导入
                  // 但从 URL 获取 ID 对于特定帖子的回复更安全
                  import("../../../components/Composer/ComposerStore").then(
                    ({ useComposerStore }) => {
                      useComposerStore.getState().open("REPLY", {
                        replyToPostId: post.id,
                        replyToTitle: topicTitle,
                        replyToTopicId: topicId,
                      });
                    },
                  );
                }}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
              >
                <Reply className="h-5 w-5" />
                <span>回复</span>
              </button>
            </div>
          </div>

          {/* 楼中楼回复列表 (底部) */}
          {incomingReplies && incomingReplies.length > 0 && areIncomingRepliesExpanded && (
            <div className="mt-2 pl-4">
              <div className="mt-3 space-y-3">
                {incomingReplies.map((reply) => (
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
                          <span className={`font-bold ${colors.usernameColor}`}>
                            {reply.username}
                          </span>
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
                      onClick={() => handleScrollToPost(reply.id)}
                      className="ml-11 flex w-fit items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-blue-500"
                    >
                      <ArrowDown className="h-3 w-3" />
                      <span>跳到帖子</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
