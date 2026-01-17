import { useState } from "react";
import { Bookmark } from "lucide-react";
import { ForumsBookmarksService } from "@/api";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface BookmarkButtonProps {
  topicId: string;
  initialBookmarked?: boolean;
  className?: string;
  iconOnly?: boolean;
  onUpdate?: (bookmarked: boolean) => void;
}

export function BookmarkButton({
  topicId,
  initialBookmarked = false,
  className,
  iconOnly = false,
  onUpdate,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    // 乐观更新
    const prevStatus = bookmarked;
    setBookmarked(!prevStatus);

    try {
      const res = await ForumsBookmarksService.bookmarksControllerToggle({ topicId });
      if (res.data) {
        setBookmarked(!!res.data.bookmarked);
        onUpdate?.(!!res.data.bookmarked);
        toast.success(res.data.bookmarked ? "已加入收藏" : "已取消收藏");
      }
    } catch (error) {
      setBookmarked(prevStatus);
      // 错误已经由拦截器显示
    } finally {
      setIsLoading(false);
    }
  };

  // 纯图标模式样式（帖子操作栏）
  if (iconOnly) {
    return (
      <Button
        variant="none"
        size="none"
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          "rounded-full p-2",
          bookmarked
            ? "text-[#0088CC]"
            : "text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200",
          className,
        )}
        title={bookmarked ? "取消收藏" : "收藏话题"}
      >
        <Bookmark className={cn("size-5", bookmarked && "fill-current")} />
      </Button>
    );
  }

  // 标准模式样式（话题底部操作栏）
  return (
    <Button
      variant="none"
      size="none"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "gap-1.5 rounded-full px-4 py-2",
        bookmarked
          ? "bg-[#0088CC]/10 text-[#0088CC] hover:bg-[#0088CC]/20 dark:bg-[#0088CC]/20 dark:hover:bg-[#0088CC]/30"
          : "border border-neutral-200 bg-white hover:bg-[#F3F4F6] hover:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200",
        className,
      )}
      title={bookmarked ? "取消收藏" : "收藏话题"}
    >
      <Bookmark
        className={cn("size-5", bookmarked && "fill-current text-[#0088CC]")}
        strokeWidth={1.5}
      />
      <span>{bookmarked ? "已收藏" : "收藏"}</span>
    </Button>
  );
}
