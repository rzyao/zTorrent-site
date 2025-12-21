import type { SeriesCardData } from "./types";
import { useSeriesPage } from "./hooks/useSeriesPage";
import { Toolbar } from "./components/Toolbar";
import { SeriesGrid } from "./components/SeriesGrid";
import { LoadingState, ErrorState } from "./components/States";
import { PageContainer } from "@/components/PageContainer";

export function SeriesPage() {
  const {
    series,
    genres,
    loading,
    error,
    searchQuery,
    sortBy,
    selectedGenre,
    selectedStatus,
    setSearchQuery,
    setSortBy,
    setSelectedGenre,
    setSelectedStatus,
    handleSeriesClick,
    retry,
  } = useSeriesPage();

  // 将 API 返回数据适配为卡片展示格式
  const cardSeries = series as unknown as SeriesCardData[];

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
        selectedStatus={selectedStatus}
        onChangeStatus={setSelectedStatus}
      />

      {loading && <LoadingState />}

      {error && <ErrorState error={error} onRetry={retry} />}

      {!loading && !error && (
        <SeriesGrid series={cardSeries} onOpen={(s) => handleSeriesClick(s)} />
      )}
    </PageContainer>
  );
}
