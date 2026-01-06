import { useState } from "react";
import type { MyPlaylist, Song } from "../types";

/**
 * 负责页面交互相关的本地状态与动作
 * - 喜欢单曲、收藏专辑/歌单
 * - “添加到歌单”模态框的显隐与选择
 * - 将来可扩展为与全局播放器状态对接
 */
export function useMusicInteractions() {
  // 喜欢/收藏状态仅做本地交互演示，真实项目应持久化到后端
  const [likedSongs, setLikedSongs] = useState<string[]>(["1", "3"]);
  const [favoriteAlbums, setFavoriteAlbums] = useState<string[]>(["1"]);
  const [favoritePlaylists, setFavoritePlaylists] = useState<string[]>(["1"]);

  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [selectedSongForAdd, setSelectedSongForAdd] = useState<Song | null>(
    null,
  );

  const toggleLike = (songId: string) => {
    setLikedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId],
    );
  };

  const toggleFavoriteAlbum = (albumId: string) => {
    setFavoriteAlbums((prev) =>
      prev.includes(albumId) ? prev.filter((id) => id !== albumId) : [...prev, albumId],
    );
  };

  const toggleFavoritePlaylist = (playlistId: string) => {
    setFavoritePlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId],
    );
  };

  const openAddToPlaylist = (song: Song) => {
    setSelectedSongForAdd(song);
    setShowAddToPlaylist(true);
  };

  const closeAddToPlaylist = () => {
    setShowAddToPlaylist(false);
    setSelectedSongForAdd(null);
  };

  const handleAddToPlaylist = (playlistId: string, myPlaylists: MyPlaylist[]) => {
    // 与播放器页面的状态同步：此处仅演示
    console.log(`添加歌曲 ${selectedSongForAdd?.title} 到歌单 ${playlistId}`);
    closeAddToPlaylist();
  };

  return {
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
  };
}

