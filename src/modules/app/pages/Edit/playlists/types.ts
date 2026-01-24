/**
 * 片单相关类型定义
 * 将页面内联的 `Movie` 与 `Playlist` 类型抽离到独立文件，
 * 便于在多个组件/Hook之间共享，保持数据层与展示层解耦。
 */

export type Visibility = "public" | "private" | "friends";
export type ApprovalStatus = "pending" | "approved" | "rejected";

/** 审批状态中英文映射 */
export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: "待审批",
  approved: "已通过",
  rejected: "已驳回",
};

/** 审批状态颜色映射 */
export const APPROVAL_STATUS_COLORS: Record<ApprovalStatus, string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  rejected: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

/**
 * 片单类型
 * 与后端 CreatePlaylistDto.type / PlaylistDTO.type 枚举一一对应
 */
export type PlaylistType = "movie" | "series" | "adult" | "music";

/** 片单类型中英文映射 */
export const PLAYLIST_TYPE_LABELS: Record<PlaylistType, string> = {
  movie: "电影",
  series: "剧集",
  adult: "成人",
  music: "音乐",
};

/** 片单类型选项列表，供表单 Select 使用 */
export const PLAYLIST_TYPE_OPTIONS: { value: PlaylistType; label: string }[] = [
  { value: "movie", label: "电影" },
  { value: "series", label: "剧集" },
  { value: "adult", label: "成人" },
  { value: "music", label: "音乐" },
];

/**
 * 影片实体（页面展示用的简化模型）
 * 注意：该类型是前端展示层的本地模型，字段名与后端 DTO 不完全一致。
 */
export interface Movie {
  /** 影片唯一标识 */
  id: string;
  /** 中文标题 */
  title: string;
  /** 原始片名 */
  originalTitle: string;
  /** 年份（字符串以便直接展示） */
  year: string;
  /** 海报地址（可能来自多个后端字段映射） */
  poster: string;
  /** 分类/类型标签 */
  category: string;
  /** 评分（数值） */
  rating: number;
  /** 关联的种子数量 */
  /** 关联的种子数量 */
  torrentCount: number;
  /** 是否已在当前片单中（仅在搜索候选项时使用） */
  isInPlaylist?: boolean;
}

/**
 * 片单实体（页面展示用的简化模型）
 * 注意：该类型是前端展示层的本地模型，字段名与后端 DTO 不完全一致。
 */
export interface Playlist {
  /** 片单唯一标识 */
  id: string;
  /** 片单标题（后端 name/title 映射到此） */
  title: string;
  /** 片单描述 */
  description: string;
  /** 封面图片地址 */
  cover: string;
  /** 可见性 */
  visibility: Visibility;
  /** 片单类型 */
  type: PlaylistType;
  /** 标签列表 */
  tags: string[];
  /** 分类唯一键（categories.key，kind=playlist） */
  category: string;
  /** 影片列表 */
  movies: Movie[];
  /** 创建时间（字符串以便直接展示） */
  createdAt: string;
  /** 更新时间（字符串以便直接展示） */
  updatedAt: string;
  /** 浏览次数 */
  views: number;
  /** 点赞次数 */
  likes: number;
  /** 审批状态 */
  approvalStatus: ApprovalStatus;
  /** 封面附件ID */
  coverAttachmentId?: string;
}
