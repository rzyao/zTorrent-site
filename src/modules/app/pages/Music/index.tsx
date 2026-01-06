import { Music } from "lucide-react";
import { useMusicData } from "./hooks/useMusicData";
import { useMusicInteractions } from "./hooks/useMusicInteractions";
import { useViewState } from "./hooks/useViewState";
import { SearchBar } from "./components/SearchBar";
import { TabNav } from "./components/TabNav";
import { ViewToggle } from "./components/ViewToggle";
import { HallSection } from "./components/HallSection";
import { SongsSection } from "./components/SongsSection";
import { ArtistsSection } from "./components/ArtistsSection";
import { AlbumsSection } from "./components/AlbumsSection";
import { PlaylistsSection } from "./components/PlaylistsSection";
import { AddToPlaylistModal } from "./components/AddToPlaylistModal";

export default function MusicPage() {
  const { activeTab, setActiveTab, viewMode, setViewMode, searchQuery, deferredSearchQuery, setSearchQuery } =
    useViewState();
  const {
    loading,
    error,
    featuredSongs,
    artists,
    albums,
    playlists,
    myPlaylists,
  } = useMusicData(activeTab);
  const {
    likedSongs,
    favoriteAlbums,
    favoritePlaylists,
    toggleLike,
    toggleFavoriteAlbum,
    toggleFavoritePlaylist,
    showAddToPlaylist,
    selectedSongForAdd,
    openAddToPlaylist,
    closeAddToPlaylist,
    handleAddToPlaylist,
  } = useMusicInteractions();

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16 pb-32">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white text-3xl">音乐</h1>
                <p className="text-neutral-400 text-sm mt-1">发现你喜欢的音乐，探索无限可能</p>
              </div>
            </div>
            {/* 搜索框 */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Tab导航 + 视图切换 */}
          <div className="flex items-center justify-between">
            <TabNav activeTab={activeTab} onChange={setActiveTab} />
            <ViewToggle activeTab={activeTab} viewMode={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {/* 内容区域 */}
        {activeTab === "hall" && (
          <HallSection
            featuredSongs={featuredSongs}
            artists={artists}
            albums={albums}
            playlists={playlists}
            likedSongs={likedSongs}
            favoriteAlbums={favoriteAlbums}
            favoritePlaylists={favoritePlaylists}
            toggleLike={toggleLike}
            toggleFavoriteAlbum={toggleFavoriteAlbum}
            toggleFavoritePlaylist={toggleFavoritePlaylist}
            openAddToPlaylist={openAddToPlaylist}
          />
        )}
        {activeTab === "songs" && (
          <SongsSection
            songs={featuredSongs}
            viewMode={viewMode}
            likedSongs={likedSongs}
            toggleLike={toggleLike}
            openAddToPlaylist={openAddToPlaylist}
          />
        )}
        {activeTab === "artists" && <ArtistsSection artists={artists} viewMode={viewMode} />}
        {activeTab === "albums" && (
          <AlbumsSection
            albums={albums}
            viewMode={viewMode}
            favoriteAlbums={favoriteAlbums}
            toggleFavoriteAlbum={toggleFavoriteAlbum}
          />
        )}
        {activeTab === "playlists" && (
          <PlaylistsSection
            playlists={playlists}
            viewMode={viewMode}
            favoritePlaylists={favoritePlaylists}
            toggleFavoritePlaylist={toggleFavoritePlaylist}
          />
        )}
      </div>

      {/* 添加到歌单对话框 */}
      <AddToPlaylistModal
        open={showAddToPlaylist}
        song={selectedSongForAdd}
        myPlaylists={myPlaylists}
        onClose={closeAddToPlaylist}
        onAdd={(playlistId) => handleAddToPlaylist(playlistId, myPlaylists)}
      />
    </div>
  );
}

