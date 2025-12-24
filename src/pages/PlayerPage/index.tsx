import type { Song, Album, Playlist, PlayMode, LibraryView, DetailTab } from "@/pages/PlayerPage/types";
import { formatTime } from "@/pages/PlayerPage/utils";
import { usePlayer } from "@/pages/PlayerPage/hooks/usePlayer";
// 采用别名避免与本文件内同名旧组件冲突，确保使用抽离后的纯展示组件
import { PageHeader as PageHeaderExt } from "@/pages/PlayerPage/components/PageHeader";
import { LibrarySidebar as LibrarySidebarExt } from "@/pages/PlayerPage/components/LibrarySidebar";
import { LikedSongsView as LikedSongsViewExt } from "@/pages/PlayerPage/components/LikedSongsView";
import { AlbumsView as AlbumsViewExt } from "@/pages/PlayerPage/components/AlbumsView";
import { PlaylistsView as PlaylistsViewExt } from "@/pages/PlayerPage/components/PlaylistsView";
import { PlaylistDetailView as PlaylistDetailViewExt } from "@/pages/PlayerPage/components/PlaylistDetailView";
// 新增：引入已拆分的底部控制栏与播放详情组件
import { PlayerBar } from "@/pages/PlayerPage/components/PlayerBar";
import { PlayerDetail } from "@/pages/PlayerPage/components/PlayerDetail";
import { CreatePlaylistModal } from "@/pages/PlayerPage/components/CreatePlaylistModal";
import { AddToPlaylistModal } from "@/pages/PlayerPage/components/AddToPlaylistModal";

/** 类型已移至 '@/pages/PlayerPage/types' */

/** 类型已移至 '@/pages/PlayerPage/types' */

/** 类型已移至 '@/pages/PlayerPage/types' */

/** 类型已移至 '@/pages/PlayerPage/types' */

/** 工具函数已移至 '@/pages/PlayerPage/utils' */

