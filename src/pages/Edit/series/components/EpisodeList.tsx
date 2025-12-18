import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Link as LinkIcon,
  HardDrive,
} from "lucide-react";
import type { Episode, SeriesTorrent } from "../types";
import { formatSize } from "@/utils/format";

interface EpisodeListProps {
  seriesId: string;
  episodes: Episode[];
  seriesTorrents: SeriesTorrent[];
  onAdd: () => void;
  onEdit: (ep: Episode) => void;
  onDelete: (id: string) => void;
  onBindTorrent: (ep: Episode) => void;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  seriesId,
  episodes,
  seriesTorrents,
  onAdd,
  onEdit,
  onDelete,
  onBindTorrent,
}) => {
  const sortedEpisodes = [...episodes].sort(
    (a, b) => a.episodeNumber - b.episodeNumber
  );

  // 获取某集绑定的种子
  const getTorrentsForEpisode = (episodeNumber: number) => {
    return seriesTorrents.filter((t) => t.episodeNumber === episodeNumber);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">分集列表</h3>
        <Button
          size="sm"
          onClick={onAdd}
          className="bg-amber-500 text-black hover:bg-amber-400"
        >
          <Plus className="w-4 h-4 mr-1" />
          添加分集
        </Button>
      </div>

      <div className="grid gap-3">
        {sortedEpisodes.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm border border-dashed border-gray-800 rounded-lg">
            暂无分集，点击上方按钮添加
          </div>
        )}
        {sortedEpisodes.map((ep) => {
          const boundTorrents = getTorrentsForEpisode(ep.episodeNumber);
          return (
            <div
              key={ep.id || ep.episodeNumber}
              className="p-4 card-item rounded-lg"
            >
              {/* 主要信息行 */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-mono font-medium">
                    E{String(ep.episodeNumber).padStart(2, "0")}
                  </span>
                  <Link
                    to={`/series/${seriesId}/episodes/${ep.id}`}
                    className="text-sm font-medium text-white hover:text-amber-500 hover:underline transition-colors block truncate"
                    title={ep.title}
                  >
                    {ep.title}
                  </Link>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                    onClick={() => onBindTorrent(ep)}
                  >
                    <LinkIcon className="w-3.5 h-3.5 mr-1" />
                    绑定种子
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-gray-400 hover:text-white"
                    onClick={() => onEdit(ep)}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-gray-400 hover:text-red-500"
                    onClick={() => onDelete(ep.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* 元数据行 */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                {ep.airDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {ep.airDate}
                  </span>
                )}
                {ep.runtime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ep.runtime}分钟
                  </span>
                )}
              </div>

              {/* 简介 */}
              {ep.overview && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                  {ep.overview}
                </p>
              )}

              {/* 已绑定种子列表 */}
              {boundTorrents.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    已绑定种子 ({boundTorrents.length})
                  </div>
                  <div className="space-y-1">
                    {boundTorrents.map((torrent) => (
                      <div
                        key={torrent.id}
                        className="flex items-center justify-between text-xs px-2 py-1.5 bg-gray-900/50 rounded"
                      >
                        <span
                          className="text-gray-300 truncate max-w-[60%]"
                          title={torrent.title}
                        >
                          {torrent.title || torrent.subTitle || "未命名种子"}
                        </span>
                        <div className="flex items-center gap-2 text-gray-500">
                          <span>{formatSize(parseInt(torrent.size) || 0)}</span>
                          {torrent.quality && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px]">
                              {torrent.quality}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
