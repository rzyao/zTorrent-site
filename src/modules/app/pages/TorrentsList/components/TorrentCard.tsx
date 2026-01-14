import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";
import { Download, Upload, Star, CloudDownload, HardDrive } from "lucide-react";
import { Button } from "@/modules/app/components/ui/button";
import { Badge } from "@/modules/app/components/ui/badge";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { formatSize } from "@/utils/format";
import { cn } from "@/utils/cn";

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
    navigate(`/app/torrent/${id}`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    navigate(`/app/torrent/${id}`);
  };

  return (
    <div className="group relative hover:z-50">
      {/* 实际卡片内容 */}
      <div
        className={cn(
          "origin-center cursor-pointer overflow-hidden rounded-lg border border-transparent transition-all duration-300",
          "hover:scale-110 hover:border-amber-500 hover:bg-[#1A1A1A] hover:shadow-2xl",
        )}
        onClick={handleCardClick}
      >
        <div className={cn("relative mb-2 aspect-2/3 overflow-hidden rounded-md", "sm:mb-3")}>
          <ImageWithFallback
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5 px-0.5">
            {/* 分类标签：采用专业媒体库风格的标签设计 */}
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-sm bg-slate-900/80 px-2 py-0.5",
                "border border-white/10 shadow-sm backdrop-blur-sm",
              )}
            >
              {/* 装饰性小圆点/引导条，增加视觉精致度 */}
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.6)]" />
              <span className="tracking-0.1em text-[10px] font-bold text-slate-100 uppercase">
                {category}
              </span>
            </div>

            {/* 状态标签：采用高对比度的渐变与微光感 */}
            {isFree && (
              <div
                className={cn(
                  "rounded-sm px-1.5 py-0.5 text-[9px] font-bold text-white shadow-lg",
                  "bg-linear-to-r from-emerald-500 to-teal-500 shadow-emerald-500/20",
                  "tracking-tighter",
                )}
              >
                FREE
              </div>
            )}
            {isVip && (
              <div
                className={cn(
                  "rounded-sm px-1.5 py-0.5 text-[9px] font-bold text-white shadow-lg",
                  "bg-linear-to-r from-amber-400 to-orange-500 shadow-amber-500/20",
                  "tracking-tighter",
                )}
              >
                VIP
              </div>
            )}
            {isHot && (
              <div
                className={cn(
                  "rounded-sm px-1.5 py-0.5 text-[9px] font-bold text-white shadow-lg",
                  "bg-linear-to-r from-rose-500 to-red-600 shadow-rose-500/20",
                  "tracking-tighter",
                )}
              >
                HOT
              </div>
            )}
          </div>

          {/* 悬浮下载层 */}
          <div
            className={cn(
              "absolute inset-0 hidden items-center justify-center opacity-0 transition-all duration-300",
              "group-hover:opacity-100 md:flex",
            )}
          >
            <div className="space-y-2 text-center">
              <Button
                className={cn(
                  "flex items-center gap-2 rounded-full border-none bg-linear-to-r from-amber-400 to-amber-600 px-6 py-2.5",
                  "font-semibold text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300",
                  "hover:scale-105 hover:from-amber-300 hover:to-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]",
                )}
                onClick={(e) => {
                  e.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击跳转
                  if (onDownloadByIdTitle) {
                    onDownloadByIdTitle(String(id), title);
                  } else if (onDownload) {
                    onDownload();
                  }
                }}
                title={!onDownload && !onDownloadByIdTitle ? "无下载权限" : undefined}
                style={{
                  fontFamily: '"Source Han Serif CN", "STSong", "SimSun", serif',
                  fontWeight: 700,
                }}
              >
                <CloudDownload className="h-5 w-5" />
                <span>下载</span>
              </Button>
            </div>
          </div>
        </div>

        {/* 文本内容区域 */}
        <div className="pt-0">
          <div className="title relative">
            {/* 占位层：支撑高度 */}
            <div className="text pointer-events-none invisible py-2">
              <h3 className="mb-0.5 line-clamp-1 text-xs sm:mb-1 sm:text-sm">{title}</h3>
              {subTitle && <p className="mb-1 line-clamp-2 text-[10px] sm:text-xs">{subTitle}</p>}
            </div>

            {/* 实际显示层：处理悬浮展开 */}
            <div
              className={cn(
                "text absolute bottom-0 left-0 w-full py-2 transition-all duration-300",
                "group-hover:bg-[#1A1A1A]/80 group-hover:px-2",
              )}
            >
              <h3
                className={cn(
                  "pointer-events-none mb-1 line-clamp-1 text-sm leading-relaxed tracking-wider text-white transition-colors",
                  "shadow-black text-shadow-sm group-hover:text-amber-400 sm:text-base md:group-hover:line-clamp-none",
                )}
                style={{
                  fontFamily: '"Source Han Serif CN", "STSong", "SimSun", serif',
                  fontWeight: 700,
                }}
              >
                {title}
              </h3>
              {subTitle && (
                <p
                  className={cn(
                    "pointer-events-none mb-1 line-clamp-2 text-[10px] leading-normal tracking-wide text-gray-400 transition-colors",
                    "group-hover:text-amber-200/90 sm:text-xs md:group-hover:line-clamp-none",
                  )}
                >
                  {subTitle}
                </p>
              )}
            </div>
          </div>

          {/* 底部统计信息 */}
          <div
            className={cn(
              "mb-1 flex items-center justify-between text-[10px] text-gray-400 transition-all duration-300",
              "group-hover:px-2 sm:text-xs",
            )}
          >
            <div className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              <span>{formatSize(size)}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500">
              <div className="flex items-center gap-1">
                <Upload className="h-3 w-3 text-green-400" />
                <span>{seeders}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3 text-red-400" />
                <span>{leechers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 桌面端布局占位 */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" />
    </div>
  );
}

export const TorrentCard = memo(TorrentCardInner);
