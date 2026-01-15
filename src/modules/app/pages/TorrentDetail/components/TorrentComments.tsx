import { useState } from "react";
import { MessageSquare, ThumbsUp, Heart } from "lucide-react";
import { Badge } from "@/modules/app/components/ui/badge";
import { Button } from "@/modules/app/components/ui/button";
import { ActionButton } from "@/modules/app/components/ui/ActionButton";
import { ImageWithFallback } from "@/modules/app/components/figma/ImageWithFallback";
import { useTorrentComments } from "../hooks/useTorrentComments";

interface TorrentCommentsProps {
  torrentId: string | number;
  commentCount: number;
}

export function TorrentComments({ torrentId, commentCount }: TorrentCommentsProps) {
  const { comments, postComment, isPosting } = useTorrentComments(String(torrentId));
  const [commentInput, setCommentInput] = useState("");

  const handlePostComment = async () => {
    if (!commentInput.trim()) return;
    await postComment(commentInput);
    setCommentInput("");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
      <div className="border-b border-neutral-700/50 px-5 py-4">
        <h2 className="text-white">评论 ({comments?.length || commentCount})</h2>
      </div>
      <div className="p-6">
        {/* 发表评论 */}
        <div className="mb-6">
          <textarea
            rows={4}
            placeholder="发表你的看法..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="w-full resize-none rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
          />
          <div className="mt-2 flex justify-end">
            <ActionButton
              color="primary"
              icon={MessageSquare}
              onClick={handlePostComment}
              loading={isPosting}
            >
              发表评论
            </ActionButton>
          </div>
        </div>

        {/* 评论列表 */}
        <div className="space-y-6">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <ImageWithFallback
                  src={comment.avatar}
                  alt={comment.user}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-white">{comment.user}</span>
                    <Badge className="border border-purple-500/30 bg-purple-500/20 text-xs text-purple-400">
                      {comment.userLevel}
                    </Badge>
                    <span className="text-sm text-gray-500">{comment.date}</span>
                  </div>
                  <p className="mb-3 text-gray-300">{comment.content}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 p-0 text-gray-400 hover:bg-transparent hover:text-amber-400"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>赞</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 p-0 text-gray-400 hover:bg-transparent hover:text-gray-300"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>回复</span>
                    </Button>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span>{comment.thanks} 感谢</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">暂无评论</div>
          )}
        </div>
      </div>
    </div>
  );
}
