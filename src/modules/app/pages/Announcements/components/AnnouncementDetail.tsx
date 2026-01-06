import { Calendar, Eye, MessageCircle, User } from 'lucide-react';
import { Announcement } from '../types';

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

interface AnnouncementDetailProps {
  data: Announcement;
  onClose?: () => void;
}

export function AnnouncementDetail({ data, onClose }: AnnouncementDetailProps) {
  return (
    <div className="bg-linear-to-br from-amber-600/5 to-orange-600/5 border border-amber-500/20 rounded-lg p-6 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`px-3 py-1 rounded bg-linear-to-r ${typeColor[data.type]} border flex items-center gap-1`}
        >
          <span className="w-4 h-4 inline-block" />
          {typeLabel[data.type]}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-amber-400 hover:text-amber-300">关闭</button>
        )}
      </div>
      <h2 className="text-amber-50 mb-4">{data.title}</h2>
      <div className="flex items-center gap-4 text-xs text-amber-400/60 mb-4 pb-4 border-b border-amber-500/20">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {data.author}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {data.publishDate}
        </span>
      </div>
      <div className="prose prose-invert prose-amber max-w-none">
        <div className="text-amber-200/80 text-sm whitespace-pre-wrap">{data.content}</div>
      </div>
      <div className="flex items-center gap-4 text-xs text-amber-400/60 mt-4 pt-4 border-t border-amber-500/20">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {data.views} 浏览
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          {data.comments} 评论
        </span>
      </div>
    </div>
  );
}

