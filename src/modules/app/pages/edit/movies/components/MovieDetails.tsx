import { Button } from "@/modules/app/components/ui/button";
import { Badge } from "@/modules/app/components/ui/badge";
import { Separator } from "@/modules/app/components/ui/separator";
import {
  Edit,
  Trash2,
  Star,
  Clock,
  Users,
  Video,
  Download,
  Plus,
} from "lucide-react";
import type { Movie } from "@/modules/app/pages/Edit/movies/types";

interface MovieDetailsProps {
  movie: Movie;
  onEdit: () => void;
  onDelete: () => void;
  onAddTorrent: () => void;
}

export function MovieDetails({
  movie,
  onEdit,
  onDelete,
  onAddTorrent,
}: MovieDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <img
          src={movie.poster || undefined}
          alt={movie.title}
          className="w-32 h-48 rounded-xl object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-white text-2xl mb-1">{movie.title}</h2>
              <p className="text-neutral-400 text-sm mb-3">
                {movie.originalTitle} ({movie.year})
              </p>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-amber-500/20 text-amber-400">
                  {movie.categories?.[0] || "Uncategorized"}
                </Badge>
                {movie.genres.map((genre) => (
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
              <span className="text-white">{movie.rating}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Clock className="w-4 h-4" />
              {movie.duration}
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Users className="w-4 h-4" />
              {movie.director}
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Video className="w-4 h-4" />
              {movie.torrents.length} 个版本
            </div>
          </div>
          <p className="text-neutral-400 text-sm">{movie.description}</p>
        </div>
      </div>

      <Separator className="bg-neutral-700/50" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white flex items-center gap-2">
            <Download className="w-5 h-5" />
            种子版本
          </h3>
          <Button
            size="sm"
            onClick={onAddTorrent}
            className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加种子
          </Button>
        </div>
      </div>
    </div>
  );
}
