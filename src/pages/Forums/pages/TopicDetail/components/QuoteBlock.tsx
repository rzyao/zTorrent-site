import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ArrowUpRight, MessageSquareQuote } from "lucide-react";
import { marked } from "marked";
import { cn } from "@/components/ui/utils";

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
 * 支持同话题和跨话题引用
 */
export function QuoteBlock({ quote, onNavigate, colors }: QuoteBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 截取预览内容（折叠时显示）
  const previewContent = useMemo(() => {
    const plainText = quote.content.replace(/[#*`>]/g, "").trim();
    return plainText.length > 100 ? plainText.substring(0, 100) + "..." : plainText;
  }, [quote.content]);

  // 完整内容 HTML
  const fullContentHtml = useMemo(() => {
    return marked.parse(quote.content) as string;
  }, [quote.content]);

  const handleNavigate = () => {
    if (quote.isCrossTopic && quote.topicId) {
      // 跨话题：导航到其他话题
      onNavigate?.(quote.topicId, quote.postId);
    } else if (quote.floor) {
      // 同话题：滚动到对应楼层
      const postElement = document.getElementById(`post-${quote.floor}`);
      if (postElement) {
        postElement.scrollIntoView({ behavior: "smooth", block: "center" });
        // 高亮效果
        postElement.classList.add("ring-2", "ring-amber-400");
        setTimeout(() => {
          postElement.classList.remove("ring-2", "ring-amber-400");
        }, 2000);
      }
    }
  };

  return (
    <div
      className={cn(
        "my-2 rounded-md border-l-4 bg-neutral-50 transition-all dark:bg-neutral-800/50",
        quote.isCrossTopic ? "border-blue-500" : "border-neutral-400 dark:border-neutral-600",
      )}
    >
      {/* Quote Header */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* 展开/折叠按钮 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

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
          <MessageSquareQuote className="h-4 w-4 text-neutral-400" />
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
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
      <div className="px-3 pb-2">
        {isExpanded ? (
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 [&>p]:mb-1 [&>p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: fullContentHtml }}
          />
        ) : (
          <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
            {previewContent}
          </p>
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
