import { useState } from "react";
import { ArrowLeft, Film, Heart, Star, Eye, Calendar, Clock, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PlaylistDetail, PlaylistFilm } from "@/modules/app/pages/PlaylistDetail/types";

// ===================================
// Props & Types
// ===================================

export interface PlaylistDetailBodyProps {
  playlist: PlaylistDetail;
  movies: PlaylistFilm[];
}

// ===================================
// Sub Components (Local versions of Hero/Grid/List)
// ===================================

// 复用 Hero，移除返回逻辑与关注交互（静态展示）
// 如果需要返回按钮，可以作为 Optional Callback
function HeroSection({ playlist }: { playlist: PlaylistDetail }) {
  // 注意：在审核 Drawer 中一般不需要 "返回片单" 按钮，因为是在 Layer 上。
  // 我们只保留信息展示。

  return (
    <div className="relative w-full pt-6 pb-8 md:pt-8">
      <div className="w-full">
        {/* 标签 */}
        <div className="mb-4 flex items-center gap-3">
          {(playlist?.tags ?? []).map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-full border border-amber-500/30 bg-linear-to-r from-amber-500/20 to-orange-500/20 px-3 py-1 text-sm text-amber-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 标题 */}
        <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">{playlist?.title ?? ""}</h1>

        {/* 统计 */}
        <div className="mb-4 flex flex-wrap items-center gap-6 text-sm text-neutral-300">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-amber-500 to-orange-600 font-bold">
              {playlist?.creator?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span>{playlist?.creator ?? ""}</span>
          </div>
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            <span>{playlist?.moviesCount ?? 0} 部影片</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>{Number(playlist?.followersCount ?? 0).toLocaleString()} 关注</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{Number(playlist?.viewsCount ?? 0).toLocaleString()} 浏览</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>{typeof playlist?.rating === "number" ? playlist.rating.toFixed(1) : "0.0"}</span>
          </div>
        </div>

        {/* 描述 */}
        <p className="mb-6 max-w-4xl text-base leading-relaxed text-neutral-300">
          {playlist?.description ?? ""}
        </p>
      </div>
    </div>
  );
}

// 简化的列表展示（只读）
function MoviesList({ movies }: { movies: PlaylistFilm[] }) {
  if (!movies || movies.length === 0) return <div className="text-neutral-500">暂无影片</div>;

  return (
    <div className="space-y-2">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className="flex items-center gap-4 rounded-lg border border-neutral-700/30 bg-neutral-900/30 p-3"
        >
          {/* 序号 */}
          <div className="w-6 shrink-0 text-center font-mono text-lg text-neutral-600">
            {index + 1}
          </div>

          {/* 海报 */}
          <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded border border-neutral-700/50 bg-neutral-800/40">
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-neutral-600">
                No Img
              </div>
            )}
          </div>

          {/* 信息 */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="line-clamp-1 font-medium text-white">{movie.title}</h3>
              <span className="shrink-0 text-xs text-amber-500">{movie.rating}</span>
            </div>

            <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
              <span>{movie.year}</span>
              {movie.itemType === "series" ? (
                <span className="rounded bg-blue-900/40 px-1 text-[10px] text-blue-400">剧集</span>
              ) : (
                <span className="rounded bg-neutral-800 px-1 text-[10px] text-neutral-400">
                  电影
                </span>
              )}
              {(movie.genre || []).slice(0, 2).map((g, i) => (
                <span key={i} className="text-neutral-500">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===================================
// Main Component
// ===================================

export function PlaylistDetailBody({ playlist, movies }: PlaylistDetailBodyProps) {
  return (
    <div className="mx-auto max-w-[1400px]">
      <HeroSection playlist={playlist} />

      <div className="mt-4">
        <h2 className="mb-4 border-l-4 border-amber-500 pl-3 text-xl text-white">
          包含影片列表 ({movies.length})
        </h2>
        <MoviesList movies={movies} />
      </div>
    </div>
  );
}
