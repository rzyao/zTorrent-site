import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface VideoCardProps {
  thumbnail: string;
  title: string;
  year?: string;
  rating?: string;
  duration?: string;
}

export function VideoCard({ thumbnail, title, year, rating, duration }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer transition-transform duration-300 ease-out hover:scale-110 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video rounded-md overflow-hidden">
        <ImageWithFallback
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {isHovered && (
        <div className="absolute top-full left-0 right-0 bg-zinc-900 p-4 rounded-b-md shadow-xl">
          <div className="flex gap-2 mb-3">
            <Button className="w-8 h-8 rounded-full bg-white hover:bg-white/80 flex items-center justify-center transition-colors">
              <Play className="w-4 h-4 text-black fill-current ml-0.5" />
            </Button>
            <Button className="w-8 h-8 rounded-full border-2 border-gray-400 hover:border-white flex items-center justify-center transition-colors">
              <Plus className="w-4 h-4 text-white" />
            </Button>
            <Button className="w-8 h-8 rounded-full border-2 border-gray-400 hover:border-white flex items-center justify-center transition-colors">
              <ThumbsUp className="w-4 h-4 text-white" />
            </Button>
            <Button className="w-8 h-8 rounded-full border-2 border-gray-400 hover:border-white flex items-center justify-center transition-colors ml-auto">
              <ChevronDown className="w-4 h-4 text-white" />
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-white text-sm">{title}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {year && <span className="text-green-500">{year}</span>}
              {rating && <span className="border border-gray-500 px-1">{rating}</span>}
              {duration && <span>{duration}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
