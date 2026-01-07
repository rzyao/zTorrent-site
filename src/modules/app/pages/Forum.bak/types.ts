// @ts-nocheck
export interface IForumCategory {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  enabled: boolean;
  sort: number;
  lastThreadId?: string | null;
  lastPostAt?: string | null;
  threadsCount?: number;
  postsCount?: number;
}

export interface IForumThread {
  id: string;
  categoryId: string;
  title: string;
  authorId: string;
  authorUsername?: string;
  content: string;
  status: 'normal' | 'locked' | 'hidden' | 'deleted';
  highlightMeta?: { status?: string[]; timeType?: number | null; endTime?: string | null } | null;
  repliesCount: number;
  viewsCount: number;
  lastPostId?: string | null;
  lastPostAt?: string | null;
}

export interface IForumPost {
  id: string;
  threadId: string;
  authorId: string;
  authorUsername?: string;
  content: string;
  parentId?: string | null;
  status: 'normal' | 'hidden' | 'deleted';
  editedAt?: string | null;
  createdAt?: string | null;
  /**
   * 可选：单条回帖浏览次数（后端暂未提供，前端本地统计/占位展示�?
   */
  viewsCount?: number;
}

export type ForumCategory = 'all' | 'announcement' | 'help' | 'resource' | 'tech' | 'chat';

// 旧接口，保留以防万一，但似乎主要用的是上面的 IForum* 接口
export interface ForumPost {
  id: string;
  title: string;
  category: string;
  author: string;
  authorAvatar?: string;
  authorLevel: string;
  content: string;
  replies: number;
  views: number;
  likes: number;
  timestamp: string;
  lastReply?: string;
  isPinned?: boolean;
  isHot?: boolean;
  isElite?: boolean;
}

export interface Reply {
  id: string;
  author: string;
  authorAvatar?: string;
  authorLevel: string;
  content: string;
  timestamp: string;
  likes: number;
}

