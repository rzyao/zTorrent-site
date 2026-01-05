import { useState } from "react";
import { Heart } from "lucide-react";
import { ForumsLikesService } from "@/api";
import { cn } from "@/components/ui/utils";
import { toast } from "sonner";

interface LikeButtonProps {
  type: "topic" | "post";
  targetId: string;
  initialLiked?: boolean;
  initialCount?: number;
  className?: string;
  onUpdate?: (liked: boolean, count: number) => void;
}

export function LikeButton({
  type,
  targetId,
  initialLiked = false,
  initialCount = 0,
  className,
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

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 rounded-full p-2 transition-all duration-200",
        liked
          ? "bg-red-50 text-red-500 dark:bg-red-950/20"
          : "text-[#A6A6A6] hover:bg-[#e9e9e9] hover:text-[#222] dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200",
        className,
      )}
      title={liked ? "取消点赞" : "点赞"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-transform duration-200",
          liked && "scale-110 fill-current",
          isAnimating && "animate-bounce",
        )}
      />
      {count > 0 && <span className="text-sm font-medium">{count}</span>}
    </button>
  );
}
