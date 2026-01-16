import { memo, useMemo, useCallback, Fragment } from "react";
import { parseMarkdownCached } from "@/modules/forum/utils/markdownCache";
import { QuoteBlock } from "../QuoteBlock";
import { processBBCodeQuotes, parseContentWithQuotes } from "../../utils/quoteParser";

export const PostContent = memo(
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
      return parseMarkdownCached(processed);
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
