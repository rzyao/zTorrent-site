// @ts-nocheck
/**
 * 论坛页面（容器组件）
 * 职责�?
 * - 负责页面级状态（当前板块、搜索关键词、是否显示发帖表单等�?
 * - 通过自定�?Hooks 获取数据（板块列表、帖子列表、帖子详情、回复列表）
 * - 组装并渲染拆分后�?UI 组件（Header、Nav、List、Detail、Reply 等）
 * - 处理用户交互（发帖与回帖提交、跳转与滚动定位等）
 *
 * 设计要点�?
 * - 将“数据获取与业务逻辑”抽离到 hooks，通过 props 下发给展示组�?
 * - 将“Markdown/HTML 渲染、错误解包”等纯函数放�?utils，便于复用与测试
 * - 页面不直接关心具体展示细节，保持容器角色，提升可维护�?
 */
import { useState, useMemo } from "react";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { IForumThread, IForumPost } from "./types";
import { unwrapResponse, extractErrorMessage, renderPreview } from "@/utils/cn";
import { PageContainer } from "@/modules/app/components/PageContainer";
import { ForumHeader } from "./components/ForumHeader";
import { CategoryNav } from "./components/CategoryNav";
import { ThreadList } from "./components/ThreadList";
import { CreateThreadForm } from "./components/CreateThreadForm";
import { ThreadContent } from "./components/ThreadContent";
import { ReplyList } from "./components/ReplyList";
import { ReplyEditor } from "./components/ReplyEditor";
import { useForumCategories } from "./hooks/useForumCategories";
import { useForumThreads } from "./hooks/useForumThreads";
import { useForumThreadDetail } from "./hooks/useForumThreadDetail";
import { useForumPosts } from "./hooks/useForumPosts";

