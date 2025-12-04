import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Eye } from 'lucide-react';

/**
 * Stills 组件
 * - 展示剧照轮播
 * - 点击单张剧照时，通过 `onOpen` 通知父组件打开大图
 */
export function Stills({ stills, onOpen }: { stills: string[]; onOpen: (index: number) => void }) {
  if (!stills || stills.length === 0) return null;
  return (
    <div className="lg:col-span-3">
      <h2 className="text-white text-2xl mb-4">剧照</h2>
      <div className="bg-gray-900/50 rounded-lg border border-gray-800">
        <Carousel className="w-full">
          <CarouselContent>
            {stills.map((screenshot, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer" onClick={() => onOpen(index)}>
                  <ImageWithFallback src={screenshot} alt={`剧照 ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800" />
          <CarouselNext className="right-2 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800" />
        </Carousel>
      </div>
    </div>
  );
}

