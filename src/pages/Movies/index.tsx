import type { MovieCardData } from "./types";
import { useMoviesPage } from "./hooks/useMoviesPage";
import { Toolbar } from "./components/Toolbar";
import { MovieGrid } from "./components/MovieGrid";
import { LoadingState, ErrorState } from "./components/States";
import { PageContainer } from "@/layouts/PageContainer";

export function MoviesPage() {
  const {
    movies,
    genres,
    loading,
    error,
    searchQuery,
    sortBy,
    selectedGenre,
    setSearchQuery,
    setSortBy,
    setSelectedGenre,
    handleMovieClick,
    retry,
  } = useMoviesPage();

  // 将 API 返回数据适配为卡片展示格式
  const cardMovies = movies as unknown as MovieCardData[];

  return (
    <PageContainer>
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        genres={genres}
        selectedGenre={selectedGenre}
        onChangeGenre={setSelectedGenre}
      />

      {loading && <LoadingState />}

      {error && <ErrorState error={error} onRetry={retry} />}

      {!loading && !error && (
        <MovieGrid movies={cardMovies} onOpen={(m) => handleMovieClick(m)} />
      )}
    </PageContainer>
  );
}
