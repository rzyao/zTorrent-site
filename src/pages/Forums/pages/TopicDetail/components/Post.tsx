import { useState } from "react";
import { PostData } from "../types";
import { SelectionPopover } from "./SelectionPopover";
import { usePostSelection } from "../hooks/usePostSelection";
import { PostContent } from "./PostParts/PostContent";
import { PostReplyContext } from "./PostParts/PostReplyContext";
import { PostHeader } from "./PostParts/PostHeader";
import { PostFooter } from "./PostParts/PostFooter";
import { IncomingReplies } from "./PostParts/IncomingReplies";
import { PostSmallAction } from "./PostParts/PostSmallAction";

interface PostProps {
  post: PostData;
  postIndex: number; // 从 1 开始的帖子索引
  isLast: boolean;
  colors: any;
  topicTitle?: string;
  topicId?: string;
  incomingReplies?: PostData[];
}

export function Post({
  post,
  postIndex,
  isLast,
  colors,
  topicTitle,
  topicId,
  incomingReplies,
}: PostProps) {
  const isSmallAction = post.isSmallAction;
  const [isReplyExpanded, setIsReplyExpanded] = useState(false);
  const [areIncomingRepliesExpanded, setAreIncomingRepliesExpanded] = useState(false);

  const { selectionMenu, setSelectionMenu, handleMouseUp, handleQuote } = usePostSelection(
    post,
    postIndex,
    topicTitle,
    topicId,
  );

  if (isSmallAction) {
    return <PostSmallAction post={post} />;
  }

  return (
    <>
      {post.replyTo && (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            isReplyExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
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
          <img
            src={post.avatar}
            alt={post.username}
            className={`h-[45px] w-[45px] cursor-pointer rounded-full border-2 object-cover shadow-sm hover:opacity-90 ${colors.avatarBorder}`}
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

          <PostContent
            content={post.content}
            className={`prose dark:prose-invert max-w-none text-base leading-normal ${colors.textPrimary} dark:[&_blockquote]:rounded dark:[&_blockquote]:bg-[#3d3d3d] dark:[&_blockquote]:p-2 [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:shadow-md`}
            onMouseUp={handleMouseUp}
            colors={colors}
          />

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
}
