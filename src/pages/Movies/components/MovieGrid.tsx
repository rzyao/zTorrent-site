import type { MovieCardData } from "../types";
import { MovieCard } from "./MovieCard";
import { Film } from "lucide-react";

interface MovieGridProps {
  movies: MovieCardData[];
  onOpen: (movie: MovieCardData) => void;
  onToggleCollect?: (id: string) => void;
}

/**
 * MovieGrid
 * 负责渲染电影网格与空态
 */
export function MovieGrid({ movies, onOpen, onToggleCollect }: MovieGridProps) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onOpen}
            onToggleCollect={onToggleCollect}
          />
        ))}
      </div>

      {movies.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto mb-4">
            <Film className="w-10 h-10 text-neutral-600" />
          </div>
          <h3 className="text-white text-xl mb-2">暂无电影</h3>
          <p className="text-neutral-500 mb-6">没有找到符合条件的电影</p>
        </div>
      )}
    </>
  );
}
