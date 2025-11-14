import { Play, Download, Upload, Star, Calendar, HardDrive } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeaturedTorrentProps {
  title: string;
  description: string;
  backgroundImage: string;
  category: string;
  size: string;
  seeders: number;
  leechers: number;
  rating: number;
  uploadDate: string;
  isFree?: boolean;
}

export function FeaturedTorrent({
  title,
  description,
  backgroundImage,
  category,
  size,
  seeders,
  leechers,
  rating,
  uploadDate,
  isFree = false,
}: FeaturedTorrentProps) {
  return (
    <div className="relative h-[75vh] w-full">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F171E] via-[#0F171E]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F171E] via-[#0F171E]/40 to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-4 md:px-8">
        <div className="max-w-2xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 px-3 py-1 text-white text-sm rounded">
              {category}
            </div>
            {isFree && (
              <div className="bg-green-500 px-3 py-1 text-white text-sm rounded">
                FREE
              </div>
            )}
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm">{rating}</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl text-white">{title}</h1>
          
          <p className="text-base md:text-lg text-gray-300 line-clamp-3">
            {description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              <span>{size}</span>
            </div>
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{seeders} 做种</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-red-400" />
              <span className="text-red-400">{leechers} 下载</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{uploadDate}</span>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button className="bg-white text-black hover:bg-gray-200 px-10 py-6 text-lg gap-3 rounded-md">
              <Download className="w-5 h-5" />
              下载种子
            </Button>
            <Button
              variant="secondary"
              className="bg-gray-600/80 text-white hover:bg-gray-600 px-10 py-6 text-lg gap-3 rounded-md"
            >
              <Play className="w-5 h-5" />
              详细信息
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
