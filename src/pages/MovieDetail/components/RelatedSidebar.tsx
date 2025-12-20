import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Star, Upload } from 'lucide-react';
import type { RelatedItem } from '../types';

/**
 * RelatedSidebar 组件（右侧边栏）
 * - 列表形式展示相关推荐
 */
export function RelatedSidebar({ items }: { items: RelatedItem[] }) {
  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
      <h3 className="text-white mb-4">相关推荐</h3>
      <div className="space-y-4">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((torrent) => (
            <div key={torrent.id} className="group cursor-pointer">
              <div className="flex gap-3">
                <div className="relative w-20 h-28 rounded overflow-hidden flex-shrink-0">
                  <ImageWithFallback src={torrent.thumbnail} alt={torrent.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  {torrent.isFree && (
                    <Badge className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0">FREE</Badge>
                  )}
                  {torrent.isHot && (
                    <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0">HOT</Badge>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm mb-2 line-clamp-2 group-hover:text-[#00A8E1] transition-colors">{torrent.title}</h4>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-400 text-xs">{torrent.rating}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Upload className="w-3 h-3 text-green-400" />
                      <span>{torrent.seeders}</span>
                    </div>
                    <span>{torrent.size}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm">暂无相关推荐</div>
        )}
      </div>
    </div>
  );
}

