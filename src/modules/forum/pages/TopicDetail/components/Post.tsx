import { useState, memo } from "react";
import { User as UserIcon, Pencil } from "lucide-react";
import { PostData } from "../types";
import { SelectionPopover } from "./SelectionPopover";
import { usePostSelection } from "../hooks/usePostSelection";
import { PostContent } from "./PostParts/PostContent";
import { PostReplyContext } from "./PostParts/PostReplyContext";
import { PostHeader } from "./PostParts/PostHeader";
import { PostFooter } from "./PostParts/PostFooter";
import { IncomingReplies } from "./PostParts/IncomingReplies";
import { PostSmallAction } from "./PostParts/PostSmallAction";
import { UserCard } from "@/modules/app/components/UserCard";
import { useAccess } from "@/context/AccessContext";
import { PostInlineEditor } from "./PostParts/PostInlineEditor";
import { ForumImage } from "@/modules/forum/components/ui/image";

import { ForumTopicBounty } from "../../../types/bounty";
interface PostProps {
  post: PostData;
  postIndex: number; // 从 1 开始的帖子索引
  isLast: boolean;
  colors: any;
  topicTitle?: string;
  topicId?: string;
  incomingReplies?: PostData[];
  bounty?: ForumTopicBounty;
  isAuthor?: boolean;
  onUpdated?: () => void;
  categoryKey?: string;
}

export const Post = memo(function Post({
  post,
  postIndex,
  isLast,
  colors,
  topicTitle,
  topicId,
  incomingReplies,
  bounty,
  isAuthor,
  onUpdated,
  categoryKey,
}: PostProps) {
  const isSmallAction = post.isSmallAction;
  const [isReplyExpanded, setIsReplyExpanded] = useState(false);
  const [areIncomingRepliesExpanded, setAreIncomingRepliesExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { access } = useAccess();
  const canEdit = access?.username && access.username === post.username;
  const isAuthorComputed = access?.username && access.username === (postIndex === 1 ? post.username : undefined);

  const { selectionMenu, setSelectionMenu, handleMouseUp, handleQuote } = usePostSelection(
    post,
    postIndex,
    topicTitle,
    topicId,
  );

  if (isSmallAction) {
    return <PostSmallAction post={post} />;
  }

  // 构造 UserCard 数据 (Mock)
  const mockUserCardData = {
    id: post.id,
    username: post.username,
    name: post.name,
    avatarUrl: post.avatar,
    bannerUrl: post.role === "admin" ? "https://picsum.photos/seed/admin/600/200" : undefined,
    joinedAt: "4天前",
    lastSeenAt: "< 1分钟",
    readTime: "25 分钟",
    postCount: 42,
    isAdmin: post.username === "admin" || post.role === "admin",
    isModerator: post.role === "moderator",
    bio:
      post.username === "admin" ? "管理员账号，负责站点维护和管理。" : "这是一个活跃的社区成员。",
    location: "Chongqing, China",
    website: "https://example.com",
    badges: [
      { id: "basic", label: "基本用户", color: "bronze", icon: <UserIcon className="h-3 w-3" /> },
    ],
  };

  return (
    <>
      {post.replyTo && (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isReplyExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
        >
          <div className="overflow-hidden">
            <PostReplyContext replyTo={post.replyTo} colors={colors} />
          </div>
        </div>
      )}
      <div
        id={`post-${post.postNumber || postIndex}`}
        data-post-number={post.postNumber}
        data-post-index={postIndex}
        data-post-db-id={post.id}
        className={`flex gap-3 py-3 ${!isLast ? `border-b ${colors.dividerColor}` : ""} group`}
      >
        {/* 头像列 */}
        <div className="flex w-12 shrink-0 flex-col items-center pt-1">
          <UserCard
            user={mockUserCardData}
            align="start"
            side="right"
            className="flex items-center justify-center select-none"
            trigger={
              <ForumImage
                src={post.avatar}
                alt={post.username}
                className={`h-[45px] w-[45px] cursor-pointer rounded-full border-2 object-cover shadow-sm hover:opacity-90 ${colors.avatarBorder}`}
              />
            }
          />
        </div>

        {/* 内容列 */}
        <div className="min-w-0 flex-1 pl-3">
          <PostHeader
            post={post}
            colors={colors}
            isReplyExpanded={isReplyExpanded}
            onToggleReply={() => setIsReplyExpanded(!isReplyExpanded)}
          />

          {!isEditing ? (
            <PostContent
              content={post.content}
              className={`prose dark:prose-invert max-w-none text-base leading-normal ${colors.textPrimary} dark:[&_blockquote]:rounded dark:[&_blockquote]:bg-[#3d3d3d] dark:[&_blockquote]:p-2 [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:shadow-md`}
              onMouseUp={handleMouseUp}
              colors={colors}
            />
          ) : (
            <PostInlineEditor
              postId={post.id}
              topicId={topicId!}
              initialContent={post.content}
              onCancel={() => setIsEditing(false)}
              onSaved={() => setIsEditing(false)}
            />
          )}

          {selectionMenu && (
            <SelectionPopover
              x={selectionMenu.x}
              y={selectionMenu.y}
              onQuote={handleQuote}
              onClose={() => setSelectionMenu(null)}
            />
          )}

          <PostFooter
            post={post}
            incomingReplies={incomingReplies}
            areIncomingRepliesExpanded={areIncomingRepliesExpanded}
            onToggleIncomingReplies={() =>
              setAreIncomingRepliesExpanded(!areIncomingRepliesExpanded)
            }
            topicTitle={topicTitle}
            topicId={topicId}
            canEdit={Boolean(canEdit && !isEditing)}
            onEdit={() => setIsEditing(true)}
            bounty={bounty}
            isAuthor={Boolean(isAuthor ?? isAuthorComputed)}
            onUpdated={onUpdated}
            categoryKey={categoryKey}
          />

          <IncomingReplies
            replies={incomingReplies}
            expanded={areIncomingRepliesExpanded}
            colors={colors}
            onCollapse={() => setAreIncomingRepliesExpanded(false)}
          />
        </div>
      </div>
    </>
  );
});
