import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ArrowUpRight, MessageSquareQuote, Loader2 } from "lucide-react";
import { marked } from "marked";
import { cn } from "@/components/ui/utils";
import { ForumsPostsService } from "@/api/services/ForumsPostsService";
import { scrollToPost } from "../utils/domUtils";

export interface QuoteData {
  topicId?: string;
  postId?: string;
  floor?: number;
  username: string;
  avatar?: string;
  content: string;
  topicTitle?: string;
  isCrossTopic?: boolean;
}

interface QuoteBlockProps {
  quote: QuoteData;
  onNavigate?: (topicId: string, postId?: string) => void;
  colors?: any;
}

/**
 * 可展开/折叠的引用块组件
 * 逻辑：
 * 1. 未展开：显示完整的引用片段（保留样式和换行）
 * 2. 展开：请求并显示原帖完整内容
 */
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

export function QuoteBlock({ quote, onNavigate, colors }: QuoteBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullPostContent, setFullPostContent] = useState<string | null>(null);

  // 本地引用的 HTML (始终会被渲染，除非完全展开且已加载)
  const localQuoteHtml = useMemo(() => {
    return marked.parse(quote.content) as string;
  }, [quote.content]);

  // 远程完整内容的 HTML
  const remoteFullHtml = useMemo(() => {
    if (!fullPostContent) return null;
    return marked.parse(fullPostContent) as string;
  }, [fullPostContent]);

  const handleExpand = async () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    setIsExpanded(true);

    // 如果还没有加载过完整内容，且有 postId，则去请求
    if (!fullPostContent && quote.postId) {
      setIsLoading(true);
      try {
        const { data: post } = await ForumsPostsService.postsControllerFindOne({
          id: quote.postId,
        });
        if (post && post.content) {
          setFullPostContent(post.content);
        }
      } catch (error) {
        console.error("Failed to load full post:", error);
        // 加载失败可以显示一个错误提示或者保持原样
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNavigate = () => {
    if (quote.isCrossTopic && quote.topicId) {
      // 跨话题：导航到其他话题
      onNavigate?.(quote.topicId, quote.postId);
    } else if (quote.floor) {
      // 同话题：滚动到对应楼层 (通过楼层号)
      const postElement = document.getElementById(`post-${quote.floor}`);
      if (postElement) {
        postElement.scrollIntoView({ behavior: "smooth", block: "center" });
        // 高亮效果
        postElement.classList.add("ring-2", "ring-amber-400");
        setTimeout(() => {
          postElement.classList.remove("ring-2", "ring-amber-400");
        }, 2000);
      }
    } else if (quote.postId) {
      // 同话题：通过 postId 跳转
      scrollToPost(quote.postId);
    }
  };

  // 是否可以展开（必须有 postId 才能请求）
  const canExpand = !!quote.postId;

  return (
    <div
      className={cn(
        "my-2 rounded-md border-l-4 bg-neutral-50 transition-all dark:bg-[#3d3d3d]",
        quote.isCrossTopic ? "border-blue-500" : "border-neutral-400 dark:border-neutral-600",
      )}
    >
      {/* Quote Header */}
      <div className="flex items-center gap-2 bg-neutral-100/50 px-3 py-2 dark:bg-transparent">
        {/* 展开/折叠按钮 */}
        {canExpand && (
          <button
            onClick={handleExpand}
            className="flex items-center gap-1.5 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
            title={isExpanded ? "收起" : "显示完整回复"}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}

        {/* 引用图标或头像 */}
        {quote.isCrossTopic ? (
          <MessageSquareQuote className="h-4 w-4 text-blue-500" />
        ) : quote.avatar ? (
          <img
            src={quote.avatar}
            alt={quote.username}
            className="h-5 w-5 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: getAvatarColor(quote.username) }}
          >
            {quote.username.charAt(0).toUpperCase()}
          </div>
        )}

        {/* 跨话题标题 or 用户名 */}
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          {quote.isCrossTopic && quote.topicTitle ? (
            <button
              onClick={handleNavigate}
              className="truncate text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {quote.topicTitle}
            </button>
          ) : (
            <span className="truncate text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {quote.username}
              {quote.floor && <span className="ml-1 text-xs text-neutral-500">#{quote.floor}</span>}
            </span>
          )}
        </div>

        {/* 跳转按钮 */}
        <button
          onClick={handleNavigate}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
          title={quote.isCrossTopic ? "跳转到原话题" : "跳转到原帖"}
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Quote Content */}
      <div className="px-3 pt-2 pb-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-4 text-neutral-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm">正在加载原帖...</span>
          </div>
        ) : isExpanded && remoteFullHtml ? (
          // 展开状态：显示远程完整内容
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 [&>p]:mb-2"
              dangerouslySetInnerHTML={{ __html: remoteFullHtml }}
            />
            <div className="mt-2 border-t pt-1 text-center">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs text-neutral-400 hover:text-neutral-600"
              >
                收起
              </button>
            </div>
          </div>
        ) : (
          // 未展开状态（默认）：显示本地引用片段（保留样式）
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-400 [&>p]:mb-1 [&>p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: localQuoteHtml }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * 从 Markdown 内容中解析引用块
 * 支持格式: > **@username**: content
 */
export function parseQuotesFromMarkdown(markdown: string): QuoteData[] {
  const quotes: QuoteData[] = [];

  // 匹配格式: > **@username**: content 或 > **username**: content
  const quoteRegex = /^>\s*\*\*@?([^*]+)\*\*:?\s*(.+)$/gm;
  let match;

  while ((match = quoteRegex.exec(markdown)) !== null) {
    const username = match[1].trim();
    const content = match[2].trim();

    // 尝试解析楼层号 (如果有的话)
    const floorMatch = username.match(/(.+)\s*#(\d+)/);

    quotes.push({
      username: floorMatch ? floorMatch[1].trim() : username,
      floor: floorMatch ? parseInt(floorMatch[2], 10) : undefined,
      content,
      isCrossTopic: false,
    });
  }

  return quotes;
}
