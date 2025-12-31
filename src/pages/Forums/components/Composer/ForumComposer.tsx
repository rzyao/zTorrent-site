import React, { useEffect, useRef, useState } from "react";
import { useComposerStore } from "./ComposerStore";
import { ComposerInputs } from "./ComposerInputs";
import { ComposerEditor } from "./ComposerEditor";
import { ComposerPreview } from "./ComposerPreview";
import { cn } from "@/components/ui/utils";
import { Minimize2, Maximize2, X, ChevronsDown, ChevronsUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ForumsTopicsService, ForumsPostsService } from "@/api";
import { toast } from "sonner";
import { useForumTheme } from "../../context/ForumThemeContext";

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
  } = useComposerStore();

  const { colors } = useForumTheme(); // 获取主题变量

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

    const handleMouseUp = (e: MouseEvent) => {
      setIsResizing(false);

      // 更新最终状态
      if (composerRef.current) {
        // 从当前 DOM 高度同步回 React state
        const currentHeight = parseInt(composerRef.current.style.height || "0", 10);
        if (currentHeight) {
          setHeight(currentHeight);
        }
      }

      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, setHeight]);

  // Handle Submit
  const handleSubmit = async () => {
    if (!draft.body.trim()) {
      toast.error("请输入正文内容");
      return;
    }

    if (mode === "CREATE_TOPIC" && (!draft.title.trim() || !draft.categoryId)) {
      toast.error("请输入タイトル并选择分类");
      return;
    }

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
          window.location.href = `/forum/topic/${topicId}`;
        }
      } else if (mode === "REPLY") {
        if (!draft.replyToTopicId) {
          toast.error("回复目标丢失（Topic ID missing）");
          return;
        }

        const res = await ForumsPostsService.postsControllerCreate({
          topicId: draft.replyToTopicId,
          content: draft.body,
          replyToId: draft.replyToPostId, // Fixed param name
        });

        if (res.data) {
          toast.success("回复发布成功");
          reset();
          if (window.location.pathname.includes(`/forum/topic/${draft.replyToTopicId}`)) {
            window.location.reload();
          } else {
            window.location.href = `/forum/topic/${draft.replyToTopicId}`;
          }
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "发布失败");
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
        "fixed right-0 bottom-0 left-0 z-50 mx-auto flex w-full flex-col rounded-t-lg border shadow-2xl ease-in-out",
        colors.listBg, // 背景色
        colors.textPrimary, // 文本色
        colors.borderColor, // 边框色
        // 仅在非拖动时启用过渡动画，避免拖动卡顿。明确指定过渡属性以提升性能并匹配 Discourse
        !isResizing && "transition-[height,max-width,transform] duration-200",
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
          "bg-muted/10 flex items-center justify-between border-b px-4 py-2",
          isMinimized ? "cursor-pointer" : "",
        )}
        onClick={isMinimized ? maximize : undefined}
      >
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>{isMinimized ? "正在编辑话题..." : isCreateTopic ? "创建新话题" : "回复话题"}</span>
          {/* Reply Context Info */}
          {!isCreateTopic && !isMinimized && (
            <span className="text-muted-foreground ml-2 text-xs font-normal">
              正在回复 {draft.replyToPostId ? `#${draft.replyToPostId}` : "主题"}
            </span>
          )}
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
              "rounded p-1.5 transition-colors",
              colors.textSecondary,
              colors.listHover,
            )}
            title={isMinimized ? "恢复" : "最小化"}
          >
            {isMinimized ? (
              <ChevronsUp className="h-4 w-4" />
            ) : (
              <ChevronsDown className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximize();
            }}
            className={cn(
              "rounded p-1.5 transition-colors",
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
              "rounded p-1.5 transition-colors",
              colors.textSecondary,
              colors.listHover,
            )}
            title="关闭"
          >
            <X className="h-4 w-4" />
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
                "hidden h-full min-w-0 rounded-md border border-neutral-700/50 bg-neutral-900/50 transition-all duration-300 ease-in-out sm:block",
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
              <Button variant="ghost" onClick={() => close()}>
                取消
              </Button>
              <Button onClick={handleSubmit} className="gap-2">
                <Send className="h-4 w-4" />
                发布 {isCreateTopic ? "话题" : "回复"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
