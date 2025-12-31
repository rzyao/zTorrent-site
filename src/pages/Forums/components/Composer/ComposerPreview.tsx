import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/components/ui/utils";
import { useComposerStore } from "./ComposerStore";

interface ComposerPreviewProps {
  className?: string;
}

export const ComposerPreview: React.FC<ComposerPreviewProps> = ({ className }) => {
  const { draft } = useComposerStore();

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
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.body}</ReactMarkdown>
    </div>
  );
};
