/**
 * 类型定义：播放器页面涉及的核心实体与枚举
 * 将原先在 PlayerPage.tsx 内联的类型抽离，便于共享与复用
 */
export interface Song {
  /** 唯一 ID */
  id: string;
  /** 歌曲标题 */
  title: string;
  /** 演唱者 */
  artist: string;
  /** 所属专辑 */
  album: string;
  /** 时长（秒） */
  duration: number;
  /** 封面图片 URL */
  cover: string;
  /** 音频播放 URL */
  audioUrl: string;
  /** 是否已点赞 */
  liked: boolean;
  /** 播放次数（本地统计） */
  plays: number;
}

export interface Album {
  /** 唯一 ID */
  id: string;
  /** 专辑标题 */
  title: string;
  /** 艺术家 */
  artist: string;
  /** 封面图片 URL */
  cover: string;
  /** 发行年份 */
  year: number;
  /** 曲目列表 */
  tracks: Song[];
}

export interface Playlist {
  /** 唯一 ID */
  id: string;
  /** 歌单标题 */
  title: string;
  /** 歌单描述 */
  description: string;
  /** 封面图片 URL */
  cover: string;
  /** 歌曲列表 */
  songs: Song[];
  /** 是否为本人创建的歌单（可管理） */
  isOwn: boolean;
  /** 创建者昵称 */
  creator: string;
}

/** 播放模式 */
export type PlayMode = 'sequence' | 'shuffle' | 'repeat';

/** 音乐库视图 */
export type LibraryView = 'liked' | 'albums' | 'playlists' | 'playlist-detail';

/** 播放详情页 Tab */
export type DetailTab = 'lyrics' | 'comments' | 'similar';

