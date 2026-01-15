import { useState } from "react";
import { Bookmark } from "lucide-react";
import { ForumsBookmarksService } from "@/api";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { ActionButton } from "../ui/ActionButton";

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

  return (
    <ActionButton
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "h-auto rounded-full border border-transparent shadow-none",
        iconOnly ? "p-2" : "gap-2 px-3 py-2",
        bookmarked
          ? "bg-blue-50 text-blue-500 dark:bg-blue-950/20"
          : "bg-transparent text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200",
        className,
      )}
      title={bookmarked ? "取消收藏" : "收藏话题"}
    >
      <Bookmark className={cn("h-5 w-5", bookmarked && "fill-current")} />
      {!iconOnly && <span>{bookmarked ? "已收藏" : "收藏"}</span>}
    </ActionButton>
  );
}
