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

export default function EditSeriesPage() {
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
  const [editingEpisode, setEditingEpisode] = useState<Episode | undefined>(undefined);

  // Local state for bind dialog
  const [isBindDialogOpen, setIsBindDialogOpen] = useState(false);
  const [bindTargetEpisode, setBindTargetEpisode] = useState<Episode | undefined>(undefined);

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
    <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
              <Tv className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-end gap-1">
              <h1 className="text-3xl text-white">剧集编辑</h1>
              <p className="mt-1 text-sm text-neutral-400">管理剧集信息、分集与种子关联</p>
            </div>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            添加剧集
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
          <div className="space-y-8 rounded-2xl border border-neutral-700/50 bg-linear-to-br from-neutral-800/40 to-stone-900/40 p-6 backdrop-blur-sm md:p-8">
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

                <div className="border-t border-neutral-700/50 pt-6">
                  <h3 className="mb-4 text-lg font-medium text-white">分集管理</h3>
                  <EpisodeList
                    seriesId={selectedSeries.id}
                    episodes={episodes}
                    seriesTorrents={seriesTorrents}
                    onAdd={onAddEpisode}
                    onEdit={onEditEpisode}
                    onDelete={handleDeleteEpisode}
                    onBindTorrent={handleOpenBindDialog}
                    onUnbindTorrent={(tid, epNum) =>
                      handleUnbindTorrent(tid, selectedSeries.id, epNum)
                    }
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
                />
              </>
            )}

            {!isCreating && !isEditing && !selectedSeries && (
              <div className="py-20 text-center">
                <Tv className="mx-auto mb-4 h-16 w-16 text-neutral-600" />
                <h3 className="mb-2 text-lg text-white">选择一部剧集</h3>
                <p className="mb-6 text-sm text-neutral-400">
                  从左侧列表选择剧集进行编辑，或添加新剧集
                </p>
                <Button
                  onClick={handleCreateNew}
                  className="bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
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
