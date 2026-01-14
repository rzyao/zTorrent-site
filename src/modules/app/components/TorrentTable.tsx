// 组件依赖：图标库（状态/指标）、路由跳转、图片占位、徽标、按钮、下载 Hook、格式化工具
import { Download, Upload, MessageSquare, Star, HardDrive, Calendar, Award } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "@/modules/app/components/ui/button";
import { formatSize, formatDateTime } from "@/utils/format";
import { DownloadToDownloaderModal } from "./DownloadToDownloaderModal";

// 种子数据模型：与列表视图对齐，支持副标题与两个时间字段兼容
interface Torrent {
  id: string;
  title: string;
  subTitle?: string;
  category: string;
  image?: string;
  size: string;
  seeders: number;
  leechers: number;
  completed: number;
  uploader: string;
  uploadTime: string;
  uploadDate?: string;
  isFree?: boolean;
  isVip?: boolean;
  isHot?: boolean;
  comments: number;
  rating?: number;
}

// 组件入参：待渲染的种子列表数据
interface TorrentTableProps {
  torrents: Torrent[];
  filmId?: string;
}

// 统一列表视图样式的种子表格组件
export function TorrentTable({ torrents, filmId }: TorrentTableProps) {
  const [downloadModal, setDownloadModal] = useState<{
    open: boolean;
    torrentId: string;
    torrentTitle: string;
  }>({
    open: false,
    torrentId: "",
    torrentTitle: "",
  });

  const location = useLocation();
  const mergedSearch = (() => {
    const p = new URLSearchParams(location.search);
    if (filmId) p.set("source_film_id", filmId);
    const s = p.toString();
    return s ? `?${s}` : "";
  })();
  const mergedHash = location.hash;
  return (
    // 列表容器：与 TorrentsPage 列表视图一致的间距与外边距
    <div className="mb-8 space-y-4">
      {torrents.map((torrent) => (
        // 单个种子卡片容器：hover 边框高亮、过渡细腻
        <div
          key={torrent.id}
          className="app-card app-card-hover cursor-pointer rounded-lg p-4 transition-all duration-300"
        >
          <div className="flex gap-4">
            {/* 缩略图：统一 w-25 h-25，缺省时不渲染 */}
            {torrent.image && (
              <div className="relative h-25 w-25 shrink-0 overflow-hidden rounded">
                <ImageWithFallback
                  src={torrent.image}
                  alt={torrent.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {/* 信息区：标题/副标题 + 右侧下载按钮 */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-start gap-3">
                <div className="flex min-w-0 flex-1 flex-col">
                  {/* 标题：保持可点击跳转详情，悬停高亮 */}
                  <h3 className="flex-1 text-white transition-colors hover:text-amber-400">
                    <Link
                      to={{
                        pathname: `/app/torrent/${torrent.id}`,
                        search: mergedSearch,
                        hash: mergedHash,
                      }}
                    >
                      {torrent.title}
                    </Link>
                  </h3>
                  {torrent.subTitle && (
                    // 副标题：存在时显示并与标题同样交互样式
                    <h3 className="flex-1 text-white transition-colors hover:text-amber-400">
                      <Link
                        to={{
                          pathname: `/app/torrent/${torrent.id}`,
                          search: mergedSearch,
                          hash: mergedHash,
                        }}
                      >
                        {torrent.subTitle}
                      </Link>
                    </h3>
                  )}
                </div>
                {/* 下载按钮：弹出下载选项弹窗 */}
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-lg border-[#92702a] bg-transparent text-[#d4a733] hover:border-[#d4a733] hover:bg-[#d4a733]/10 hover:text-[#e8bc4a]"
                  onClick={(e) => {
                    e.preventDefault();
                    setDownloadModal({
                      open: true,
                      torrentId: String(torrent.id),
                      torrentTitle: String(torrent.title || "download"),
                    });
                  }}
                >
                  <Download className="mr-1 h-4 w-4" />
                  下载
                </Button>
              </div>
              {/* 徽标区：类别/FREE/VIP/HOT/评分 */}
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Badge
                  size="sm"
                  className="border-amber-500/30 bg-amber-500/20 text-xs text-amber-400"
                >
                  {torrent.category}
                </Badge>
                {torrent.isFree && (
                  <Badge color="green" size="sm">
                    FREE
                  </Badge>
                )}
                {torrent.isVip && (
                  <Badge color="yellow" size="sm">
                    VIP
                  </Badge>
                )}
                {torrent.isHot && (
                  <Badge color="red" size="sm">
                    HOT
                  </Badge>
                )}
                {typeof torrent.rating === "number" && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-amber-400">{torrent.rating}</span>
                  </div>
                )}
              </div>

              {/* 指标区：大小/做种/下载/完成/评论/上传时间/上传者 */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400">
                <div className="flex items-center gap-1">
                  <HardDrive className="h-4 w-4" />
                  <span>{formatSize(torrent.size)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Upload className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">{torrent.seeders} 做种</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400">{torrent.leechers} 下载</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{torrent.completed} 完成</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{torrent.comments} 评论</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(torrent.uploadDate || torrent.uploadTime)}</span>
                </div>
                <div>
                  <span className="text-amber-400">{torrent.uploader}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <DownloadToDownloaderModal
        open={downloadModal.open}
        torrentId={downloadModal.torrentId}
        torrentTitle={downloadModal.torrentTitle}
        onClose={() => setDownloadModal((prev) => ({ ...prev, open: false }))}
        source={filmId ? { filmId } : undefined}
      />
    </div>
  );
}
