import { Download, Upload, Star, Flag, Bookmark, Share2, Info, UserRoundCheck } from "lucide-react";
import { DownloadButton } from "@/modules/app/components/ui/DownloadButton";
import { ToggleButton } from "@/modules/app/components/ui/ToggleButton";
import { ActionButton } from "@/modules/app/components/ui/ActionButton";
import { Badge } from "@/modules/app/components/ui/badge";
import { Separator } from "@/modules/app/components/ui/separator";
import { useDownloadStatusStore } from "@/modules/app/stores/downloadStatusStore";
import { useTorrentDownload } from "@/modules/app/hooks/useTorrentDownload";
import { useDownloaders } from "@/modules/app/context/DownloadersContext";
import { formatSize } from "@/utils/format";
import { useState } from "react";
import { DownloadToDownloaderModal } from "@/modules/app/components/DownloadToDownloaderModal";
import { useSourceTracker } from "@/modules/app/hooks/useSourceTracker";
import { TorrentData } from "../types";

interface TorrentHeaderProps {
  data: TorrentData;
  loading: boolean;
  error: string | null;
  favorite: {
    isFavorite: boolean;
    toggle: () => void;
    isLoading: boolean;
  };
}

export function TorrentHeader({ data, loading, error, favorite }: TorrentHeaderProps) {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const { downloaders } = useDownloaders();
  const { downloadByTorrentId } = useTorrentDownload();
  const setDownloadStatus = useDownloadStatusStore((state) => state.setStatus);
  const { sourcePayload } = useSourceTracker();

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h1 className="mb-2 text-2xl text-white md:text-3xl">{data.title}</h1>
          {data.subTitle && <p className="text-lg text-white">{data.subTitle}</p>}
          {loading && <p className="text-sm text-gray-500">加载中...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>

      {/* 标签和状态 */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge className="border border-amber-500/30 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
          {data.category}
        </Badge>
        <Badge className="border border-orange-500/30 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30">
          {data.standard}
        </Badge>
        {data.isFree && (
          <Badge className="border border-green-500/30 bg-green-500/20 text-green-400 hover:bg-green-500/30">
            FREE
          </Badge>
        )}
        {Number.isFinite(data.rating) && (
          <div className="ml-2 flex items-center gap-1 text-yellow-400">
            <Star className="h-4 w-4 fill-yellow-400" />
            <span>{data.rating}</span>
          </div>
        )}
        {data.isFree && (
          <div className="ml-2 flex items-center gap-1 text-sm text-green-400">
            <Info className="h-3 w-3" />
            <span>限时免费至 {data.promotionEnd}</span>
          </div>
        )}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
        <span className="text-gray-200">分类</span>
        <span className="text-gray-200">{data.category}</span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-200">媒介</span>
        <span className="text-gray-200">{data.medium}</span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-200">编码</span>
        <span className="text-gray-200">{data.videoCodec}</span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-200">分辨率</span>
        <span className="text-gray-200">{data.standard}</span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-200">音频</span>
        <span className="text-gray-200">{data.audioCodec}</span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-200">制作组</span>
        <span className="text-gray-200">{data.productionTeam}</span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-200">大小</span>
        <span className="text-gray-200">{formatSize(data.size)}</span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-200">发布时间</span>
        <span className="text-gray-200">{data.uploadDate}</span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-200">发布者</span>
        <span className="text-gray-200">{data.uploader}</span>
        {data.uploaderLevel && (
          <Badge className="ml-1 border border-orange-500/30 bg-orange-500/20 text-xs text-orange-400">
            {data.uploaderLevel}
          </Badge>
        )}
        {data.imdb && (
          <>
            <span className="text-gray-600">|</span>
            <a
              href={`https://www.imdb.com/title/${data.imdb}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              IMDb: {data.imdb}
            </a>
          </>
        )}
        {data.douban && (
          <>
            <span className="text-gray-600">|</span>
            <a
              href={`https://movie.douban.com/subject/${data.douban}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              豆瓣: {data.douban}
            </a>
          </>
        )}
      </div>

      {/* 操作按钮和统计信息 */}
      <div className="flex flex-wrap items-center gap-3">
        <DownloadButton
          torrentId={String(data.id)}
          size="md"
          onDownload={() => {
            if (downloaders.length > 0) {
              setDownloadModalOpen(true);
            } else {
              setDownloadStatus(String(data.id), "loading");
              downloadByTorrentId(String(data.id), String(data.title || "download"))
                .then(() => {
                  setDownloadStatus(String(data.id), "success");
                })
                .catch(() => {
                  setDownloadStatus(String(data.id), "idle");
                });
            }
          }}
          labels={{
            idle: "下载种子",
            loading: "下载中...",
            success: "已下载",
          }}
        />
        <ToggleButton
          pressed={favorite.isFavorite}
          onPressedChange={() => favorite.toggle()}
          isLoading={favorite.isLoading}
          activeIcon={<Bookmark className="h-4 w-4 fill-current" />}
          inactiveIcon={<Bookmark className="h-4 w-4" />}
          activeClassName="border-[0.5px] border-red-400 bg-red-400/10 text-red-400"
          inactiveClassName="bg-gray-700/40 text-neutral-300 hover:bg-gray-700/60"
          tooltip={favorite.isFavorite ? "取消收藏" : "点击收藏"}
        >
          {favorite.isFavorite ? "已收藏" : "收藏"}
        </ToggleButton>
        <ActionButton color="ghost-blue" icon={Share2} size="md">
          分享
        </ActionButton>
        <ActionButton color="ghost-red" icon={Flag} size="md">
          举报
        </ActionButton>

        <Separator orientation="vertical" className="mx-1 h-6 bg-gray-700" />

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Upload className="h-4 w-4 text-green-400" />
            <span className="text-green-400">{data.seeders}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4 text-red-400" />
            <span className="text-red-400">{data.leechers}</span>
          </div>
          <div className="flex items-center gap-1">
            <UserRoundCheck className="h-4 w-4 text-gray-400" />
            <span className="text-white">{data.completed}</span>
          </div>
        </div>
      </div>

      <DownloadToDownloaderModal
        open={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        torrentId={String(data.id)}
        torrentTitle={String(data.title || "download")}
        source={sourcePayload}
      />
    </div>
  );
}
