import { Grid, List as ListIcon, Film } from "lucide-react";
import { NativeSelect } from "@/modules/app/components/ui/native-select";
import { useLanguage } from "@/hooks/useLanguage";

interface ToolbarProps {
  sortBy: "order" | "rating" | "year";
  viewMode: "grid" | "list";
  onChangeSort: (value: "order" | "rating" | "year") => void;
  onChangeViewMode: (value: "grid" | "list") => void;
  moviesCount: number;
}



export function Toolbar({
  sortBy,
  viewMode,
  onChangeSort,
  onChangeViewMode,
  moviesCount,
}: ToolbarProps) {
  const { t } = useLanguage();

  const sortOptions = [
    { value: "order", label: t('playlists.sortDefault') },
    { value: "rating", label: t('playlists.sortByRating') },
    { value: "year", label: t('playlists.sortByYear') },
  ];

  return (
    <div className="mb-6 flex items-center justify-between">
      {/* ... (left part) ... */}
      <div className="flex items-center gap-4">
        <h2 className="flex items-center gap-2 text-2xl text-white">
          <Film className="h-6 w-6 text-amber-500" />
          {t('playlists.moviesTitle')}
        </h2>
        <span className="text-neutral-400">{t('playlists.moviesCount', { count: moviesCount })}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* 排序 */}
        <NativeSelect
          value={sortBy}
          onChange={(v) => onChangeSort(v as any)}
          options={sortOptions}
          className="w-36"
        />

        {/* 视图切换 */}
        {/* ... */}

        {/* 视图切换 */}
        <div className="flex gap-1 rounded-lg border border-neutral-700/50 bg-neutral-900/50 p-1">
          <button
            onClick={() => onChangeViewMode("grid")}
            className={`rounded p-2 transition-all ${
              viewMode === "grid"
                ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onChangeViewMode("list")}
            className={`rounded p-2 transition-all ${
              viewMode === "list"
                ? "bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20"
                : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
            }`}
          >
            <ListIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
