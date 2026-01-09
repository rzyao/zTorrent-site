import React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/modules/app/components/ui/button";
import { FavoriteActionDto } from "@/api";
import { useFavorite } from "@/modules/app/hooks/useFavorite";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/modules/app/components/ui/tooltip";

interface FavoriteButtonProps {
  targetType: FavoriteActionDto.targetType;
  targetId: string;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  hideText?: boolean;
}

export function FavoriteButton({
  targetType,
  targetId,
  className,
  variant = "ghost",
  size = "icon",
  hideText = true,
}: FavoriteButtonProps) {
  const { isFavorite, toggle, isLoading } = useFavorite({ targetType, targetId });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  const Content = (
    <Button
      variant={variant === "icon" ? "ghost" : variant}
      size={hideText ? size : "default"}
      className={cn(
        "transition-colors",
        isFavorite && "text-red-500 hover:text-red-600",
        className,
      )}
      onClick={handleClick}
      disabled={isLoading}
    >
      <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
      {!hideText && <span className="ml-2">{isFavorite ? "已收藏" : "收藏"}</span>}
    </Button>
  );

  if (!hideText) return Content;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{Content}</TooltipTrigger>
        <TooltipContent>
          <p>{isFavorite ? "取消收藏" : "收藏"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
