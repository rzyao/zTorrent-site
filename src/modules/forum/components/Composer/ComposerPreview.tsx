import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/utils/cn";
import { useComposerStore } from "./ComposerStore";
import { useForumTheme } from "../../context/ForumThemeContext";

interface ComposerPreviewProps {
  className?: string;
}

export const ComposerPreview: React.FC<ComposerPreviewProps> = ({ className }) => {
  const { draft } = useComposerStore();
  const { theme } = useForumTheme();

  if (!draft.body) {
    return (
      <div
        className={cn(
          "text-muted-foreground/40 flex h-full items-center justify-center",
          className,
        )}
      >
        预览区域
      </div>
    );
  }

  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-none overflow-y-auto p-4 wrap-break-word",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定义代码块渲染
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;

            if (isInline) {
              // 行内代码
              return (
                <code
                  className="rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-neutral-800"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // 代码块
            return (
              <SyntaxHighlighter
                style={theme === "dark" ? oneDark : oneLight}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {draft.body}
      </ReactMarkdown>
    </div>
  );
};
