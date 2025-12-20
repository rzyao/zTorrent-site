import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Star, ThumbsUp } from 'lucide-react';
import { TorrentTable } from '@/components/TorrentTable';
import type { CommentItem, TorrentItem } from '../types';

/**
 * TorrentTabs 组件
 * - 左侧主内容的标签页：种子列表 / 评论
 * - 将交互状态通过 props 控制，保持组件本身无业务逻辑
 */
export function TorrentTabs({
  activeTab,
  onActiveTabChange,
  torrents,
  comments,
  filmId,
}: {
  activeTab: string;
  onActiveTabChange: (val: string) => void;
  torrents: TorrentItem[];
  comments: CommentItem[];
  filmId?: string;
}) {
  return (
    <Tabs value={activeTab} onValueChange={onActiveTabChange} className="w-full">
      <TabsList className="bg-gray-900 border border-gray-800 w-full justify-start">
        <TabsTrigger value="torrents" className="data-[state=active]:bg-[#00A8E1]">种子列表</TabsTrigger>
        <TabsTrigger value="comments" className="data-[state=active]:bg-[#00A8E1]">评论 ({Array.isArray(comments) ? comments.length : 0})</TabsTrigger>
      </TabsList>

      {/* 种子列表 */}
      <TabsContent value="torrents" className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
        <h3 className="text-white mb-4">种子列表</h3>
        {Array.isArray(torrents) && torrents.length > 0 ? (
          <TorrentTable torrents={torrents as any} filmId={filmId} />
        ) : (
          <div className="text-gray-400 text-sm">暂无种子</div>
        )}
      </TabsContent>

      {/* 评论 */}
      <TabsContent value="comments" className="space-y-4">
        {/* 评论输入区（静态 UI，占位） */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
          <h3 className="text-white mb-4">发表评论</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 text-sm">评分:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 text-gray-600 hover:text-yellow-400 cursor-pointer transition-colors" />
              ))}
            </div>
            <textarea
              placeholder="分享您的观看感受..."
              rows={4}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#00A8E1] focus:ring-1 focus:ring-[#00A8E1] outline-none resize-none"
            />
            <Button className="bg-[#00A8E1] hover:bg-[#00A8E1]/90 text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              发布评论
            </Button>
          </div>
        </div>

        {/* 评论列表 */}
        {Array.isArray(comments)
          ? comments.map((comment) => (
              <div key={comment.id} className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12 bg-gray-700 flex items-center justify-center text-white">U</Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white">{comment.user.name}</span>
                      <Badge className="bg-yellow-500 text-white text-xs">{comment.user.level}</Badge>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: comment.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{comment.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{comment.date}</span>
                      <Button className="flex items-center gap-1 hover:text-[#00A8E1] transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.likes}</span>
                      </Button>
                      <Button className="flex items-center gap-1 hover:text-[#00A8E1] transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>回复 ({comment.replies})</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : null}
      </TabsContent>
    </Tabs>
  );
}

