import { useEffect, useState } from "react";
import { getOpenAPI } from "@/api/lazy";
import {
  MusicSongsService,
  MusicArtistsService,
  MusicAlbumsService,
} from "@/api";
import type { Album, Artist, Song, TabType, ModalType } from "../types";

export function useMusicEditData() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    (async () => {
      await getOpenAPI();
      try {
        const [songsRes, artistsRes, albumsRes] = await Promise.all([
          MusicSongsService.songsControllerList(),
          MusicArtistsService.artistsControllerList(),
          MusicAlbumsService.albumsControllerList(),
        ]);
        const songsData = (songsRes as any)?.data?.items ?? (songsRes as any)?.data ?? [];
        const artistsData = (artistsRes as any)?.data?.items ?? (artistsRes as any)?.data ?? [];
        const albumsData = (albumsRes as any)?.data?.items ?? (albumsRes as any)?.data ?? [];
        setSongs(songsData);
        setArtists(artistsData);
        setAlbums(albumsData);
      } catch {}
    })();
  }, []);

  const reload = async (tab: TabType) => {
    await getOpenAPI();
    if (tab === "songs") {
      const res = await MusicSongsService.songsControllerList();
      setSongs((res as any)?.data?.items ?? (res as any)?.data ?? []);
    } else if (tab === "artists") {
      const res = await MusicArtistsService.artistsControllerList();
      setArtists((res as any)?.data?.items ?? (res as any)?.data ?? []);
    } else {
      const res = await MusicAlbumsService.albumsControllerList();
      setAlbums((res as any)?.data?.items ?? (res as any)?.data ?? []);
    }
  };

  const deleteItem = async (tab: TabType, id: string) => {
    await getOpenAPI();
    try {
      if (tab === "songs") {
        await MusicSongsService.songsControllerDelete();
      } else if (tab === "artists") {
        await MusicArtistsService.artistsControllerDelete();
      } else {
        await MusicAlbumsService.albumsControllerDelete();
      }
      await reload(tab);
    } catch {
      if (tab === "songs") {
        setSongs((prev) => prev.filter((s) => s.id !== id));
      } else if (tab === "artists") {
        setArtists((prev) => prev.filter((a) => a.id !== id));
      } else {
        setAlbums((prev) => prev.filter((a) => a.id !== id));
      }
    }
  };

  const saveItem = async (tab: TabType, modalType: ModalType, formData: any) => {
    await getOpenAPI();
    try {
      if (tab === "songs") {
        if (modalType === "add") {
          await MusicSongsService.songsControllerCreate();
        } else {
          await MusicSongsService.songsControllerUpdate();
        }
      } else if (tab === "artists") {
        if (modalType === "add") {
          await MusicArtistsService.artistsControllerCreate();
        } else {
          await MusicArtistsService.artistsControllerUpdate();
        }
      } else {
        if (modalType === "add") {
          await MusicAlbumsService.albumsControllerCreate();
        } else {
          await MusicAlbumsService.albumsControllerUpdate();
        }
      }
      await reload(tab);
    } catch {}
  };

  return {
    songs,
    setSongs,
    artists,
    setArtists,
    albums,
    setAlbums,
    reload,
    deleteItem,
    saveItem,
  };
}

