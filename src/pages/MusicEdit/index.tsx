import { Edit2, Plus } from "lucide-react";
import { useMusicEditData } from "./hooks/useMusicEditData";
import { useMusicEditView } from "./hooks/useMusicEditView";
import { EditTabNav } from "./components/EditTabNav";
import { EditSearchBar } from "./components/EditSearchBar";
import { SongsTable } from "./components/SongsTable";
import { ArtistsGrid } from "./components/ArtistsGrid";
import { AlbumsGrid } from "./components/AlbumsGrid";
import { EditModal } from "./components/EditModal";

export function MusicEditPage() {
  const { songs, artists, albums, deleteItem, saveItem } = useMusicEditData();
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    modalType,
    setModalType,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    closeModal,
  } = useMusicEditView();

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16 pb-32">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Edit2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl">音乐编辑</h1>
              <p className="text-neutral-400 text-sm mt-1">管理和维护音乐库中的单曲、歌手和专辑</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <EditTabNav activeTab={activeTab} onChange={setActiveTab} />
            <div className="flex items-center gap-3">
              <EditSearchBar value={searchQuery} onChange={setSearchQuery} />
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white flex items-center gap-2 transition-all shadow-lg shadow-amber-500/30"
              >
                <Plus className="w-4 h-4" />
                新增{activeTab === "songs" ? "单曲" : activeTab === "artists" ? "歌手" : "专辑"}
              </button>
            </div>
          </div>
        </div>

        {activeTab === "songs" && (
          <SongsTable
            songs={songs}
            searchQuery={searchQuery}
            onEdit={handleEdit}
            onDelete={(id) => deleteItem(activeTab, id)}
          />
        )}
        {activeTab === "artists" && (
          <ArtistsGrid
            artists={artists}
            searchQuery={searchQuery}
            onEdit={handleEdit}
            onDelete={(id) => deleteItem(activeTab, id)}
          />
        )}
        {activeTab === "albums" && (
          <AlbumsGrid
            albums={albums}
            searchQuery={searchQuery}
            onEdit={handleEdit}
            onDelete={(id) => deleteItem(activeTab, id)}
          />
        )}
      </div>

      <EditModal
        open={!!modalType}
        tab={activeTab}
        modalType={modalType}
        formData={formData}
        onChange={setFormData}
        onCancel={closeModal}
        onSave={async () => {
          await saveItem(activeTab, modalType, formData);
          setModalType(null);
          closeModal();
        }}
      />
    </div>
  );
}

