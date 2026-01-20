import React from "react";
import { useAttachments } from "@/modules/app/hooks/useAttachments";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";

export interface CoverImageProps {
  attachableType: "torrent" | "series" | "movie" | "playlist";
  attachableId: string;
  size?: "thumb" | "medium" | "large";
  className?: string;
  alt?: string;
}

/**
 * CoverImage
 * 统一封面渲染组件，内部通过附件查询派生尺寸 URL。
 * Torrent: field=cover/cover_thumb/cover_medium/cover_large
 * Series/Movie: field=poster
 * Playlist: field=cover
 */
export const CoverImage: React.FC<CoverImageProps> = ({
  attachableType,
  attachableId,
  size = "medium",
  className,
  alt,
}) => {
  const field =
    attachableType === "torrent"
      ? size === "thumb"
        ? "cover_thumb"
        : size === "medium"
          ? "cover_medium"
          : "cover_large"
      : attachableType === "playlist"
        ? "cover"
        : "poster";

  const { urls } = useAttachments(attachableType, attachableId, field);
  const src = urls[0] || "";

  return (
    <ImageWithFallback
      src={src}
      className={className}
      alt={alt || `${attachableType} cover`}
    />
  );
};
