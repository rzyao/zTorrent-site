import { Badge } from "@/modules/app/components/ui/badge";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";
import { Star, Upload } from "lucide-react";
import type { RelatedItem } from "../types";

/**
 * RelatedGrid 组件（主内容区）
 * - 网格形式展示相关推荐
 */
export function RelatedGrid({ items }: { items: RelatedItem[] }) {
  return (
    <div className="app-card rounded-lg p-6">
      <h3 className="mb-4 text-white">相关推荐</h3>
      {Array.isArray(items) && items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {items.map((rec) => (
            <div
              key={rec.id}
              className="group app-card-hover cursor-pointer overflow-hidden rounded-lg transition-colors"
            >
              <div className="relative aspect-2/3 w-full">
                <ImageWithFallback
                  src={rec.thumbnail}
                  alt={rec.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {rec.isFree && (
                  <Badge className="absolute top-2 left-2 bg-green-500 px-1 py-0 text-xs text-white">
                    FREE
                  </Badge>
                )}
                {rec.isHot && (
                  <Badge className="absolute top-2 left-2 bg-orange-500 px-1 py-0 text-xs text-white">
                    HOT
                  </Badge>
                )}
              </div>
              <div className="space-y-2 p-3">
                <h4 className="line-clamp-2 text-sm text-white transition-colors group-hover:text-amber-400">
                  {rec.title}
                </h4>
                <div className="flex items-center gap-2 text-xs">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-amber-400">{rec.rating}</span>
                  <span className="text-neutral-500">|</span>
                  <Upload className="h-3 w-3 text-green-400" />
                  <span className="text-neutral-400">{rec.seeders}</span>
                  <span className="text-neutral-500">|</span>
                  <span className="text-neutral-400">{rec.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-neutral-400">暂无相关推荐</div>
      )}
    </div>
  );
}
