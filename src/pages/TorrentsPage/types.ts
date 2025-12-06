// 组件拆分专家：类型集中管理
// 说明：将原页面内的接口与类型声明拆分到独立文件，便于复用与明确数据结构。
// 注意：本文件仅声明当前页面所需的类型，不做旧代码兼容。

export interface Torrent {
  /** 唯一ID */
  id: number;
  /** 主标题 */
  title: string;
  /** 副标题（可选） */
  subTitle?: string;
  /** 原始分类键 */
  category: string;
  /** 缩略图/封面路径（后端字段可能多样，渲染时通过 `getCoverSrc` 适配） */
  thumbnail?: string;
  /** 可读文件大小字符串或数值（列表处使用 `formatSize` 格式化） */
  size: any;
  /** 做种数 */
  seeders: number;
  /** 下载数/吸血数 */
  leechers: number;
  /** 完成数 */
  completed: number;
  /** 上传者 */
  uploader?: string;
  /** 上传日期字符串 */
  uploadDate?: string;
  /** 标签集合（可能是字符串数组或字符串） */
  tags?: string[] | string;
  /** 是否免费 */
  isFree?: boolean;
  /** 是否VIP */
  isVip?: boolean;
  /** 是否热门 */
  isHot?: boolean;
  /** 评分 */
  rating?: number;
  /** 评论数 */
  comments: number;
  /** 豆瓣链接（如存在） */
  doubanUrl?: string;
  /** 各尺寸封面字段（后端可能返回不同命名） */
  cover?: string;
  MediumCoverPath?: string;
  ThumbCoverPath?: string;
}

export interface CategoryItem {
  /** 展示的中文标签 */
  label: string;
  /** 分类键（用于请求） */
  key?: string;
}

export type ViewMode = 'grid' | 'list';

export interface SortOption {
  value: 'latest' | 'seeders' | 'completed' | 'rating' | 'size';
  label: string;
}

