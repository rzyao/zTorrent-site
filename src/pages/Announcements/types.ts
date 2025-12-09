export type AnnouncementType = 'system' | 'event' | 'rule' | 'maintenance';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  author: string;
  publishDate: string;
  isPinned: boolean;
  isRead: boolean;
  views: number;
  comments: number;
}

export interface AnnouncementsPageProps {
  onAnnouncementClick?: (announcementId: string) => void;
}

