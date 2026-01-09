// @ts-nocheck
import { User, ThumbsUp, Reply, Eye, MessageCircle } from 'lucide-react';
import { Button } from '@/modules/app/components/ui/button';
import { IForumPost } from '../types';
import { ReplyContent } from './ContentPreview';
import { renderPreview, renderPreviewQuote } from '.@/utils/cn';

interface ReplyListProps {
  replies: IForumPost[];
  postsMap: Map<string, IForumPost>;
  onReply: (reply: IForumPost) => void;
  onViewOriginal: (parentId: string) => void;
  totalReplies: number;
}

export function ReplyList({ replies, postsMap, onReply, onViewOriginal, totalReplies }: ReplyListProps) {
  return (
    <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
      <div className="bg-linear-to-r from-amber-500/20 to-orange-500/20 border-b border-neutral-700/50 px-6 py-4">
        <h3 className="text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-amber-400" />
          回复 ({totalReplies})
        </h3>
      </div>
      <div className="divide-y divide-neutral-700/50">
        {replies.map((reply) => (
          <div key={reply.id} id={`reply-${reply.id}`} className="p-6">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-lg bg-neutral-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-neutral-400" />
                </div>
              </div>
              <div className="flex-1">
                {reply.parentId && (
                  <div className="mb-3 border-l-4 border-amber-500 bg-neutral-900/40 rounded-lg p-3 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-neutral-400">
                        回复：@{(postsMap.get(reply.parentId)?.authorUsername || postsMap.get(reply.parentId)?.authorId || '')}
                      </span>
                      {postsMap.get(reply.parentId) && (
                        <button
                          className="text-xs text-amber-400 hover:text-amber-300"
                          onClick={() => onViewOriginal(reply.parentId!)}
                        >查看原回�?/button>
                      )}
                    </div>
                    {/* 引用内容：使用带图片限制�?HTML 渲染，避免图片撑破引用块 */}
                    <div className="text-xs text-neutral-300">
                      <ReplyContent html={renderPreviewQuote(postsMap.get(reply.parentId)?.content || '引用内容暂不可见（该楼层不在当前页）')} />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  {/* 楼中楼用户名 */}
                  <span className="text-[#feb800] text-sm" >{reply.authorUsername || reply.authorId}</span>
                  <span className="text-neutral-500 text-xs ml-auto">
                    {reply.createdAt || ''}
                  </span>
                </div>
                <ReplyContent html={renderPreview(reply.content || '')} />
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-400 hover:text-white h-8 px-3"
                  >
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    �?
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-neutral-400 hover:text-white h-8 px-3"
                    onClick={() => onReply(reply)}
                  >
                    <Reply className="w-3 h-3 mr-1" />
                    回复
                  </Button>
                  {/* 回帖浏览数占位展示（前端本地统计�?*/}
                  <div className="flex items-center gap-1 text-neutral-500 text-xs ml-auto">
                    <Eye className="w-3 h-3" />
                    <span>{reply.viewsCount ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

