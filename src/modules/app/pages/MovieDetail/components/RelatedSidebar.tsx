import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Star, Upload } from "lucide-react";
import type { RelatedItem } from "../types";

/**
 * RelatedSidebar 组件（右侧边栏）
 * - 列表形式展示相关推荐
 */
export function RelatedSidebar({ items }: { items: RelatedItem[] }) {
  return (
    <div className="card rounded-lg p-6">
      <h3 className="mb-4 text-white">相关推荐</h3>
      <div className="space-y-4">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((torrent) => (
            <div key={torrent.id} className="group cursor-pointer">
              <div className="flex gap-3">
                <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded">
                  <ImageWithFallback
                    src={torrent.thumbnail}
                    alt={torrent.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {torrent.isFree && (
                    <Badge className="absolute top-1 left-1 bg-green-500 px-1 py-0 text-xs text-white">
                      FREE
                    </Badge>
                  )}
                  {torrent.isHot && (
                    <Badge className="absolute top-1 left-1 bg-orange-500 px-1 py-0 text-xs text-white">
                      HOT
                    </Badge>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-2 line-clamp-2 text-sm text-white transition-colors group-hover:text-amber-400">
                    {torrent.title}
                  </h4>
                  <div className="mb-1 flex items-center gap-2">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-amber-400">{torrent.rating}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <div className="flex items-center gap-1">
                      <Upload className="h-3 w-3 text-green-400" />
                      <span>{torrent.seeders}</span>
                    </div>
                    <span>{torrent.size}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-neutral-400">暂无相关推荐</div>
        )}
      </div>
    </div>
  );
}
