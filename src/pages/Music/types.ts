// 音乐页面相关的公共类型定义
// 说明：统一集中维护各区块使用到的基础数据结构，避免在组件间重复定义

export type TabType = "hall" | "songs" | "artists" | "albums" | "playlists";

export type ViewMode = "grid" | "list";

export interface Song {
  /** 唯一标识 */
  id: string;
  /** 歌名 */
  title: string;
  /** 歌手名 */
  artist: string;
  /** 所属专辑 */
  album: string;
  /** 时长，如 03:45 */
  duration: string;
  /** 封面图 URL */
  cover: string;
  /** 播放次数 */
  plays: number;
}

export interface Artist {
  id: string;
  /** 歌手名 */
  name: string;
  /** 头像 URL */
  avatar: string;
  /** 粉丝数 */
  followers: number;
  /** 歌曲数量 */
  songs: number;
}

export interface Album {
  id: string;
  /** 专辑名 */
  title: string;
  /** 歌手名 */
  artist: string;
  /** 封面图 URL */
  cover: string;
  /** 发行年份 */
  year: number;
  /** 曲目数量 */
  tracks: number;
}

export interface Playlist {
  id: string;
  /** 歌单标题 */
  title: string;
  /** 封面图 URL */
  cover: string;
  /** 曲目数量 */
  tracks: number;
  /** 创建者名称 */
  creator: string;
}

export interface MyPlaylist {
  id: string;
  /** 我创建的歌单标题 */
  title: string;
  /** 介绍文案 */
  description: string;
  /** 封面图 URL */
  cover: string;
  /** 歌曲集合 */
  songs: Song[];
  /** 是否本人创建 */
  isOwn: boolean;
  /** 创建者 */
  creator: string;
}

