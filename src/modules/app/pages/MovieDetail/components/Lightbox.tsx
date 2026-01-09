import { Dialog, DialogContent } from "@/modules/app/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/modules/app/components/ui/carousel";
import { Button } from "@/modules/app/components/ui/button";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";
import { X } from "lucide-react";

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
      <DialogContent className="h-[90vh] w-full max-w-7xl border-none bg-black/95 p-0">
        <div className="relative flex h-full w-full items-center justify-center">
          <Carousel className="h-full w-full">
            <CarouselContent>
              {stills.map((still, index) => (
                <CarouselItem key={index}>
                  <div className="flex h-[90vh] items-center justify-center p-8">
                    <ImageWithFallback
                      src={still}
                      alt={`剧照 ${index + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 h-12 w-12 border-gray-700 bg-gray-900/80 text-white hover:bg-gray-800" />
            <CarouselNext className="right-4 h-12 w-12 border-gray-700 bg-gray-900/80 text-white hover:bg-gray-800" />
          </Carousel>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-gray-900/80 text-white hover:bg-gray-800"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
