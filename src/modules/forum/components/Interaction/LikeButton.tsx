import { useState } from "react";
import { Heart } from "lucide-react";
import { ForumsLikesService } from "@/api";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";

interface LikeButtonProps {
  type: "topic" | "post";
  targetId: string;
  initialLiked?: boolean;
  initialCount?: number;
  className?: string;
  /** 纯图标模式（帖子操作栏使用） */
  iconOnly?: boolean;
  onUpdate?: (liked: boolean, count: number) => void;
}

export function LikeButton({
  type,
  targetId,
  initialLiked = false,
  initialCount = 0,
  className,
  iconOnly = false,
  onUpdate,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // 乐观更新
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevLiked ? prevCount - 1 : prevCount + 1);
    if (!prevLiked) setIsAnimating(true);

    try {
      const res = await ForumsLikesService.likesControllerToggle({
        [type === "topic" ? "topicId" : "postId"]: targetId,
      } as any);

      if (res.data) {
        setLiked(!!res.data.liked);
        setCount(res.data.likeCount || 0);
        onUpdate?.(!!res.data.liked, res.data.likeCount || 0);
      }
    } catch (error: any) {
      // 还原状态
      setLiked(prevLiked);
      setCount(prevCount);
      // 错误提示已由全局拦截器处理
    } finally {
      if (!liked) {
        setTimeout(() => setIsAnimating(false), 500);
      }
    }
  };

  // 纯图标模式样式（帖子操作栏）
  if (iconOnly) {
    return (
      <Button
        variant="none"
        size="none"
        onClick={handleToggle}
        className={cn(
          "rounded-full p-2",
          liked
            ? "text-red-500"
            : "text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200",
          className,
        )}
        title={liked ? "取消点赞" : "点赞"}
      >
        <Heart
          className={cn(
            "size-5 transition-transform duration-200",
            liked && "fill-current",
            isAnimating && "animate-bounce",
          )}
        />
      </Button>
    );
  }

  // 标准模式样式（话题底部操作栏）
  return (
    <Button
      variant="none"
      size="none"
      onClick={handleToggle}
      className={cn(
        "gap-1.5 rounded-full px-4 py-2",
        liked
          ? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40"
          : "border border-neutral-200 bg-white hover:bg-[#F3F4F6] hover:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200",
        className,
      )}
      title={liked ? "取消点赞" : "点赞"}
    >
      <Heart
        className={cn(
          "size-5 transition-transform duration-200",
          liked && "scale-110 fill-current text-red-500",
          isAnimating && "animate-bounce",
        )}
        strokeWidth={1.5}
      />
      {count > 0 && <span className="text-sm">{count}</span>}
    </Button>
  );
}