export default function ForumPage() {
  // 设置页面标题（浏览器标题随页面更新）
  useDynamicTitle("论坛");

  // 页面级状态：
  // - activeCategoryId 当前选中的板块（'all' 表示全部�?
  // - showNewPost 是否显示“发布新帖”表�?
  // - searchQuery 列表搜索关键�?
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Data Hooks：从后端/服务层拉取数据并管理加载与错�?
  // 板块列表（含虚拟“全部”项�?
  const { categories, error: catError } = useForumCategories();
  // 帖子列表（分页、搜索、板块筛选）
  const {
    threads,
    setThreads,
    total: threadsTotal,
    page,
    setPage,
    limit,
    loading: threadsLoading,
    error: threadsError,
    refresh: refreshThreads,
  } = useForumThreads({ categoryId: activeCategoryId, searchQuery });

  // Thread Detail Hook：帖子详情与浏览量统计（含防重复与乐观更新）
  const handleThreadUpdate = (updated: IForumThread) => {
    setThreads((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const {
    selectedThread,
    setSelectedThread,
    threadDetail,
    error: detailError,
  } = useForumThreadDetail(handleThreadUpdate);

  // Posts Hook：当前选中主题的回帖列�?
  const {
    posts,
    setPosts,
    total: postsTotal,
    page: postsPage,
    setPage: setPostsPage,
    limit: postsLimit,
    error: postsError,
    refresh: refreshPosts,
    postsMap,
  } = useForumPosts(selectedThread?.id);

  // 回复编辑状态：
  // - replyParentId 被回复的楼层 ID（用于楼中楼引用�?
  // - replyContent 回复内容
  // - replyError 回复提交错误
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);

  // Actions：用户行为处�?
  // 发帖提交：校验必填项，调用后端创建接口，刷新列表并切换到目标板块
  const handleNewPostSubmit = async (data: {
    title: string;
    content: string;
    categoryId: string;
  }) => {
    const { ForumThreadsService } = await import("@/api/services/ForumThreadsService");
    const resp = await ForumThreadsService.forumThreadsControllerCreate(data);
    unwrapResponse<IForumThread>(resp);
    setShowNewPost(false);
    setPage(1);
    setActiveCategoryId(data.categoryId);
    // 若仍在当前板块，主动刷新；若切换了板块，useForumThreads 的依赖会自动触发刷新
    if (activeCategoryId === data.categoryId) {
      refreshThreads();
    }
  };

  // 回帖提交：校验内容非空，调用后端创建接口，刷新回复列表并清理输入
  const handleReplySubmit = async () => {
    if (!selectedThread) return;
    try {
      const content = replyContent.trim();
      if (!content) {
        setReplyError("回复内容不能为空");
        return;
      }

      const { ForumPostsService } = await import("@/api/services/ForumPostsService");
      const resp = await ForumPostsService.forumPostsControllerCreate({
        threadId: selectedThread.id,
        content,
        parentId: replyParentId || undefined,
      });
      unwrapResponse<IForumPost>(resp);

      refreshPosts();
      setReplyContent("");
      setReplyParentId(null);
      setReplyError(null);
    } catch (err: any) {
      setReplyError(extractErrorMessage(err));
    }
  };

  // 正文 HTML：根据“详情内容优先，其次为列表项内容”生成展�?HTML
  const contentHtml = useMemo(
    () => renderPreview(threadDetail?.content ?? selectedThread?.content ?? ""),
    [threadDetail?.content, selectedThread?.content],
  );

  // 工具函数：根据板�?ID 获取名称（若未知则回退为原 ID�?
  const getCategoryName = (id?: string) => {
    if (!id) return "-";
    const found = categories.find((c) => c.id === id);
    return found?.name ?? id;
  };

  // 页面统一错误提示：聚合各数据源错�?
  const overallError = catError || threadsError || detailError || postsError;

  return (
    <PageContainer>
      {/* 页面头部：标题与“发布帖子”按�?*/}
      {/* <ForumHeader /> */}

      {/* 板块导航与搜索：切换板块时重置选中主题与分�?*/}
      <CategoryNav
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryChange={(id) => {
          setActiveCategoryId(id);
          setSelectedThread(null);
          setShowNewPost(false);
          setPage(1);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        onNewPost={() => {
          setShowNewPost(true);
        }}
      />

      <div>
        {showNewPost ? (
          // 发帖表单：独立封装内部表单状态与校验
          <CreateThreadForm
            categories={categories}
            initialCategoryId={activeCategoryId === "all" ? "" : activeCategoryId}
            onCancel={() => setShowNewPost(false)}
            onSubmit={handleNewPostSubmit}
          />
        ) : selectedThread ? (
          // 主题详情模式：显示正文、回复列表与回复编辑�?
          <div className="space-y-6">
            <ThreadContent
              thread={selectedThread}
              threadDetail={threadDetail}
              onClose={() => setSelectedThread(null)}
              onReplyClick={() => {
                const el = document.getElementById("reply-editor");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                // 简化聚焦逻辑：滚动后尝试聚焦编辑器内�?textarea
                setTimeout(() => {
                  const ta = document.querySelector(
                    "#reply-editor textarea",
                  ) as HTMLTextAreaElement | null;
                  if (ta) ta.focus();
                }, 100);
              }}
              contentHtml={contentHtml}
            />

            <ReplyList
              replies={posts}
              postsMap={postsMap}
              totalReplies={postsTotal}
              onReply={(reply) => {
                setReplyParentId(reply.id);
                const mention = `@${reply.authorUsername || reply.authorId} `;
                setReplyContent((prev) =>
                  prev.startsWith(mention) ? prev : mention + (prev || ""),
                );
                const el = document.getElementById("reply-editor");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              onViewOriginal={(pid) => {
                const el = document.getElementById(`reply-${pid}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                // 本地浏览数占位更新：查看原回复视为该楼层浏览 +1
                setPosts((prev) =>
                  prev.map((p) =>
                    p.id === pid ? { ...p, viewsCount: (p.viewsCount ?? 0) + 1 } : p,
                  ),
                );
              }}
            />

            <ReplyEditor
              content={replyContent}
              onChange={setReplyContent}
              replyParentId={replyParentId}
              replyParentUser={
                posts.find((p) => p.id === replyParentId)?.authorUsername ||
                posts.find((p) => p.id === replyParentId)?.authorId ||
                ""
              }
              onCancelReply={() => {
                setReplyParentId(null);
                setReplyContent((prev) => prev.replace(/^@[^\s]+\s/, ""));
              }}
              onSubmit={handleReplySubmit}
              isLocked={selectedThread.status === "locked"}
              error={replyError}
            />
          </div>
        ) : (
          // 列表模式：展示主题列表，点击进入详情模式
          <ThreadList
            threads={threads}
            onThreadSelect={(t) => {
              setSelectedThread(t);
              setPostsPage(1);
            }}
            getCategoryName={getCategoryName}
          />
        )}
      </div>

      {overallError && (
        // 全局错误提示条：显示当前页上任意数据源的错误
        <div className="mt-4">
          <div className="mx-4 rounded-lg border border-red-500/50 bg-red-500/15 px-4 py-3 text-red-300 md:mx-0">
            {overallError}
          </div>
        </div>
      )}
    </PageContainer>
  );
}

