import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Download, Upload, Star, MessageSquare, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { formatSize } from "@/utils/format";

interface TorrentCardProps {
  id: string | number;
  thumbnail: string;
  title: string;
  subTitle?: string;
  category: string;
  size: string;
  seeders: number;
  leechers: number;
  isFree?: boolean;
  isVip?: boolean;
  isHot?: boolean;
  rating?: number;
  comments?: number;
  doubanUrl?: string;
  onDownload?: () => void;
  onDownloadByIdTitle?: (id: string, title: string) => void;
}

function TorrentCardInner({
  id,
  thumbnail,
  title,
  subTitle,
  category,
  size,
  seeders,
  leechers,
  isFree = false,
  isVip = false,
  isHot = false,
  rating,
  comments,
  onDownload,
  onDownloadByIdTitle,
}: TorrentCardProps) {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/torrent/${id}`);
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden mb-3">
        <ImageWithFallback
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge color="gray" size="sm">
            {category}
          </Badge>
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
            <Button
              className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-md transition-colors"
              onClick={handleDetailClick}
            >
              详情
            </Button>
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
            <Button
              className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-md transition-colors"
              onClick={
                onDownloadByIdTitle
                  ? () => onDownloadByIdTitle(String(id), title)
                  : onDownload
              }
              title={
                !onDownload && !onDownloadByIdTitle ? "无下载权限" : undefined
              }
            >
              下载
            </Button>
          </div>
        </div>
      </div>

      <h3 className="text-white text-sm mb-1 line-clamp-1 group-hover:text-[#FBBF24] transition-colors min-h-[1rem]">
        {title}
      </h3>
      {subTitle && (
        <p className="text-white text-sm mb-1 line-clamp-2 group-hover:text-[#FBBF24] text-gray-400 min-h-[2.5rem]">
          {subTitle}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
        <div className="flex items-center gap-1">
          <HardDrive className="w-3 h-3" />
          <span>{formatSize(size)}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500">
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
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-yellow-400">{rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const TorrentCard = memo(TorrentCardInner);
