import React, { useEffect, useRef, useState } from "react";
import { useComposerStore } from "./ComposerStore";
import { ComposerInputs } from "./ComposerInputs";
import { ComposerEditor } from "./ComposerEditor";
import { ComposerPreview } from "./ComposerPreview";
import { cn } from "@/utils/cn";
import { Minimize2, Maximize2, X, ChevronsDown, ChevronsUp, Send } from "lucide-react";
import { Button } from "@/modules/forum/components/ui/button";
import { ForumsTopicsService, ForumsPostsService } from "@/api";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/modules/forum/components/ui/tooltip";
import { useForumTheme } from "../../context/ForumThemeContext";
import { useQueryClient } from "@tanstack/react-query";
import { QuoteTargetPicker } from "./QuoteTargetPicker";

export const ForumComposer: React.FC = () => {
  const {
    isOpen,
    viewState,
    composerHeight,
    setHeight,
    minimize,
    maximize,
    restore,
    close,
    mode,
    draft,
    reset,
    isRichText,
    discardDraft, // 新增
  } = useComposerStore();

  const { colors } = useForumTheme(); // 获取主题变量
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isResizing, setIsResizing] = useState(false);
  const composerRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(true); // Toggle preview

  // Handle Resize Logic
  // Handle Resize Logic
  useEffect(() => {
    // 拖动处理函数
    const handleMouseMove = (e: MouseEvent) => {
      // 直接操作 DOM 避免 React 渲染造成的卡顿
      if (composerRef.current) {
        const newHeight = window.innerHeight - e.clientY;
        // 限制高度范围
        if (newHeight >= 200 && newHeight <= window.innerHeight - 50) {
          composerRef.current.style.height = `${newHeight}px`;
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);

      // 更新最终状态
      if (composerRef.current) {
        // 从当前 DOM 高度同步回 React state
        const currentHeight = parseInt(composerRef.current.style.height || "0", 10);
        if (currentHeight) {
          setHeight(currentHeight);
        }
        // 延迟恢复 transition，确保高度已更新
        setTimeout(() => {
          if (composerRef.current) {
            composerRef.current.style.transition = "height 200ms, max-width 200ms, transform 200ms";
          }
        }, 50);
      }

      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    if (isResizing) {
      // 立即禁用 transition 避免拖动卡顿
      if (composerRef.current) {
        composerRef.current.style.transition = "none";
      }
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      // 恢复 transition
      if (composerRef.current) {
        composerRef.current.style.transition = "";
      }
    };
  }, [isResizing, setHeight]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Submit
  const handleSubmit = async () => {
    if (!draft.body.trim()) {
      toast.error("请输入正文内容");
      return;
    }

    if (mode === "CREATE_TOPIC" && (!draft.title.trim() || !draft.categoryId)) {
      toast.error("请输入标题并选择分类");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "CREATE_TOPIC") {
        const res = await ForumsTopicsService.topicsControllerCreate({
          title: draft.title,
          content: draft.body,
          categoryId: draft.categoryId,
          // tags: draft.tags,  // Temporarily removed due to type definition mismatch
        });

        const topicId = (res.data as any)?.id || (res.data as any)?._id;

        if (topicId) {
          toast.success("话题创建成功");
          reset();
          navigate(`/forum/topic/${topicId}`);
        }
      } else if (mode === "REPLY") {
        if (!draft.replyToTopicId) {
          toast.error("回复目标丢失（Topic ID missing）");
          setIsSubmitting(false);
          return;
        }

        // 过滤掉前端生成的临时 OP ID (topic-xxx)
        const replyToId =
          draft.replyToPostId && draft.replyToPostId.startsWith("topic-")
            ? undefined
            : draft.replyToPostId;

        const res = await ForumsPostsService.postsControllerCreate({
          topicId: draft.replyToTopicId,
          content: draft.body,
          replyToId: replyToId,
        });

        if (res.data) {
          toast.success("回复发布成功");
          reset();

          if (window.location.pathname.includes(`/forum/topic/${draft.replyToTopicId}`)) {
            // 获取新帖子的话题内楼层号
            const responseData = res.data as any;
            const newPostNumber = responseData.postNumber || responseData.post_number;

            console.log("[ForumComposer] 回复成功，响应数据:", responseData);
            console.log("[ForumComposer] 话题内楼层号:", newPostNumber);

            // 先刷新所有该话题的帖子缓存（使用前缀匹配）
            await queryClient.invalidateQueries({
              queryKey: ["forum", "posts", draft.replyToTopicId],
              exact: false, // 匹配所有以此为前缀的 queryKey
            });
            await queryClient.invalidateQueries({
              queryKey: ["forum", "topic", draft.replyToTopicId],
            });

            if (newPostNumber) {
              // Discourse 风格：通过路由跳转触发定位
              setTimeout(() => {
                navigate(`/forum/topic/${draft.replyToTopicId}/${newPostNumber}`, {
                  replace: true,
                });
              }, 100);
            } else {
              // 如果后端没有返回 postNumber，滚动到底部
              setTimeout(() => {
                const scrollContainer = document.getElementById("forum-scroll-container");
                if (scrollContainer) {
                  scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: "smooth",
                  });
                }
              }, 500);
            }
          } else {
            // 不在当前话题页面：直接跳转到新帖子
            const responseData = res.data as any;
            const newPostNumber = responseData.postNumber || responseData.post_number;
            navigate(
              `/forum/topic/${draft.replyToTopicId}${newPostNumber ? `/${newPostNumber}` : ""}`,
            );
          }
        }
      }
    } catch (error: any) {
      // 错误提示已由 Axios 拦截器统一处理，此处仅记录日志
      console.error("[ForumComposer] 发布失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isFullscreen = viewState === "FULLSCREEN";
  const isMinimized = viewState === "MINIMIZED";
  const isCreateTopic = mode === "CREATE_TOPIC";

  // 是否隐藏预览：富文本模式或用户手动隐藏
  const isPreviewHidden = isRichText || !showPreview;

  return (
    <div
      ref={composerRef}
      className={cn(
        // 基础样式 - 参考 Discourse #reply-control
        "fixed right-0 bottom-0 left-0 z-50 mx-auto flex w-full flex-col rounded-t-lg border-x border-t shadow-2xl",
        colors.listBg, // 背景色
        colors.textPrimary, // 文本色
        colors.borderColor, // 边框色
        // 全屏模式 - 只改变高度，宽度跟随编辑器模式
        isFullscreen && "rounded-t-none",
        // 最小化模式
        isMinimized && "h-auto",
        // 宽度始终跟随编辑器模式 (参考 Discourse)
        isPreviewHidden
          ? "max-w-[740px]" // 隐藏预览时 / 富文本模式: 740px
          : "max-w-[1475px]", // 显示预览时: 1475px
      )}
      style={{
        // 全屏时高度为视口全高，保持 bottom-0 定位使动画向上扩展
        height: isFullscreen ? "100vh" : isMinimized ? "auto" : `${composerHeight}px`,
      }}
    >
      {/* Grippie - 参考 Discourse 样式 (纯 CSS 横条) */}
      {!isFullscreen && !isMinimized && (
        <div
          className="flex w-full cursor-ns-resize items-center justify-center py-2"
          onMouseDown={() => setIsResizing(true)}
        >
          {/* 横条指示器 */}
          <div className="h-1 w-12 rounded-full bg-neutral-600 transition-colors hover:bg-neutral-500" />
        </div>
      )}

      {/* Header */}
      <div
        className={cn(
          "bg-muted/10 flex items-center justify-between px-4 py-1",
          isMinimized ? "cursor-pointer" : "border-b border-gray-200 dark:border-neutral-700/50",
        )}
        onClick={isMinimized ? maximize : undefined}
      >
        <div className="text-md flex items-center gap-2 font-semibold">
          <span>
            {isMinimized ? "正在编辑话题..." : isCreateTopic ? "创建新话题" : "回复话题："}
          </span>
          {/* Reply Context Info */}
          {!isCreateTopic && !isMinimized && draft.replyToTopicId && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={`/forum/topic/${draft.replyToTopicId}`}
                  className="text-sm font-normal text-sky-500 underline decoration-sky-500/30 underline-offset-2 hover:text-sky-600"
                >
                  {draft.replyToTitle || (draft.replyToPostId ? `#${draft.replyToPostId}` : "主题")}
                </Link>
              </TooltipTrigger>
              <TooltipContent>点击查看话题</TooltipContent>
            </Tooltip>
          )}
          {/* Multi-Quote Picker - 引用了多个帖子时显示 */}
          {!isCreateTopic && !isMinimized && draft.quotes.length > 1 && <QuoteTargetPicker />}
        </div>

        <div className="flex items-center gap-2">
          {/* 预览切换按钮 - 仅 Markdown 模式显示 */}
          {!isMinimized && !isRichText && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                "hidden rounded px-2 py-1 text-xs transition-all duration-200 sm:block",
                showPreview
                  ? cn(colors.buttonSecondary, "font-medium") // Active
                  : cn(colors.textSecondary, colors.listHover), // Inactive
              )}
            >
              {showPreview ? "隐藏预览" : "显示预览"}
            </button>
          )}
          {/* 最小化/恢复按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isMinimized) {
                restore();
              } else {
                minimize();
              }
            }}
            className={cn(
              "cursor-pointer rounded p-1.5 transition-colors hover:text-[#0088CC]",
              colors.textSecondary,
              colors.listHover,
            )}
            title={isMinimized ? "恢复" : "最小化"}
          >
            {isMinimized ? (
              <ChevronsUp className="h-5 w-5" />
            ) : (
              <ChevronsDown className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximize();
            }}
            className={cn(
              "cursor-pointer rounded p-1.5 transition-colors hover:text-[#0088CC]",
              colors.textSecondary,
              colors.listHover,
            )}
            title={isFullscreen ? "退出全屏" : "全屏"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className={cn(
              "cursor-pointer rounded p-1.5 transition-colors hover:text-red-400",
              colors.textSecondary,
              colors.listHover,
            )}
            title="关闭"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      {!isMinimized && (
        <div className="flex flex-1 flex-col gap-3 overflow-hidden p-4">
          {/* Inputs Section */}
          {isCreateTopic && <ComposerInputs />}

          {/* Editor & Preview Split View - 富文本模式不显示预览 */}
          <div className="flex min-h-0 flex-1 gap-4">
            <div
              className={cn(
                "h-full min-w-0 transition-all duration-300 ease-in-out",
                showPreview && !isRichText ? "flex-1" : "w-full flex-1",
              )}
            >
              <ComposerEditor className="h-full" />
            </div>
            {/* 预览面板 - Markdown 模式且 showPreview 为 true 时显示 */}
            <div
              className={cn(
                "hidden h-full min-w-0 rounded-md border transition-all duration-300 ease-in-out sm:block",
                "border-gray-200 bg-white dark:border-neutral-700/50 dark:bg-neutral-900/50",
                showPreview && !isRichText
                  ? "flex-1 opacity-100"
                  : "w-0 shrink-0 overflow-hidden opacity-0",
              )}
            >
              <ComposerPreview className="h-full" />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-muted-foreground text-xs">
              {/* Status message (Saved / Drafting...) */}
              <span className="text-green-600/80">Draft saved</span>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={() => discardDraft()}>
                舍弃
              </Button>
              <Button variant="primary" size="sm" onClick={handleSubmit} loading={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                发布 {isCreateTopic ? "话题" : "回复"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
