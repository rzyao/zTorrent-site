import { useState } from "react";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { Tv, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditSeries } from "@/pages/Edit/series/hooks/useEditSeries";
import { SeriesList } from "@/pages/Edit/series/components/SeriesList";
import { StatsPanel } from "@/pages/Edit/series/components/StatsPanel";
import { SeriesForm } from "@/pages/Edit/series/components/SeriesForm";
import { SeriesDetails } from "@/pages/Edit/series/components/SeriesDetails";
import { EpisodeList } from "@/pages/Edit/series/components/EpisodeList";
import { EpisodeForm } from "@/pages/Edit/series/components/EpisodeForm";
import { BindTorrentDialog } from "@/pages/Edit/series/components/BindTorrentDialog";
import type { Episode } from "@/pages/Edit/series/types";

export function EditSeriesPage() {
  useDynamicTitle("剧集编辑");
  const {
    seriesList,
    filteredSeries,
    searchQuery,
    setSearchQuery,
    selectedSeries,
    setSelectedSeries,
    isEditing,
    setIsEditing,
    isCreating,
    setIsCreating,
    seriesForm,
    setSeriesForm,
    errors,
    setErrors,
    ptGenUrl,
    setPtGenUrl,
    ptGenLoading,
    ptGenError,
    fetchPtGenAndFill,
    handleCreateNew,
    handleEdit,
    handleSaveSeries,
    handleDeleteSeries,
    // New
    episodes,
    seriesTorrents,
    fetchEpisodes,
    fetchSeriesTorrents,
    handleCreateEpisode,
    handleUpdateEpisode,
    handleDeleteEpisode,
    handleBindTorrent,
    handleUnbindTorrent,
    searchTorrents,
  } = useEditSeries();

  const clearModes = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  // Local state for episode editing
  const [isEpisodeFormOpen, setIsEpisodeFormOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | undefined>(
    undefined
  );

  // Local state for bind dialog
  const [isBindDialogOpen, setIsBindDialogOpen] = useState(false);
  const [bindTargetEpisode, setBindTargetEpisode] = useState<
    Episode | undefined
  >(undefined);

  const onAddEpisode = () => {
    setEditingEpisode(undefined);
    setIsEpisodeFormOpen(true);
  };

  const onEditEpisode = (ep: Episode) => {
    setEditingEpisode(ep);
    setIsEpisodeFormOpen(true);
  };

  const onEpisodeSubmit = async (data: any) => {
    if (editingEpisode) {
      await handleUpdateEpisode(data);
    } else {
      await handleCreateEpisode(data);
    }
  };

  const handleOpenBindDialog = (targetEpisode?: Episode) => {
    setBindTargetEpisode(targetEpisode);
    setIsBindDialogOpen(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-end gap-1">
              <h1 className="text-white text-3xl">剧集编辑</h1>
              <p className="text-neutral-400 text-sm mt-1">
                管理剧集信息、分集与种子关联
              </p>
            </div>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加剧集
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SeriesList
            seriesList={seriesList}
            filtered={filteredSeries}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSeries={selectedSeries}
            onSelectSeries={(s) => {
              setSelectedSeries(s);
              setIsEpisodeFormOpen(false);
            }}
            onClearModes={clearModes}
          />
          <StatsPanel total={seriesList.length} />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-neutral-800/40 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 md:p-8 space-y-8">
            {(isCreating || isEditing) && (
              <SeriesForm
                isCreating={isCreating}
                isEditing={isEditing}
                form={seriesForm}
                errors={errors}
                onChange={setSeriesForm}
                onSave={handleSaveSeries}
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

            {!isCreating && !isEditing && selectedSeries && (
              <>
                <SeriesDetails
                  series={selectedSeries}
                  onEdit={() => handleEdit(selectedSeries)}
                  onDelete={() => handleDeleteSeries(selectedSeries.id)}
                />

                <div className="pt-6 border-t border-neutral-700/50">
                  <h3 className="text-lg font-medium text-white mb-4">
                    分集管理
                  </h3>
                  <EpisodeList
                    seriesId={selectedSeries.id}
                    episodes={episodes}
                    seriesTorrents={seriesTorrents}
                    onAdd={onAddEpisode}
                    onEdit={onEditEpisode}
                    onDelete={handleDeleteEpisode}
                    onBindTorrent={handleOpenBindDialog}
                  />
                </div>

                <EpisodeForm
                  seriesId={selectedSeries.id}
                  initialData={editingEpisode}
                  isOpen={isEpisodeFormOpen}
                  onClose={() => setIsEpisodeFormOpen(false)}
                  onSubmit={onEpisodeSubmit}
                />

                <BindTorrentDialog
                  isOpen={isBindDialogOpen}
                  onClose={() => setIsBindDialogOpen(false)}
                  targetEpisode={
                    bindTargetEpisode
                      ? {
                          id: bindTargetEpisode.id,
                          episodeNumber: bindTargetEpisode.episodeNumber,
                          title: bindTargetEpisode.title,
                        }
                      : undefined
                  }
                  searchTorrents={searchTorrents}
                  onBind={async (tid, epNum) => {
                    await handleBindTorrent(selectedSeries.id, tid, epNum);
                  }}
                  boundTorrentIds={seriesTorrents.map((t) => t.torrentId)}
                />
              </>
            )}

            {!isCreating && !isEditing && !selectedSeries && (
              <div className="text-center py-20">
                <Tv className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-white text-lg mb-2">选择一部剧集</h3>
                <p className="text-neutral-400 text-sm mb-6">
                  从左侧列表选择剧集进行编辑，或添加新剧集
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加新剧集
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
