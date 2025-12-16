/**
 * 片单相关类型定义
 * 将页面内联的 `Movie` 与 `Playlist` 类型抽离到独立文件，
 * 便于在多个组件/Hook之间共享，保持数据层与展示层解耦。
 */

export type Visibility = 'public' | 'private' | 'friends';

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
  torrentCount: number;
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
}

