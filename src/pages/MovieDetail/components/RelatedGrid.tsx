import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Star, Upload } from 'lucide-react';
import type { RelatedItem } from '../types';

/**
 * RelatedGrid 组件（主内容区）
 * - 网格形式展示相关推荐
 */
export function RelatedGrid({ items }: { items: RelatedItem[] }) {
  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
      <h3 className="text-white mb-4">相关推荐</h3>
      {Array.isArray(items) && items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((rec) => (
            <div key={rec.id} className="group cursor-pointer bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-[#00A8E1] transition-colors">
              <div className="relative aspect-[2/3] w-full">
                <ImageWithFallback src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {rec.isFree && (
                  <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs px-1 py-0">FREE</Badge>
                )}
                {rec.isHot && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1 py-0">HOT</Badge>
                )}
              </div>
              <div className="p-3 space-y-2">
                <h4 className="text-white text-sm line-clamp-2 group-hover:text-[#00A8E1] transition-colors">{rec.title}</h4>
                <div className="flex items-center gap-2 text-xs">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400">{rec.rating}</span>
                  <span className="text-gray-500">|</span>
                  <Upload className="w-3 h-3 text-green-400" />
                  <span className="text-gray-400">{rec.seeders}</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-400">{rec.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-sm">暂无相关推荐</div>
      )}
    </div>
  );
}

