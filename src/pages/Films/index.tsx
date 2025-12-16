import { Film } from "lucide-react";
import type { FilmCardData } from "./types";
import { useFilmsPage } from "./hooks/useFilmsPage";
import { Toolbar } from "./components/Toolbar";
import { MovieGrid } from "./components/MovieGrid";
import { LoadingState, ErrorState } from "./components/States";
import { PageContainer } from "@/layouts/PageContainer";

export function FilmsPage() {
  const {
    movies,
    genres,
    loading,
    error,
    activeTab,
    searchQuery,
    sortBy,
    selectedGenre,
    setActiveTab,
    setSearchQuery,
    setSortBy,
    setSelectedGenre,
    handleCollectToggle,
    handleMovieClick,
    retry,
  } = useFilmsPage();
  const cardMovies = movies as unknown as FilmCardData[];

  return (
    <PageContainer>
      {/* 页面标题 */}
      {/* Mobile Adaption: Adjusted layout for mobile (flex-col) and spacing */}
      {/* <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 hidden md:block">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Film className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-white text-2xl md:text-3xl font-bold">
                影片浏览
              </h1>
            </div>
            <p className="text-neutral-400 text-sm md:text-base ml-1 md:ml-13">
              发现和收藏优质影片资源
            </p>
          </div>
        </div> */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy as any}
        onSortChange={setSortBy as any}
        genres={genres as any}
        selectedGenre={selectedGenre}
        onChangeGenre={setSelectedGenre}
      />

      {loading && <LoadingState />}

      {error && <ErrorState error={error} onRetry={retry} />}

      {!loading && !error && (
        <MovieGrid
          movies={cardMovies}
          onOpen={(m) => handleMovieClick(m as any)}
          onToggleCollect={handleCollectToggle}
        />
      )}
    </PageContainer>
  );
}
