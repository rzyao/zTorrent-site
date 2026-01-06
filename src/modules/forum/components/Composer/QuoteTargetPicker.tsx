import { ChevronDown } from "lucide-react";
import { useComposerStore, QuoteInfo } from "./ComposerStore";
import { cn } from "@/components/ui/utils";

/**
 * 多引用选择器组件
 * 当用户引用了多个帖子时，允许选择要回复的具体帖子
 */
export function QuoteTargetPicker() {
  const { draft, selectQuote } = useComposerStore();
  const { quotes, selectedQuoteIndex } = draft;

  // 少于 2 个引用时不显示选择器
  if (quotes.length < 2) return null;

  const selectedQuote = quotes[selectedQuoteIndex];

  return (
    <div className="relative flex items-center gap-2">
      <span className="text-xs text-neutral-500 dark:text-neutral-400">回复:</span>
      <div className="group relative">
        <button
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm transition-colors",
            "border-neutral-300 bg-white hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:border-neutral-500",
          )}
        >
          <span className="font-medium">
            {selectedQuote ? `#${selectedQuote.floor} ${selectedQuote.username}` : "选择回复目标"}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
        </button>

        {/* Dropdown */}
        <div
          className={cn(
            "absolute bottom-full left-0 z-50 mb-1 hidden min-w-[180px] overflow-hidden rounded-md border bg-white shadow-lg group-hover:block dark:border-neutral-700 dark:bg-neutral-800",
          )}
        >
          {quotes.map((quote, index) => (
            <button
              key={quote.postId}
              onClick={() => selectQuote(index)}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                index === selectedQuoteIndex
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-700",
              )}
            >
              <span className="text-xs text-neutral-500">#{quote.floor}</span>
              <span className="font-medium">{quote.username}</span>
              <span className="ml-auto truncate text-xs text-neutral-400" style={{ maxWidth: 80 }}>
                {quote.content.substring(0, 20)}...
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