export default function PlayerPage() {
  const {
    songs,
    myAlbums,
    myPlaylists,
    likedSongs,
    similarList,
    currentSong,
    currentSongIndex,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    playMode,
    libraryView,
    selectedPlaylistId,
    detailTab,
    lyrics,
    comments,
    showPlayerDetail,
    showCreatePlaylist,
    showAddToPlaylist,
    selectedSongForAdd,
    newPlaylistName,
    newPlaylistDesc,
    setLibraryView,
    setSelectedPlaylistId,
    setShowPlayerDetail,
    setShowCreatePlaylist,
    setShowAddToPlaylist,
    setSelectedSongForAdd,
    setNewPlaylistName,
    setNewPlaylistDesc,
    setDetailTab,
    handleSongSelect,
    toggleLike,
    handleCreatePlaylist,
    handleAddToPlaylist,
    handleRemoveFromPlaylist,
    handleDeletePlaylist,
    openAddToPlaylist,
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleProgressClick,
    handleVolumeChange,
    toggleMute,
    cyclePlayMode,
    getPlayModeText,
  } = usePlayer();

  // 以上副作用与状态管理已抽离至 usePlayer

  // 播放模式文案由 usePlayer 提供，UI 仅消费，不在此处计算

  const likedSongsList = songs.filter((s) => likedSongs.includes(s.id));

  const renderLibraryContent = () => {
    if (libraryView === "liked") {
      return (
        <LikedSongsViewExt
          likedSongsList={likedSongsList}
          onSelectSongById={(id) => handleSongSelect(songs.findIndex((s) => s.id === id))}
          onToggleLike={toggleLike}
          onOpenAddToPlaylist={openAddToPlaylist}
        />
      );
    }

    if (libraryView === "albums") {
      return <AlbumsViewExt albums={myAlbums} />;
    }

    if (libraryView === "playlists") {
      return (
        <PlaylistsViewExt
          playlists={myPlaylists}
          onCreate={() => setShowCreatePlaylist(true)}
          onOpen={(playlistId) => {
            setSelectedPlaylistId(playlistId);
            setLibraryView("playlist-detail");
          }}
          onDelete={handleDeletePlaylist}
        />
      );
    }

    if (libraryView === "playlist-detail" && selectedPlaylistId) {
      const playlist = myPlaylists.find((p) => p.id === selectedPlaylistId);
      if (!playlist) return null;

      return (
        <PlaylistDetailViewExt
          playlist={playlist}
          onBack={() => {
            setLibraryView("playlists");
            setSelectedPlaylistId(null);
          }}
          onSelectSong={(songId) => handleSongSelect(songs.findIndex((s) => s.id === songId))}
          onRemove={(songId) => handleRemoveFromPlaylist(playlist.id, songId)}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-900 via-stone-900 to-neutral-950 pt-16 pb-32">
      <div className="mx-auto max-w-[1800px] px-4 py-8 md:px-8">
        <PageHeaderExt />

        <div className="flex gap-6">
          <LibrarySidebarExt
            view={libraryView}
            likedCount={likedSongsList.length}
            albumsCount={myAlbums.length}
            playlistsCount={myPlaylists.length}
            onSelectLiked={() => setLibraryView("liked")}
            onSelectAlbums={() => setLibraryView("albums")}
            onSelectPlaylists={() => {
              setLibraryView("playlists");
              setSelectedPlaylistId(null);
            }}
          />

          {/* 右侧：音乐库内容 */}
          <div className="flex-1">{renderLibraryContent()}</div>
        </div>
      </div>

      {/* 底部播放控制栏 */}
      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={currentSong?.duration || 0}
        volume={volume}
        isMuted={isMuted}
        playMode={playMode}
        isCurrentLiked={likedSongs.includes(currentSong?.id || '')}
        onOpenDetail={() => setShowPlayerDetail(true)}
        onToggleLike={() => currentSong && toggleLike(currentSong.id)}
        onProgressClick={handleProgressClick}
        onPlayPause={handlePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onCyclePlayMode={cyclePlayMode}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        getPlayModeText={getPlayModeText}
        formatTime={formatTime}
      />

      {/* 播放详情页 - 黑胶唱片布局 */}
      <PlayerDetail
        isOpen={showPlayerDetail}
        onClose={() => setShowPlayerDetail(false)}
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={currentSong?.duration || 0}
        volume={volume}
        isMuted={isMuted}
        playMode={playMode}
        isCurrentLiked={likedSongs.includes(currentSong?.id || '')}
        lyrics={lyrics}
        comments={comments}
        detailTab={detailTab}
        similarList={similarList}
        songs={songs}
        onToggleLike={() => currentSong && toggleLike(currentSong.id)}
        onProgressClick={handleProgressClick}
        onPlayPause={handlePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onCyclePlayMode={cyclePlayMode}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        getPlayModeText={getPlayModeText}
        setDetailTab={setDetailTab}
        onSelectSongById={(songId) => handleSongSelect(songs.findIndex((s) => s.id === songId))}
      />
      <CreatePlaylistModal
        isOpen={showCreatePlaylist}
        onClose={() => {
          setShowCreatePlaylist(false);
          setNewPlaylistName("");
          setNewPlaylistDesc("");
        }}
        name={newPlaylistName}
        desc={newPlaylistDesc}
        onNameChange={setNewPlaylistName}
        onDescChange={setNewPlaylistDesc}
        onCreate={handleCreatePlaylist}
      />

      <AddToPlaylistModal
        isOpen={!!(showAddToPlaylist && selectedSongForAdd)}
        onClose={() => {
          setShowAddToPlaylist(false);
          setSelectedSongForAdd(null);
        }}
        song={selectedSongForAdd as Song}
        playlists={myPlaylists}
        onAdd={(playlistId) => handleAddToPlaylist(playlistId)}
        onCreateNew={() => {
          setShowAddToPlaylist(false);
          setShowCreatePlaylist(true);
        }}
      />
    </div>
  );
}
