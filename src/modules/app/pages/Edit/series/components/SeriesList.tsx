import { Search } from "lucide-react";
import { Badge } from "@/modules/app/components/ui/badge";
import type { Series } from "@/modules/app/pages/Edit/series/types";

interface SeriesListProps {
  seriesList: Series[];
  filtered: Series[];
  searchQuery: string;
  onSearchChange: (v: string) => void;
  selectedSeries: Series | null;
  onSelectSeries: (m: Series) => void;
  onClearModes: () => void;
}

export function SeriesList({
  seriesList,
  filtered,
  searchQuery,
  onSearchChange,
  selectedSeries,
  onSelectSeries,
  onClearModes,
}: SeriesListProps) {
  return (
    <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 overflow-hidden">
      <div className="p-4 border-b border-neutral-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索剧集..."
            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>

      <div className="p-4 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-themed">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <span className="w-12 h-12 text-neutral-600 mx-auto mb-3">
              暂无剧集
            </span>
            <p className="text-neutral-500 text-sm">暂无剧集</p>
          </div>
        ) : (
          filtered.map((series) => (
            <div
              key={series.id}
              onClick={() => {
                onSelectSeries(series);
                onClearModes();
              }}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                selectedSeries?.id === series.id
                  ? "bg-linear-to-r from-amber-500/20 to-orange-600/20 border border-amber-500/30"
                  : "bg-neutral-900/30 border border-neutral-700/50 hover:border-neutral-600"
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={series.poster || undefined}
                  alt={series.title}
                  className="w-16 h-24 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm mb-1 truncate">
                    {series.title}
                  </h3>
                  <p className="text-neutral-400 text-xs mb-2 truncate">
                    {series.originalTitle}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                      {series.categories?.[0] || "Uncategorized"}
                    </Badge>
                    {/* 剧集特定信息：状态 */}
                    <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                      {series.status}
                    </Badge>
                    <span className="text-neutral-500 text-xs">
                      {series.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 text-xs">
                      {series.rating}
                    </span>
                    <span className="text-neutral-500 text-xs">
                      {series.episodeCount} 集
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
