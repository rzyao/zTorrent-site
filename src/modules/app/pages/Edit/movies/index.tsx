import { useState } from "react";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { ConfirmModal } from "@/modules/app/components/ConfirmModal";
import { useLanguage } from "@/hooks/useLanguage";
import { Film, Plus } from "lucide-react";
import { Button } from "@/modules/app/components/ui/button";
import { useEditMovie } from "@/modules/app/pages/Edit/movies/hooks/useEditMovie";
import { MovieList } from "@/modules/app/pages/Edit/movies/components/MovieList";
import { StatsPanel } from "@/modules/app/pages/Edit/movies/components/StatsPanel";
import { MovieForm } from "@/modules/app/pages/Edit/movies/components/MovieForm";
import { MovieDetails } from "@/modules/app/pages/Edit/movies/components/MovieDetails";
import { TorrentSearchPanel } from "@/modules/app/pages/Edit/movies/components/TorrentSearchPanel";
import { TorrentList } from "@/modules/app/pages/Edit/movies/components/TorrentList";

export default function EditMoviePage() {
  const { t } = useLanguage();
  useDynamicTitle(t("edit.movieTitle"));
  const {
    movies,
    filteredMovies,
    searchQuery,
    setSearchQuery,
    selectedMovie,
    setSelectedMovie,
    isEditing,
    setIsEditing,
    isCreating,
    setIsCreating,
    movieForm,
    setMovieForm,
    errors,
    setErrors,
    showTorrentSearch,
    setShowTorrentSearch,
    torrentSearchQuery,
    setTorrentSearchQuery,
    isSearching,
    searchResults,
    searchError,
    ptGenUrl,
    setPtGenUrl,
    ptGenLoading,
    ptGenError,
    handleCreateNew,
    handleEdit,
    handleSaveMovie,
    handleDeleteMovie,
    handleBindExistingTorrent,
    handleRemoveTorrent,
    fetchPtGenAndFill,
  } = useEditMovie();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const clearModes = () => {
    setIsEditing(false);
    setIsCreating(false);
    setShowTorrentSearch(false);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
              <Film className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-end gap-1">
              <h1 className="text-3xl text-white">{t("editMovie.pageTitle")}</h1>
              <p className="mt-1 text-sm text-neutral-400">{t("editMovie.pageDesc")}</p>
            </div>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("editMovie.addMovie")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <MovieList
            movies={movies}
            filtered={filteredMovies}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedMovie={selectedMovie}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onClearModes={clearModes}
          />
          <StatsPanel
            total={movies.length}
            filmsCount={movies.filter((m) => m.categories?.[0] === "电影").length}
            seriesCount={movies.filter((m) => m.categories?.[0] === "剧集").length}
            totalTorrents={movies.reduce((sum, m) => sum + m.torrents.length, 0)}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 p-6 backdrop-blur-sm md:p-8">
            {(isCreating || isEditing) && (
              <MovieForm
                isCreating={isCreating}
                isEditing={isEditing}
                form={movieForm}
                errors={errors}
                onChange={setMovieForm}
                onSave={handleSaveMovie}
                onCancel={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                }}
                ptGenUrl={ptGenUrl}
                onPtGenUrlChange={setPtGenUrl}
                ptGenLoading={ptGenLoading}
                ptGenError={ptGenError}
                onFetchPtGen={fetchPtGenAndFill}
              />
            )}

            {!isCreating && !isEditing && selectedMovie && (
              <>
                <MovieDetails
                  movie={selectedMovie}
                  onEdit={() => handleEdit(selectedMovie)}
                  onDelete={() => setConfirmDeleteId(selectedMovie.id)}
                  onAddTorrent={() => setShowTorrentSearch(true)}
                />
                <TorrentSearchPanel
                  visible={showTorrentSearch}
                  query={torrentSearchQuery}
                  onQueryChange={setTorrentSearchQuery}
                  isSearching={isSearching}
                  searchError={searchError}
                  results={searchResults}
                  onBind={(id) => handleBindExistingTorrent(id)}
                  onClose={() => {
                    setShowTorrentSearch(false);
                    setTorrentSearchQuery("");
                  }}
                />
                <TorrentList
                  torrents={selectedMovie.torrents}
                  onRemove={(id) => handleRemoveTorrent(id)}
                />
              </>
            )}

            {!isCreating && !isEditing && !selectedMovie && (
              <div className="py-20 text-center">
                <Film className="mx-auto mb-4 h-16 w-16 text-neutral-600" />
                <h3 className="mb-2 text-lg text-white">{t("editMovie.selectMovie")}</h3>
                <p className="mb-6 text-sm text-neutral-400">{t("editMovie.selectMovieHint")}</p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t("editMovie.addNewMovie")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        open={!!confirmDeleteId}
        onOpenChange={(v) => !v && setConfirmDeleteId(null)}
        title="确认删除影片"
        description="确定要删除这部影片吗？所有关联的种子也会被删除，此操作无法撤销。"
        onConfirm={() => {
          if (confirmDeleteId) {
            handleDeleteMovie(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
        variant="destructive"
      />
    </div>
  );
}
