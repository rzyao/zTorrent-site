import { useEffect, useState } from "react";
import { getOpenAPI } from "@/api/lazy";
import {
  MusicSongsService,
  MusicArtistsService,
  MusicAlbumsService,
  MusicPlaylistsService,
} from "@/api";
import type { Album, Artist, MyPlaylist, Playlist, Song } from "../types";

/**
 * 负责音乐页面的数据拉取与状态管理
 * 职责拆分：
 * - 初始化拉取：歌曲、歌手、专辑、公开歌单、我的歌单
 * - 将 Service 返回的数据归一化为页面使用的数组
 * - 提供各类数据的状态与 setter
 */
export function useMusicData() {
  const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [myPlaylists, setMyPlaylists] = useState<MyPlaylist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        await getOpenAPI();
        const [
          songsRes,
          artistsRes,
          albumsRes,
          pubPlaylistsRes,
          myPlaylistsRes,
        ] = await Promise.all([
          MusicSongsService.songsControllerList(),
          MusicArtistsService.artistsControllerList(),
          MusicAlbumsService.albumsControllerList(),
          MusicPlaylistsService.playlistsControllerListPublic(),
          MusicPlaylistsService.playlistsControllerMy(),
        ]);

        const songs =
          (songsRes as any)?.data?.items ?? (songsRes as any)?.data ?? [];
        const artistsData =
          (artistsRes as any)?.data?.items ?? (artistsRes as any)?.data ?? [];
        const albumsData =
          (albumsRes as any)?.data?.items ?? (albumsRes as any)?.data ?? [];
        const pubPlaylists =
          (pubPlaylistsRes as any)?.data?.items ??
          (pubPlaylistsRes as any)?.data ??
          [];
        const minePlaylists =
          (myPlaylistsRes as any)?.data?.items ??
          (myPlaylistsRes as any)?.data ??
          [];

        if (!mounted) return;
        setFeaturedSongs(songs);
        setArtists(artistsData);
        setAlbums(albumsData);
        setPlaylists(pubPlaylists);
        setMyPlaylists(minePlaylists);
      } catch (e) {
        if (!mounted) return;
        setError("加载音乐数据失败");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    loading,
    error,
    featuredSongs,
    setFeaturedSongs,
    artists,
    setArtists,
    albums,
    setAlbums,
    playlists,
    setPlaylists,
    myPlaylists,
    setMyPlaylists,
  };
}

