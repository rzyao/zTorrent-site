import { useDynamicTitle } from "@/hooks/useDynamicTitle";
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
  useDynamicTitle("影片编辑");
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

  const clearModes = () => {
    setIsEditing(false);
    setIsCreating(false);
    setShowTorrentSearch(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-end gap-1">
              <h1 className="text-white text-3xl">影片编辑</h1>
              <p className="text-neutral-400 text-sm mt-1">
                管理影片信息和关联的种子版本
              </p>
            </div>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加影片
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            filmsCount={
              movies.filter((m) => m.categories?.[0] === "电影").length
            }
            seriesCount={
              movies.filter((m) => m.categories?.[0] === "剧集").length
            }
            totalTorrents={movies.reduce(
              (sum, m) => sum + m.torrents.length,
              0
            )}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-linear-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 md:p-8">
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
                  onDelete={() => handleDeleteMovie(selectedMovie.id)}
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
              <div className="text-center py-20">
                <Film className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-white text-lg mb-2">选择一部影片</h3>
                <p className="text-neutral-400 text-sm mb-6">
                  从左侧列表选择影片进行编辑，或添加新影片
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加新影片
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
