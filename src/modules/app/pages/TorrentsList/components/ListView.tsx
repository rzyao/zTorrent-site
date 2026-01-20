import { Download, Upload, Star, MessageSquare, HardDrive, Calendar } from "lucide-react";
import { DownloadButton } from "@/modules/app/components/ui/DownloadButton";
import { CoverImage } from "@/modules/app/components/media/CoverImage";
import { Badge } from "@/modules/app/components/ui/badge";
import { formatSize } from "@/utils/format";
import type { Torrent } from "../types";
import { formatDate } from "@/modules/app/pages/Invite/utils";
import { useNavigate } from "react-router-dom";

interface ListViewProps {
  /** 展示列表数据（已做前端筛选/排序派生） */
  items: Torrent[];
  /** 分类标签词典映射 */
  getCategoryLabel: (key?: string) => string | undefined;
  /** 下载触发（容器传入，调用 `useTorrentDownload`） */
  onDownload: (id: string, title: string) => void;
}

/**
 * 保留与旧页面一致的标签颜色逻辑
 * - 设计原因：后端返回的标签集合需要在UI上进行视觉区分
 */
const tagBadgeColor = (key?: string) => {
  if (!key) return "primary" as const;
  if (key === "完结") return "green" as const;
  if (key === "分级") return "red" as const;
  return "primary" as const;
};

/**
 * ListView
 * 职责：列表行视图（复用 `ImageWithFallback`、`Badge` 等）
 * 说明：纯UI组件，所有数据和事件通过 props 输入。
 */
export function ListView({ items, getCategoryLabel, onDownload }: ListViewProps) {
  const navigate = useNavigate();
  return (
    <div className="mb-8 space-y-4">
      {items.map((torrent) => (
        <div
          key={torrent.id}
          className="app-card text-parent hover: cursor-pointer rounded-lg border-[0.5px] p-4 transition-all duration-300 hover:border-[0.5px] hover:border-amber-500/70"
        >
          <div
            className="flex gap-4"
            onClick={() => {
              navigate(`/app/torrent/${torrent.id}`);
            }}
          >
            {/* 缩略图 */}
            <div className="hidden-in-mobile relative h-25 w-25 shrink-0 overflow-hidden rounded">
              <CoverImage attachableType="torrent" attachableId={String(torrent.id)} size="thumb" />
            </div>

            {/* 信息区 */}
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div className="mb-1 flex items-start gap-3">
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="text truncate text-[#dadada]">{torrent.title}</h3>
                  <h3 className="text truncate text-[#dadada]">{torrent.subTitle}</h3>
                </div>
                <DownloadButton
                  className="hidden-in-mobile"
                  torrentId={String(torrent.id)}
                  onDownload={() => {
                    onDownload(String(torrent.id), String(torrent.title || "download"));
                  }}
                />
              </div>

              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Badge size="sm" className="border-amber-500/30 bg-amber-500/20 text-amber-400">
                  {getCategoryLabel(torrent.category) || torrent.category}
                </Badge>
                {Array.isArray(torrent.tags)
                  ? torrent.tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        color={tagBadgeColor(tag)}
                        border="white"
                        size="sm"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))
                  : torrent.tags && (
                      <Badge outline size="sm" className="text-xs">
                        {torrent.tags}
                      </Badge>
                    )}
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
                {torrent.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-yellow-400">{torrent.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <HardDrive className="h-4 w-4" />
                  <span>{formatSize(torrent.size)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Upload className="h-4 w-4 text-green-400" />
                  <span className="hidden-in-mobile text-green-400">{torrent.seeders} 做种</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4 text-red-400" />
                  <span className="hidden-in-mobile text-red-400">{torrent.leechers} 下载</span>
                </div>
                <div className="hidden-in-mobile flex items-center gap-1">
                  <span>{torrent.completed} 完成</span>
                </div>
                <div className="hidden-in-mobile flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{torrent.comments} 评论</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="whitespace-pre">{formatDate(torrent.uploadedAt)}</span>
                </div>
                <div className="hidden-in-mobile">
                  <span className="text-[#00A8E1]">{torrent.uploader}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
