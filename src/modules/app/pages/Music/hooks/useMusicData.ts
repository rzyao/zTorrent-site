import { useQuery } from "@tanstack/react-query";
import {
  MusicSongsService,
  MusicArtistsService,
  MusicAlbumsService,
  MusicPlaylistsService,
} from "@/api";
import type { TabType } from "../types";

/**
 * 负责音乐页面的数据拉取与状态管理
 * 职责拆分：
 * - 初始化拉取：歌曲、歌手、专辑、公开歌单、我的歌单
 * - 使用 React Query 进行数据缓存和按需加载
 */
export function useMusicData(activeTab: TabType) {
  // 1. 歌曲查询 (仅在 'hall' 或 'songs' 激活时拉取)
  const { 
    data: featuredSongs = [], 
    isLoading: loadingSongs,
    error: errorSongs 
  } = useQuery({
    queryKey: ["music", "songs"],
    queryFn: async () => {
      const res = await MusicSongsService.songsControllerList();
      return (res as any)?.data?.items ?? (res as any)?.data ?? [];
    },
    enabled: activeTab === "hall" || activeTab === "songs",
    staleTime: 5 * 60 * 1000, // 5分钟
  });

  // 2. 歌手查询 (仅在 'hall' 或 'artists' 激活时拉取)
  const { 
    data: artists = [], 
    isLoading: loadingArtists,
    error: errorArtists
  } = useQuery({
    queryKey: ["music", "artists"],
    queryFn: async () => {
      const res = await MusicArtistsService.artistsControllerList();
      return (res as any)?.data?.items ?? (res as any)?.data ?? [];
    },
    enabled: activeTab === "hall" || activeTab === "artists",
    staleTime: 5 * 60 * 1000,
  });

  // 3. 专辑查询 (仅在 'hall' 或 'albums' 激活时拉取)
  const { 
    data: albums = [], 
    isLoading: loadingAlbums,
    error: errorAlbums
  } = useQuery({
    queryKey: ["music", "albums"],
    queryFn: async () => {
      const res = await MusicAlbumsService.albumsControllerList();
      return (res as any)?.data?.items ?? (res as any)?.data ?? [];
    },
    enabled: activeTab === "hall" || activeTab === "albums",
    staleTime: 5 * 60 * 1000,
  });

  // 4. 公开歌单查询 (仅在 'hall' 或 'playlists' 激活时拉取)
  const { 
    data: playlists = [], 
    isLoading: loadingPlaylists,
    error: errorPlaylists
  } = useQuery({
    queryKey: ["music", "playlists", "public"],
    queryFn: async () => {
      const res = await MusicPlaylistsService.playlistsControllerListPublic();
      return (res as any)?.data?.items ?? (res as any)?.data ?? [];
    },
    enabled: activeTab === "hall" || activeTab === "playlists",
    staleTime: 5 * 60 * 1000,
  });

  // 5. 我的歌单 (总是预加载，因为添加歌单弹窗可能随时需要)
  const { 
    data: myPlaylists = [], 
    isLoading: loadingMyPlaylists 
  } = useQuery({
    queryKey: ["music", "playlists", "my"],
    queryFn: async () => {
      const res = await MusicPlaylistsService.playlistsControllerMy();
      return (res as any)?.data?.items ?? (res as any)?.data ?? [];
    },
    staleTime: 1 * 60 * 1000,
  });

  // 综合 loading 状态 (只计算当前 tab 需要的数据)
  const isLoading = 
    (activeTab === "hall" && (loadingSongs || loadingArtists || loadingAlbums || loadingPlaylists)) ||
    (activeTab === "songs" && loadingSongs) ||
    (activeTab === "artists" && loadingArtists) ||
    (activeTab === "albums" && loadingAlbums) ||
    (activeTab === "playlists" && loadingPlaylists);

  // 综合 error
  const error = errorSongs || errorArtists || errorAlbums || errorPlaylists;

  return {
    loading: isLoading,
    error: error ? "加载音乐数据失败" : null,
    featuredSongs,
    artists,
    albums,
    playlists,
    myPlaylists,
  };
}

