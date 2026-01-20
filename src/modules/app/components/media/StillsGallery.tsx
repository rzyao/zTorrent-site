import React from "react";
import { useAttachments } from "@/modules/app/hooks/useAttachments";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";

export interface StillsGalleryProps {
  attachableType: "torrent";
  attachableId: string;
  className?: string;
}

/**
 * StillsGallery
 * 种子剧照统一展示组件，内部通过附件 field=still 获取并按 sortOrder 排序。
 */
export const StillsGallery: React.FC<StillsGalleryProps> = ({
  attachableType = "torrent",
  attachableId,
  className,
}) => {
  const { items } = useAttachments(attachableType, attachableId, "still");
  const sorted = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {sorted.map((img) => (
          <ImageWithFallback key={img.id} src={img.url} alt="still" />
        ))}
      </div>
    </div>
  );
};
