import { User, Clock, Eye, X, Flame, ThumbsUp, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IForumThread } from '../types';
import { parseHighlight } from '../utils';
import { ContentPreview } from './ContentPreview';

interface ThreadContentProps {
  thread: IForumThread;
  threadDetail: IForumThread | null;
  onClose: () => void;
  onReplyClick: () => void;
  contentHtml: string;
}

export function ThreadContent({ thread, threadDetail, onClose, onReplyClick, contentHtml }: ThreadContentProps) {
  const highlight = parseHighlight(thread.highlightMeta?.status);
  
  return (
    <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
        <div className="bg-linear-to-r from-amber-500/20 to-orange-500/20 border-b border-neutral-700/50 px-6 py-4">
            <div className="flex items-start justify-between">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                {highlight.hot && (
                    <Badge className="bg-orange-500 text-white">
                    <Flame className="w-3 h-3 mr-1" />
                    热帖
                    </Badge>
                )}
                </div>
                <h2 className={`text-white text-xl mb-3 ${highlight.bold ? 'font-bold' : ''} ${highlight.red ? 'text-red-400' : ''}`}>
                {threadDetail?.title ?? thread.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{(threadDetail?.authorUsername ?? threadDetail?.authorId) || (thread.authorUsername || thread.authorId)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{thread.lastPostAt || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{(threadDetail?.viewsCount ?? thread.viewsCount)}</span>
                </div>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-neutral-400 hover:text-white"
            >
                <X className="w-5 h-5" />
            </Button>
            </div>
        </div>
        <div className="p-6">
            <ContentPreview html={contentHtml} />
            <div className="flex items-center gap-3">
            <Button
                variant="outline"
                size="sm"
                className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
                <ThumbsUp className="w-4 h-4 mr-2" />
                点赞
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                onClick={onReplyClick}
            >
                <Reply className="w-4 h-4 mr-2" />
                回复
            </Button>
            </div>
        </div>
    </div>
  );
}
