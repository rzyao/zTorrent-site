import { ImageWithFallback } from './figma/ImageWithFallback';
import { Download, Upload, Star, MessageSquare, HardDrive } from 'lucide-react';

interface TorrentCardProps {
  thumbnail: string;
  title: string;
  category: string;
  size: string;
  seeders: number;
  leechers: number;
  isFree?: boolean;
  isVip?: boolean;
  isHot?: boolean;
  rating?: number;
  comments?: number;
}

export function TorrentCard({
  thumbnail,
  title,
  category,
  size,
  seeders,
  leechers,
  isFree = false,
  isVip = false,
  isHot = false,
  rating,
  comments,
}: TorrentCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden mb-3">
        <ImageWithFallback
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <div className="bg-gray-800/90 px-2 py-1 text-white text-xs rounded">
            {category}
          </div>
          {isFree && (
            <div className="bg-green-500 px-2 py-1 text-white text-xs rounded">
              FREE
            </div>
          )}
          {isVip && (
            <div className="bg-yellow-500 px-2 py-1 text-white text-xs rounded">
              VIP
            </div>
          )}
          {isHot && (
            <div className="bg-red-500 px-2 py-1 text-white text-xs rounded">
              HOT
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <Upload className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">{seeders}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">{leechers}</span>
              </div>
            </div>
            <button className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-md transition-colors">
              下载
            </button>
          </div>
        </div>
      </div>
      
      <h3 className="text-white text-sm mb-2 line-clamp-2 group-hover:text-[#00A8E1] transition-colors min-h-[2.5rem]">
        {title}
      </h3>
      
      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
        <div className="flex items-center gap-1">
          <HardDrive className="w-3 h-3" />
          <span>{size}</span>
        </div>
        {rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-400">{rating}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Upload className="w-3 h-3 text-green-400" />
          <span>{seeders}</span>
        </div>
        <div className="flex items-center gap-1">
          <Download className="w-3 h-3 text-red-400" />
          <span>{leechers}</span>
        </div>
        {comments !== undefined && comments > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{comments}</span>
          </div>
        )}
      </div>
    </div>
  );
}
