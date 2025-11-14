import { Play, Info } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  title: string;
  description: string;
  backgroundImage: string;
}

export function Hero({ title, description, backgroundImage }: HeroProps) {
  return (
    <div className="relative h-[80vh] w-full">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-4 md:px-12">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl text-white">{title}</h1>
          <p className="text-base md:text-lg text-white/90 line-clamp-3">
            {description}
          </p>
          <div className="flex gap-3 pt-4">
            <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg gap-2">
              <Play className="w-6 h-6 fill-current" />
              播放
            </Button>
            <Button
              variant="secondary"
              className="bg-gray-500/70 text-white hover:bg-gray-500/50 px-8 py-6 text-lg gap-2"
            >
              <Info className="w-6 h-6" />
              更多信息
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
