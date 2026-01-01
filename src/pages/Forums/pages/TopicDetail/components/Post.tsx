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

function parseContentWithQuotes(html: string): ContentSegment[] {
  const segments: ContentSegment[] = [];

  // 匹配 blockquote 标签
  // 格式: <blockquote><p><strong>username</strong>:</p><p>content...</p></blockquote>
  // 或简单格式: <blockquote><p><strong>username</strong>: content</p></blockquote>
  const blockquoteRegex = /<blockquote>([\s\S]*?)<\/blockquote>/gi;

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

    const blockquoteContent = match[1];

    // 尝试解析用户名和内容
    // 格式1: <p><strong>username</strong>:</p><p>content</p> (旧格式)
    // 格式2: <p><strong>username</strong>: content</p> (旧格式)
    // 格式3: <p>username:</p><p></p><p>content</p> (新格式)
    // 格式4: <p>username:</p>... (新格式简化)
    let usernameMatch = blockquoteContent.match(/<p>\s*<strong>@?([^<]+)<\/strong>:?\s*([\s\S]*)/i);

    // 如果没匹配到 strong 格式，尝试匹配普通格式
    if (!usernameMatch) {
      usernameMatch = blockquoteContent.match(/<p>\s*@?([^:<]+):\s*<\/p>([\s\S]*)/i);
    }

    if (usernameMatch) {
      const username = usernameMatch[1].trim();
      let content = usernameMatch[2];

      // 清理 content 中的 HTML 标签
      content = content.replace(/<\/?p>/gi, " ").trim();

      // 尝试解析楼层号 (格式: username #floor)
      const floorMatch = username.match(/(.+)\s*#(\d+)/);

      segments.push({
        type: "quote",
        content: match[0], // 原始 HTML 作为 fallback
        quoteData: {
          username: floorMatch ? floorMatch[1].trim() : username,
          floor: floorMatch ? parseInt(floorMatch[2], 10) : undefined,
          content: content,
          isCrossTopic: false,
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

// Memoized PostContent to prevent re-renders losing text selection
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
    const html = useMemo(() => marked.parse(content) as string, [content]);
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

  // Selection Popover State
  const [selectionMenu, setSelectionMenu] = useState<{ x: number; y: number; text: string } | null>(
    null,
  );

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

    // Ensure selection is within this post
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Show menu
    setSelectionMenu({
      x: rect.left + rect.width / 2,
      y: rect.top, // Fixed positioning uses viewport coordinates
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
      // 富文本模式：使用 HTML blockquote
      // 第一段落只包含 "username:" 格式，用于识别这是外部引用
      const escapedText = selectionMenu.text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
      quoteContent = `<blockquote><p><strong>${post.username}:</strong></p><p>${escapedText}</p></blockquote><p></p>`;
    } else {
      // Markdown 模式：使用 [quote] 标签，参考 Discourse 格式
      // 格式: [quote="username, post:floor, topic:topicId"]content[/quote]
      quoteContent = `[quote="${post.username}, post:${postIndex}, topic:${topicId}"]\n${selectionMenu.text}\n[/quote]\n\n`;
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

    // Clear selection
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

        <PostContent
          content={post.content}
          className={`prose dark:prose-invert max-w-none text-lg leading-normal ${colors.textPrimary} [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:shadow-md`}
          onMouseUp={handleMouseUp}
          colors={colors}
        />

        {/* Selection Popover */}
        {selectionMenu && (
          <SelectionPopover
            x={selectionMenu.x}
            y={selectionMenu.y}
            onQuote={handleQuote}
            onClose={() => setSelectionMenu(null)}
          />
        )}
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
