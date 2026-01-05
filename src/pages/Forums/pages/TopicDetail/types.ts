export interface TopicDetailProps {
  topicId: string;
  onBack: () => void;
}

export interface PostStats {
  created: string;
  lastReply: string;
  replies: number | string;
  views: string;
  users: number;
  likes: number;
  links: number;
}

export interface PostData {
  id: string;
  postNumber?: number; // 话题内楼层号（后端返回）
  username: string;
  name: string;
  avatar: string;
  role?: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean; // 新增：当前用户是否点赞
  avatarSize: number;
  isOp?: boolean;
  isSmallAction?: boolean;
  actionCode?: string;
  stats?: PostStats;
  replyTo?: {
    id: string;
    floor: number;
    username: string;
    avatar?: string;
    content?: string;
  };
  incomingReplies?: PostData[];
}

export interface Participant {
  avatar: string;
  username: string;
}

export interface TopicData {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  categoryIcon?: string;
  tags: string[];
  createdAt: string;
  views: number;
  replies: number;
  isLiked?: boolean; // 新增：当前用户是否点赞
  isBookmarked?: boolean; // 新增：当前用户是否收藏
  participants: Participant[];
  stats: PostStats;
  posts: PostData[];
  status?: {
    isLocked: boolean;
    isPinned: boolean;
    isArchived: boolean;
    isGlobalPinned?: boolean;
    isBanner?: boolean;
    isTrending?: boolean;
  };
}

export interface SuggestedTopic {
  title: string;
  category: string;
  color: string;
  tags: string[];
  replies: number;
  views: string;
  activity: string;
  posters?: string[];
}
