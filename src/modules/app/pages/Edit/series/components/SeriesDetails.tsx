import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Trash2,
  Star,
  Clock,
  Users,
  Video,
  Download,
  Plus,
  Tv,
} from "lucide-react";
import type { Series } from "@/modules/app/pages/Edit/series/types";

interface SeriesDetailsProps {
  series: Series;
  onEdit: () => void;
  onDelete: () => void;
  onAddTorrent?: () => void; // Optional for series for now
}

export function SeriesDetails({
  series,
  onEdit,
  onDelete,
  onAddTorrent,
}: SeriesDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <img
          src={series.poster || undefined}
          alt={series.title}
          className="w-32 h-48 rounded-xl object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-white text-2xl mb-1">{series.title}</h2>
              <p className="text-neutral-400 text-sm mb-3">
                {series.originalTitle} ({series.year})
              </p>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-amber-500/20 text-amber-400">
                  {series.categories?.[0] || "Uncategorized"}
                </Badge>
                {series.genres.map((genre) => (
                  <Badge
                    key={genre}
                    className="bg-neutral-700/50 text-neutral-300"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={onEdit}
                className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onDelete}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white">{series.rating}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Tv className="w-4 h-4" />
              共 {series.episodeCount} 集
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Users className="w-4 h-4" />
              {series.director}
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Clock className="w-4 h-4" />
              单集 {series.duration} 分钟
            </div>
          </div>
          <p className="text-neutral-400 text-sm">{series.description}</p>
        </div>
      </div>

      <Separator className="bg-neutral-700/50" />

      {/* 种子部分暂时隐藏，因为 SeriesService 暂不提供种子关联接口 */}
      {/* 
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white flex items-center gap-2">
            <Download className="w-5 h-5" />
            种子版本
          </h3>
          <Button
            size="sm"
             disabled
            className="bg-linear-to-r from-neutral-700 to-neutral-600 text-neutral-400 cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加种子 (暂不支持)
          </Button>
        </div>
      </div> 
      */}
      <div className="p-4 bg-neutral-900/30 border border-neutral-700/50 rounded-xl text-center text-neutral-500 text-sm">
        剧集种子管理功能暂未开放。
      </div>
    </div>
  );
}
