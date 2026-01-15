import { MessageSquare, ThumbsUp, ExternalLink, PenSquare } from "lucide-react";
import { Button } from "@/modules/app/components/ui/button";
import { ActionButton } from "@/modules/app/components/ui/ActionButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/app/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { UnifiedCommentsService } from "@/api/services/UnifiedCommentsService";
import { useNavigate } from "react-router-dom";
import { useComposerStore } from "@/modules/forum/components/Composer/ComposerStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

interface AggregatedComment {
  topicId: string;
  topicTitle: string;
  avatar: string;
  username: string;
  content: string;
  likes: number;
  floor: number;
  createdAt: string;
}

interface CommentsSectionProps {
  entityType: string;
  entityId: string;
  title?: string;
}

export function CommentsSection({ entityType, entityId, title }: CommentsSectionProps) {
  const navigate = useNavigate();
  const composerStore = useComposerStore();

  // 获取聚合热评
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", "top", entityType, entityId],
    queryFn: async () => {
      const resp = await UnifiedCommentsService.forumCommentsControllerGetTopPosts(
        entityType,
        entityId,
        5,
      );
      const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
      return (body?.data ?? body) as AggregatedComment[];
    },
  });

  // 发起讨论：打开论坛的 Composer 组件（CREATE_TOPIC 模式）
  const handleCreateTopic = () => {
    composerStore.open("CREATE_TOPIC", {
      // 预填标题
      title: title ? `【${entityType === "torrent" ? "种子讨论" : "资源讨论"}】${title}` : "",
      // TODO: 后端需要支持在创建话题时传入 resourceType/resourceId 建立关联
    });
  };

  // 跳转到论坛话题详情页（进行回复）
  const handleGoToTopic = (topicId: string) => {
    navigate(`/forum/topic/${topicId}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-700/50 bg-neutral-800/40">
      <div className="flex items-center justify-between border-b border-neutral-700/50 px-5 py-4">
        <h2 className="text-white">评论与讨论</h2>
        <ActionButton color="primary" icon={PenSquare} onClick={handleCreateTopic}>
          发起讨论
        </ActionButton>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex animate-pulse gap-4">
                <div className="h-10 w-10 rounded-full bg-neutral-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-neutral-700"></div>
                  <div className="h-12 w-full rounded bg-neutral-700"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment, idx) => (
              <div key={`${comment.topicId}-${idx}`} className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.avatar} alt={comment.username} />
                  <AvatarFallback>{comment.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="font-medium text-white">{comment.username}</span>
                    <span className="text-xs text-gray-500">在</span>
                    <button
                      onClick={() => handleGoToTopic(comment.topicId)}
                      className="text-sm text-amber-400 hover:underline"
                    >
                      {comment.topicTitle}
                    </button>
                    <span className="text-xs text-gray-500">中回复</span>
                    <span className="text-xs text-gray-500">
                      · {dayjs(comment.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="mb-3 line-clamp-3 text-gray-300">{comment.content}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes || 0}</span>
                    </div>
                    <button
                      onClick={() => handleGoToTopic(comment.topicId)}
                      className="flex items-center gap-1 text-gray-400 hover:text-amber-400"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>回复</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* 查看更多 */}
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate(`/forum?resourceType=${entityType}&resourceId=${entityId}`)}
                className="text-amber-400 hover:text-amber-300"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                查看全部相关讨论
              </Button>
            </div>
          </div>
        ) : (
          // 空状态
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="mb-4 h-12 w-12 text-neutral-600" />
            <h3 className="mb-2 text-lg font-medium text-white">暂无相关讨论</h3>
            <p className="mb-4 text-sm text-gray-500">成为第一个发起讨论的用户</p>
            <ActionButton color="primary" icon={PenSquare} onClick={handleCreateTopic}>
              发表第一条评论
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
}
