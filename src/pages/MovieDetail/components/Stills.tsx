import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Eye } from "lucide-react";

/**
 * Stills 组件
 * - 展示剧照轮播
 * - 点击单张剧照时，通过 `onOpen` 通知父组件打开大图
 */
export function Stills({ stills, onOpen }: { stills: string[]; onOpen: (index: number) => void }) {
  if (!stills || stills.length === 0) return null;
  return (
    <div className="lg:col-span-3">
      <h2 className="mb-4 text-2xl text-white">剧照</h2>
      <div className="card rounded-lg">
        <Carousel className="w-full">
          <CarouselContent>
            {stills.map((screenshot, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div
                  className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => onOpen(index)}
                >
                  <ImageWithFallback
                    src={screenshot}
                    alt={`剧照 ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                    <Eye className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 border-neutral-700/50 bg-neutral-900/80 text-white hover:border-amber-500/50 hover:bg-neutral-800" />
          <CarouselNext className="right-2 border-neutral-700/50 bg-neutral-900/80 text-white hover:border-amber-500/50 hover:bg-neutral-800" />
        </Carousel>
      </div>
    </div>
  );
}
