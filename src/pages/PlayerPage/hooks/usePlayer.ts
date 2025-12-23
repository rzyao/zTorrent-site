import { useEffect, useMemo, useState } from 'react';
import type { Song, Album, Playlist, PlayMode, LibraryView, DetailTab } from '@/pages/PlayerPage/types';

/**
 * usePlayer
 * 将 PlayerPage 的业务状态与副作用、事件处理抽离为自定义 Hook
 * 目标：
 * - 聚合播放器相关状态（播放、音量、模式、进度）
 * - 管理音乐库数据（歌曲、专辑、歌单、点赞）
 * - 提供纯逻辑的操作方法，UI 通过回调交互
 */
export function usePlayer() {
  /** 数据层：音乐内容集合 */
  const [songs, setSongs] = useState<Song[]>([]);
  const [myAlbums, setMyAlbums] = useState<Album[]>([]);
  const [myPlaylists, setMyPlaylists] = useState<Playlist[]>([]);

  /** 播放器状态 */
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>('sequence');

  /** 交互与视图状态 */
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [libraryView, setLibraryView] = useState<LibraryView>('liked');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  /** 弹窗与表单状态 */
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [selectedSongForAdd, setSelectedSongForAdd] = useState<Song | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  /** 播放详情页状态 */
  const [showPlayerDetail, setShowPlayerDetail] = useState(false);
  const [detailTab, setDetailTab] = useState<DetailTab>('lyrics');
  const [lyrics, setLyrics] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [similar, setSimilar] = useState<Song[]>([]);

  /** 派生数据：当前歌曲 */
  const currentSong = useMemo(() => songs[currentSongIndex], [songs, currentSongIndex]);

  /** 首屏加载：获取歌曲、专辑、我的歌单 */
  useEffect(() => {
    (async () => {
      const { listSongs, listAlbums, listMyPlaylists } = await import('@/api/adapters/music');
      try {
        const [songsRes, albumsRes, myPlaylistsRes] = await Promise.all([
          listSongs({ page: 1, pageSize: 50 }),
          listAlbums({ page: 1, pageSize: 50 }),
          listMyPlaylists({ page: 1, pageSize: 50 }),
        ]);
        const songsData = (songsRes as any)?.data?.items ?? (songsRes as any)?.data ?? [];
        const albumsData = (albumsRes as any)?.data?.items ?? (albumsRes as any)?.data ?? [];
        const minePlaylists = (myPlaylistsRes as any)?.data?.items ?? (myPlaylistsRes as any)?.data ?? [];
        setSongs(songsData);
        setMyAlbums(albumsData);
        setMyPlaylists(minePlaylists);
        setLikedSongs((songsData || []).filter((s: any) => s?.liked).map((s: any) => s?.id));
      } catch { }
    })();
  }, []);

  /** 播放进度计时器与自动切歌逻辑 */
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const duration = currentSong?.duration || 0;
          if (duration > 0 && prev >= duration) {
            if (songs.length === 0) return 0;
            if (playMode === 'shuffle') {
              const randomIndex = Math.floor(Math.random() * songs.length);
              setCurrentSongIndex(randomIndex);
            } else if (playMode === 'sequence') {
              setCurrentSongIndex((idx) => (idx + 1) % songs.length);
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSong, isPlaying, playMode, songs.length]);

  /** 详情页的数据获取：歌词/评论/相似歌曲 */
  useEffect(() => {
    (async () => {
      const { getLyrics, listComments, getSimilarSongs } = await import('@/api/adapters/music');
      try {
        if (detailTab === 'lyrics' && currentSong?.id) {
          const res = await getLyrics({ songId: currentSong.id, lang: 'zh-CN' });
          const data = (res as any)?.data ?? null;
          setLyrics(data);
        }
        if (detailTab === 'comments' && currentSong?.id) {
          const res = await listComments({ songId: currentSong.id, page: 1, pageSize: 20 });
          const items = (res as any)?.data?.items ?? (res as any)?.data ?? [];
          setComments(items);
        }
        if (detailTab === 'similar' && currentSong?.id) {
          const res = await getSimilarSongs({ songId: currentSong.id, limit: 20 });
          const items = (res as any)?.data?.items ?? (res as any)?.data ?? [];
          setSimilar(items);
        }
      } catch { }
    })();
  }, [detailTab, currentSong?.id]);

  /** 业务操作：切歌 */
  const handleSongSelect = (index: number) => {
    if (index < 0 || index >= songs.length) return;
    setCurrentSongIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  /** 业务操作：点赞/取消点赞 */
  const toggleLike = (songId: string) => {
    setLikedSongs((prev) => {
      const isLiked = prev.includes(songId);
      const next = isLiked ? prev.filter((id) => id !== songId) : [...prev, songId];

      (async () => {
        const { likeSong, unlikeSong } = await import('@/api/adapters/music');
        try {
          if (isLiked) {
            await unlikeSong({ songId });
          } else {
            await likeSong({ songId });
          }
        } catch { }
      })();

      return next;
    });
  };

  /** 业务操作：新建歌单 */
  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;

    const tempPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      title: newPlaylistName,
      description: newPlaylistDesc,
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      songs: [],
      isOwn: true,
      creator: '我',
    };

    (async () => {
      const { createPlaylist, listMyPlaylists } = await import('@/api/adapters/music');
      try {
        await createPlaylist({ title: newPlaylistName, description: newPlaylistDesc });
        const res = await listMyPlaylists({ page: 1, pageSize: 50 });
        const mine = (res as any)?.data?.items ?? (res as any)?.data ?? [];
        setMyPlaylists(mine);
      } catch {
        setMyPlaylists((prev) => [...prev, tempPlaylist]);
      }
    })();
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setShowCreatePlaylist(false);
  };

  /** 业务操作：添加歌曲到歌单 */
  const handleAddToPlaylist = (playlistId: string) => {
    if (!selectedSongForAdd) return;

    (async () => {
      const { addSongToPlaylist, listMyPlaylists } = await import('@/api/adapters/music');
      try {
        await addSongToPlaylist({ playlistId, songId: selectedSongForAdd.id });
        const res = await listMyPlaylists({ page: 1, pageSize: 50 });
        const mine = (res as any)?.data?.items ?? (res as any)?.data ?? [];
        setMyPlaylists(mine);
      } catch {
        setMyPlaylists((prev) =>
          prev.map((playlist) => {
            if (playlist.id === playlistId && playlist.isOwn) {
              if (!playlist.songs.find((s) => s.id === selectedSongForAdd.id)) {
                return {
                  ...playlist,
                  songs: [...playlist.songs, selectedSongForAdd],
                };
              }
            }
            return playlist;
          })
        );
      }
    })();

    setShowAddToPlaylist(false);
    setSelectedSongForAdd(null);
  };

  /** 业务操作：从歌单移除歌曲 */
  const handleRemoveFromPlaylist = (playlistId: string, songId: string) => {
    (async () => {
      const { removeSongFromPlaylist, listMyPlaylists } = await import('@/api/adapters/music');
      try {
        await removeSongFromPlaylist({ playlistId, songId });
        const res = await listMyPlaylists({ page: 1, pageSize: 50 });
        const mine = (res as any)?.data?.items ?? (res as any)?.data ?? [];
        setMyPlaylists(mine);
      } catch {
        setMyPlaylists((prev) =>
          prev.map((playlist) => {
            if (playlist.id === playlistId && playlist.isOwn) {
              return {
                ...playlist,
                songs: playlist.songs.filter((s) => s.id !== songId),
              };
            }
            return playlist;
          })
        );
      }
    })();
  };

  /** 业务操作：删除歌单 */
  const handleDeletePlaylist = (playlistId: string) => {
    (async () => {
      const { deletePlaylist, listMyPlaylists } = await import('@/api/adapters/music');
      try {
        await deletePlaylist({ playlistId });
        const res = await listMyPlaylists({ page: 1, pageSize: 50 });
        const mine = (res as any)?.data?.items ?? (res as any)?.data ?? [];
        setMyPlaylists(mine);
      } catch {
        setMyPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      }
    })();
    if (selectedPlaylistId === playlistId) {
      setLibraryView('playlists');
      setSelectedPlaylistId(null);
    }
  };

  /** 打开“添加到歌单”弹窗 */
  const openAddToPlaylist = (song: Song) => {
    setSelectedSongForAdd(song);
    setShowAddToPlaylist(true);
  };

  /** 播放器操作：播放/暂停 */
  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  /** 播放器操作：下一首 */
  const handleNext = () => {
    if (songs.length === 0) return;
    if (playMode === 'shuffle') {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongIndex(randomIndex);
    } else if (playMode === 'repeat') {
      setCurrentTime(0);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    }
    setCurrentTime(0);
  };

  /** 播放器操作：上一首或重置进度 */
  const handlePrevious = () => {
    if (songs.length === 0) return;
    if (currentTime > 3) {
      setCurrentTime(0);
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
      setCurrentTime(0);
    }
  };

  /** 播放器操作：点击进度条跳转 */
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentSong) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = rect.width === 0 ? 0 : clickX / rect.width;
    setCurrentTime(Math.max(0, percentage) * (currentSong?.duration || 0));
  };

  /** 播放器操作：音量变化 */
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  /** 播放器操作：静音切换 */
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  /** 播放器操作：播放模式切换 */
  const cyclePlayMode = () => {
    const modes: PlayMode[] = ['sequence', 'shuffle', 'repeat'];
    const currentIndex = modes.indexOf(playMode);
    setPlayMode(modes[(currentIndex + 1) % modes.length]);
  };

  /** 辅助：播放模式文案 */
  const getPlayModeText = () => {
    switch (playMode) {
      case 'shuffle':
        return '随机播放';
      case 'repeat':
        return '单曲循环';
      default:
        return '顺序播放';
    }
  };

  /** 相似推荐列表（空数据时兜底为除当前歌曲外的所有） */
  const similarList = useMemo(() => (
    similar.length > 0 ? similar : songs.filter((s) => s.id !== (currentSong?.id || ''))
  ), [similar, songs, currentSong?.id]);

  return {
    // 数据
    songs,
    myAlbums,
    myPlaylists,
    likedSongs,
    similarList,

    // 播放器状态
    currentSong,
    currentSongIndex,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    playMode,

    // 视图状态
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

    // setter（给容器使用）
    setLibraryView,
    setSelectedPlaylistId,
    setShowPlayerDetail,
    setShowCreatePlaylist,
    setShowAddToPlaylist,
    setSelectedSongForAdd,
    setNewPlaylistName,
    setNewPlaylistDesc,
    setDetailTab,

    // 业务动作
    handleSongSelect,
    toggleLike,
    handleCreatePlaylist,
    handleAddToPlaylist,
    handleRemoveFromPlaylist,
    handleDeletePlaylist,
    openAddToPlaylist,

    // 播放器动作
    handlePlayPause,
    handleNext,
    handlePrevious,
    handleProgressClick,
    handleVolumeChange,
    toggleMute,
    cyclePlayMode,
    getPlayModeText,
  } as const;
}

