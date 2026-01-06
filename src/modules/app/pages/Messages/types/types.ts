/**
 * 消息中心类型定义
 * - 该文件集中维护页面涉及到的所有 TypeScript 类型，便于复用与维护
 */

/**
 * 页面支持的标签类型（与 URL 参数 `tab` 保持一致）
 */
export type MessageType = 'system' | 'inbox' | 'sent' | 'favorites' | 'threads';

/**
 * UI 层使用的消息结构（用于列表与详情展示）
 */
export interface Message {
  /** 消息唯一 ID */
  id: string;
  /** 发送方名称（系统或用户） */
  from: string;
  /** 主题（通常为内容截断） */
  subject: string;
  /** 全量内容（纯文本/Markdown/HTML 已在后端区分） */
  content: string;
  /** 友好时间字符串（已在容器中格式化） */
  timestamp: string;
  /** 是否已读 */
  read: boolean;
  /** 是否为星标（收藏） */
  starred?: boolean;
  /** 消息来源类型：系统或用户 */
  type: 'system' | 'user';
}

/**
 * 后端返回的私信消息结构（用于映射为 UI Message）
 * - 字段保持最小化：只包含当前页面用到的键
 */
export interface IMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt?: string | null;
}

/**
 * 系统通知结构
 */
export interface INotification {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  readAt?: string | null;
}

/**
 * 会话摘要：对等方与最后消息信息
 */
export interface IThreadSummary {
  /** 会话唯一 ID（可选，部分实现仅使用 peerUserId） */
  threadId?: string;
  /** 对等用户 ID */
  peerUserId: string;
  /** 最后一条消息时间戳（字符串） */
  lastMessageAt: string;
  /** 未读消息数量 */
  unread: number;
}

