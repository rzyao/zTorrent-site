import { Calendar, ChevronRight, Eye, MessageCircle, Pin, User } from 'lucide-react';
import { Announcement } from '../types';

interface AnnouncementCardProps {
  data: Announcement;
  variant?: 'pinned' | 'normal';
  onClick?: (a: Announcement) => void;
}

const typeLabel = {
  system: '系统公告',
  event: '活动公告',
  rule: '规则更新',
  maintenance: '维护通知',
} as const;

const typeColor = {
  system: 'from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-300',
  event: 'from-amber-500/20 to-orange-600/20 border-amber-400/30 text-amber-300',
  rule: 'from-red-500/20 to-red-600/20 border-red-400/30 text-red-300',
  maintenance: 'from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-300',
} as const;

export function AnnouncementCard({ data, variant = 'normal', onClick }: AnnouncementCardProps) {
  const containerClass =
    variant === 'pinned'
      ? 'bg-linear-to-br from-amber-600/10 to-orange-600/10 border-2 border-amber-400/40'
      : 'bg-linear-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20';

  return (
    <div
      onClick={() => onClick?.(data)}
      className={`${containerClass} rounded-lg p-4 hover:border-amber-400/60 transition-all cursor-pointer`}
    >
      <div className="flex items-start gap-3">
        {variant === 'pinned' && <Pin className="w-5 h-5 text-amber-400 shrink-0 mt-1" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div
              className={`px-2 py-1 rounded text-xs bg-linear-to-r ${typeColor[data.type]} border flex items-center gap-1`}
            >
              <span className="w-4 h-4 inline-block" />
              {typeLabel[data.type]}
            </div>
            {!data.isRead && (
              <span className="px-2 py-1 bg-red-500/20 border border-red-400/30 text-red-300 rounded text-xs">未读</span>
            )}
            {variant === 'pinned' && (
              <span className="px-2 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded text-xs">置顶</span>
            )}
          </div>
          <h3 className={`mb-2 ${data.isRead ? 'text-amber-300/70' : 'text-amber-50'}`}>{data.title}</h3>
          <div className="flex items-center gap-4 text-xs text-amber-400/60">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {data.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {data.publishDate}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {data.views}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {data.comments}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-amber-400/50 shrink-0" />
      </div>
    </div>
  );
}

