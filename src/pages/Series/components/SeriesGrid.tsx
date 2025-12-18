import type { SeriesCardData } from "../types";
import { SeriesCard } from "./SeriesCard";
import { Tv } from "lucide-react";

interface SeriesGridProps {
  series: SeriesCardData[];
  onOpen: (series: SeriesCardData) => void;
  onToggleCollect?: (id: string) => void;
}

/**
 * SeriesGrid
 * 负责渲染剧集网格与空态
 */
export function SeriesGrid({
  series,
  onOpen,
  onToggleCollect,
}: SeriesGridProps) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {series.map((item) => (
          <SeriesCard
            key={item.id}
            series={item}
            onClick={onOpen}
            onToggleCollect={onToggleCollect}
          />
        ))}
      </div>

      {series.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto mb-4">
            <Tv className="w-10 h-10 text-neutral-600" />
          </div>
          <h3 className="text-white text-xl mb-2">暂无剧集</h3>
          <p className="text-neutral-500 mb-6">没有找到符合条件的剧集</p>
        </div>
      )}
    </>
  );
}
