import { MessageSquare, Eye, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { IForumThread } from '../types';
import { parseHighlight } from '../utils';

interface ThreadListProps {
  threads: IForumThread[];
  onThreadSelect: (thread: IForumThread) => void;
  getCategoryName: (id?: string) => string;
}

export function ThreadList({ threads, onThreadSelect, getCategoryName }: ThreadListProps) {
  return (
    <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
      {/* 列表头部 */}
      <div className="bg-neutral-700/30 px-6 py-3 border-b border-neutral-700/50">
        <div className="grid grid-cols-12 gap-4 text-sm text-neutral-400">
          <div className="col-span-6">标题</div>
          <div className="col-span-2 text-center hidden md:block">作者</div>
          <div className="col-span-1 text-center hidden lg:block">回复</div>
          <div className="col-span-1 text-center hidden lg:block">查看</div>
          <div className="col-span-2 text-center hidden md:block">最后回复</div>
        </div>
      </div>

      {/* 帖子列表 */}
      <div className="divide-y divide-neutral-700/50">
        {threads.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>暂无帖子</p>
          </div>
        ) : (
          threads.map((post) => {
             const highlight = parseHighlight(post.highlightMeta?.status);
             return (
              <div
                key={post.id}
                onClick={() => onThreadSelect(post)}
                className="px-6 py-4 cursor-pointer transition-all hover:bg-neutral-700/20"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* 标题列 */}
                  <div className="col-span-12 md:col-span-6">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-white text-sm mb-1 hover:text-amber-400 transition-colors line-clamp-1 ${highlight.bold ? 'font-bold' : ''} ${highlight.red ? 'text-red-400' : ''}`}>
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          {highlight.hot && (
                            <Badge className="bg-orange-500 text-white text-xs">热帖</Badge>
                          )}
                          <Badge className="bg-neutral-700 text-neutral-300 text-xs">{getCategoryName(post.categoryId)}</Badge>
                          <span className="text-xs text-neutral-500 md:hidden">
                            {post.authorUsername || post.authorId} · {post.repliesCount}回复 · {post.viewsCount}查看
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 作者列 */}
                  <div className="col-span-2 text-center hidden md:block">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-neutral-300 text-sm">{post.authorUsername || post.authorId}</span>
                    </div>
                  </div>

                  {/* 回复数 */}
                  <div className="col-span-1 text-center hidden lg:block">
                    <div className="flex flex-col items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-neutral-400" />
                      <span className="text-neutral-300 text-sm">{post.repliesCount}</span>
                    </div>
                  </div>

                  {/* 查看数 */}
                  <div className="col-span-1 text-center hidden lg:block">
                    <div className="flex flex-col items-center gap-1">
                      <Eye className="w-4 h-4 text-neutral-400" />
                      <span className="text-neutral-300 text-sm">{post.viewsCount}</span>
                    </div>
                  </div>

                  {/* 最后回复 */}
                  <div className="col-span-2 text-center hidden md:block">
                    <span className="text-neutral-400 text-xs">{post.lastPostAt || ''}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
