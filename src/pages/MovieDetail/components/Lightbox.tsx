import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { X } from 'lucide-react';

/**
 * Lightbox 组件
 * - 全屏图片查看器，支持左右切换剧照
 */
export function Lightbox({
  open,
  onOpenChange,
  stills,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  stills: string[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-full h-[90vh] bg-black/95 border-none p-0">
        <div className="relative w-full h-full flex items-center justify-center">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {stills.map((still, index) => (
                <CarouselItem key={index}>
                  <div className="flex items-center justify-center h-[90vh] p-8">
                    <ImageWithFallback src={still} alt={`剧照 ${index + 1}`} className="max-w-full max-h-full object-contain" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800 w-12 h-12" />
            <CarouselNext className="right-4 bg-gray-900/80 border-gray-700 text-white hover:bg-gray-800 w-12 h-12" />
          </Carousel>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-gray-900/80 text-white hover:bg-gray-800 w-10 h-10 rounded-full z-50" onClick={() => onOpenChange(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

