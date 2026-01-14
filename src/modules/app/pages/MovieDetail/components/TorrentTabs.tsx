import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/app/components/ui/tabs";
import { Button } from "@/modules/app/components/ui/button";
import { Avatar } from "@/modules/app/components/ui/avatar";
import { Badge } from "@/modules/app/components/ui/badge";
import { MessageSquare, Star, ThumbsUp } from "lucide-react";
import { TorrentTable } from "@/modules/app/components/TorrentTable";
import type { CommentItem, TorrentItem } from "../types";

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
      <TabsList className="card w-full justify-start">
        <TabsTrigger
          value="torrents"
          className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
        >
          种子列表
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
        >
          评论 ({Array.isArray(comments) ? comments.length : 0})
        </TabsTrigger>
      </TabsList>

      {/* 种子列表 */}
      <TabsContent value="torrents" className="card rounded-lg p-6">
        <h3 className="mb-4 text-white">种子列表</h3>
        {Array.isArray(torrents) && torrents.length > 0 ? (
          <TorrentTable torrents={torrents as any} filmId={filmId} />
        ) : (
          <div className="text-sm text-neutral-400">暂无种子</div>
        )}
      </TabsContent>

      {/* 评论 */}
      <TabsContent value="comments" className="space-y-4">
        {/* 评论输入区（静态 UI，占位） */}
        <div className="card rounded-lg p-6">
          <h3 className="mb-4 text-white">发表评论</h3>
          <div className="space-y-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm text-neutral-400">评分:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 cursor-pointer text-neutral-600 transition-colors hover:text-amber-400"
                />
              ))}
            </div>
            <textarea
              placeholder="分享您的观看感受..."
              rows={4}
              className="input w-full resize-none rounded-lg px-4 py-3 text-white placeholder:text-neutral-500"
            />
            <Button
              variant="outline"
              className="rounded-lg border-[#92702a] bg-transparent text-[#d4a733] hover:border-[#d4a733] hover:bg-[#d4a733]/10 hover:text-[#e8bc4a]"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              发布评论
            </Button>
          </div>
        </div>

        {/* 评论列表 */}
        {Array.isArray(comments)
          ? comments.map((comment) => (
              <div key={comment.id} className="card rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="flex h-12 w-12 items-center justify-center bg-neutral-700 text-white">
                    U
                  </Avatar>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-white">{comment.user.name}</span>
                      <Badge className="bg-amber-500 text-xs text-white">
                        {comment.user.level}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: comment.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="mb-3 text-neutral-300">{comment.content}</p>
                    <div className="flex items-center gap-4 text-sm text-neutral-400">
                      <span>{comment.date}</span>
                      <Button className="flex items-center gap-1 transition-colors hover:text-amber-400">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{comment.likes}</span>
                      </Button>
                      <Button className="flex items-center gap-1 transition-colors hover:text-amber-400">
                        <MessageSquare className="h-4 w-4" />
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
