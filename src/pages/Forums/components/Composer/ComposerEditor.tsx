import React, { useRef, useEffect } from "react";
import { useComposerStore } from "./ComposerStore";
import { EditorToggleSwitch } from "./EditorToggleSwitch";
import { RichTextEditor } from "./RichTextEditor";
import { cn } from "@/components/ui/utils";
import {
  Bold,
  Italic,
  Link,
  Quote,
  Code,
  Image,
  Smile,
  List,
  ListOrdered,
  Heading,
  Minus,
  Plus,
} from "lucide-react";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import * as Popover from "@radix-ui/react-popover";
import { ImagesService } from "@/api/services/ImagesService";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { LinkModal } from "./LinkModal";
import { useForumTheme } from "../../context/ForumThemeContext";

interface ComposerEditorProps {
  className?: string;
}

export const ComposerEditor: React.FC<ComposerEditorProps> = ({ className }) => {
  const { colors, theme } = useForumTheme();
  const { draft, updateDraft, isRichText, toggleEditorMode } = useComposerStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { execute: uploadImage, loading: isUploading } = useAsyncAction({
    loadingMessage: "正在上传图片...",
    successMessage: "图片上传成功",
    showErrorToast: true,
  });

  const [linkModal, setLinkModal] = React.useState<{ isOpen: boolean; initialText: string }>({
    isOpen: false,
    initialText: "",
  });

  // Ctrl+M 快捷键切换模式
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "m") {
        e.preventDefault();
        toggleEditorMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleEditorMode]);

  // 标题处理逻辑 (Discourse 风格: 循环切换 H1-H6)
  const applyHeading = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = textarea.value;

    // 找到当前行的起始位置
    const lastNewline = text.lastIndexOf("\n", start - 1);
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    // 找到当前行的结束位置
    const nextNewline = text.indexOf("\n", start);
    const lineEnd = nextNewline === -1 ? text.length : nextNewline;

    const currentLine = text.substring(lineStart, lineEnd);
    const headingMatch = currentLine.match(/^(#+)\s/);

    let newLine: string;
    let cursorOffset: number;

    if (headingMatch) {
      const level = headingMatch[1].length;
      if (level < 6) {
        // H1-H5 -> H(level+1)
        const newLevel = level + 1;
        newLine = "#".repeat(newLevel) + " " + currentLine.substring(headingMatch[0].length);
        cursorOffset = 1; // 增加了一个 #
      } else {
        // H6 -> 正文
        newLine = currentLine.substring(headingMatch[0].length);
        cursorOffset = -headingMatch[0].length;
      }
    } else {
      // 正文 -> H1
      newLine = "# " + currentLine;
      cursorOffset = 2; // 增加了 "# "
    }

    const newText = text.substring(0, lineStart) + newLine + text.substring(lineEnd);
    updateDraft({ body: newText });

    // 恢复焦点并调整光标位置
    setTimeout(() => {
      textarea.focus();
      const newPos = Math.max(0, Math.min(newText.length, start + cursorOffset));
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  // Basic toolbar actions (Markdown mode)
  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);

    let newText: string;
    let newCursorStart: number;
    let newCursorEnd: number;

    // 智能检测：如果已经包裹了相同的符号，则移除它们 (Unwrap)
    if (
      after &&
      text.substring(start - before.length, start) === before &&
      text.substring(end, end + after.length) === after
    ) {
      newText =
        text.substring(0, start - before.length) + selection + text.substring(end + after.length);
      newCursorStart = start - before.length;
      newCursorEnd = end - before.length;
    } else if (
      after &&
      selection.startsWith(before) &&
      selection.endsWith(after) &&
      selection.length >= before.length + after.length
    ) {
      // 另一种情况：选中的内容本身已经包含了包裹符号
      const innerSelection = selection.substring(before.length, selection.length - after.length);
      newText = text.substring(0, start) + innerSelection + text.substring(end);
      newCursorStart = start;
      newCursorEnd = start + innerSelection.length;
    } else {
      // 正常包裹 (Wrap)
      newText = text.substring(0, start) + before + selection + after + text.substring(end);
      newCursorStart = start + before.length;
      newCursorEnd = end + before.length;
    }

    updateDraft({ body: newText });

    // Restore cursor / focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 0);
  };

  const onEmojiClick = (emojiData: { emoji: string }) => {
    if (isRichText) {
      // 在完成的 TipTap 链中插入
      // 注意：RichTextEditor 目前没有暴露 editor 实例，
      // 我们需要一种方式让它接收外部插入或通过全局 store/event 发送
      // 暂时通过 updateDraft 处理字符串，但 TipTap 需要处理 HTML/JSON
    } else {
      insertText(emojiData.emoji);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 转换为 base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Content = reader.result as string;
      const result = await uploadImage(async () => {
        return await ImagesService.imagesControllerUpload({
          content: base64Content,
          filename: file.name,
          mimeType: file.type,
        });
      });

      if (result?.data?.url) {
        const imageUrl = result.data.url;
        if (isRichText) {
          // TODO: 虽然 RichTextEditor 没暴露实例，但我们可以先通过 draft 更新，
          // 理想情况应通过 ref 调用 editor.chain().focus().setImage({ src: imageUrl }).run()
        } else {
          insertText("![", `](${imageUrl})`);
        }
      }
      // 清空 input 方便下次上传同名文件
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleLinkClick = () => {
    const textarea = textareaRef.current;
    let initialText = "";
    if (textarea) {
      initialText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    }
    setLinkModal({ isOpen: true, initialText });
  };

  const onLinkConfirm = (url: string, text: string) => {
    insertText("[", `](${url})`);
    // 如果 insertText 内部没处理 text，我们需要稍微调整逻辑
    // 既然我们选中的文字已经作为 initialText 传入了，insertText 会在两侧加上 [] 和 ()
    // 但如果用户在模态框改了 text，我们需要替换它。

    // 简便起见，重新实现针对链接的插入
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const newLinkText = `[${text}](${url})`;
    const newText = currentText.substring(0, start) + newLinkText + currentText.substring(end);
    updateDraft({ body: newText });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newLinkText.length, start + newLinkText.length);
    }, 0);
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-md border",
        colors.borderColor,
        colors.inputBg,
        colors.textPrimary,
        className,
      )}
    >
      {/* Toolbar - 仅 Markdown 模式显示 */}
      {!isRichText && (
        <div
          className={cn(
            "flex items-center gap-1 overflow-x-auto border-b p-2",
            colors.borderColor,
            colors.inputBg,
          )}
        >
          {/* Mode Toggle Switch - 左侧 */}
          <EditorToggleSwitch isRichText={isRichText} onToggle={toggleEditorMode} />
          <div className={cn("mx-2 h-5 w-px border-r", colors.dividerColor)}></div>

          {/* Formatting Buttons */}
          <ToolbarButton
            icon={<Bold className="h-4 w-4" />}
            title="粗体 (Ctrl+B)"
            onClick={() => insertText("**", "**")}
          />
          <ToolbarButton
            icon={<Italic className="h-4 w-4" />}
            title="斜体 (Ctrl+I)"
            onClick={() => insertText("*", "*")}
          />
          <ToolbarButton
            icon={<Heading className="h-4 w-4" />}
            title="标题 (H1-H6 循环)"
            onClick={applyHeading}
          />
          <div className={cn("mx-1 h-4 w-px border-r", colors.dividerColor)}></div>
          <ToolbarButton
            icon={<Link className="h-4 w-4" />}
            title="插入链接"
            onClick={handleLinkClick}
          />
          <ToolbarButton
            icon={<Quote className="h-4 w-4" />}
            title="引用"
            onClick={() => insertText("\n> ")}
          />
          <ToolbarButton
            icon={<Code className="h-4 w-4" />}
            title="代码"
            onClick={() => insertText("`", "`")}
          />
          <ToolbarButton
            icon={<Image className="h-4 w-4" />}
            title="上传图片"
            onClick={triggerFileUpload}
            disabled={isUploading}
          />
          <div className={cn("mx-1 h-4 w-px border-r", colors.dividerColor)}></div>
          <ToolbarButton
            icon={<List className="h-4 w-4" />}
            title="无序列表"
            onClick={() => insertText("\n- ")}
          />
          <ToolbarButton
            icon={<ListOrdered className="h-4 w-4" />}
            title="有序列表"
            onClick={() => insertText("\n1. ")}
          />
          <div className={cn("mx-1 h-4 w-px border-r", colors.dividerColor)}></div>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                className={cn(
                  "rounded p-2 transition-colors",
                  colors.textSecondary,
                  colors.listHover,
                )}
                title="插入表情"
              >
                <Smile className="h-4 w-4" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="z-100 mt-2 shadow-xl outline-none"
                align="start"
                sideOffset={5}
              >
                <EmojiPicker
                  theme={theme === "dark" ? EmojiTheme.DARK : EmojiTheme.LIGHT}
                  onEmojiClick={onEmojiClick}
                  autoFocusSearch={false}
                  lazyLoadEmojis={true}
                  searchPlaceHolder="搜索表情..."
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <ToolbarButton
            icon={<Plus className="h-4 w-4" />}
            title="更多"
            onClick={() => alert("WIP: 更多选项")}
          />
        </div>
      )}

      {/* Text Area (Markdown Mode) / Rich Text Editor */}
      {!isRichText ? (
        <textarea
          ref={textareaRef}
          className={cn(
            "w-full flex-1 resize-none border-none bg-transparent p-4 font-mono text-base leading-relaxed focus:outline-none",
            colors.textPrimary,
            "placeholder:text-neutral-500", // Placeholder 颜色 theme 中没有完美的，保留 neutral
          )}
          placeholder="在此处输入。使用工具栏或 Markdown 进行格式化。拖放或粘贴图片。"
          value={draft.body}
          onChange={(e) => updateDraft({ body: e.target.value })}
        />
      ) : (
        <RichTextEditor
          value={draft.body}
          onChange={(value) => updateDraft({ body: value })}
          placeholder="开始输入您的内容..."
          className="flex-1"
          onImageUploadClick={triggerFileUpload}
          isUploading={isUploading}
          toolbarPrefix={
            <>
              <EditorToggleSwitch isRichText={isRichText} onToggle={toggleEditorMode} />
              <div className="mx-2 h-5 w-px bg-neutral-600" />
            </>
          }
        />
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      <LinkModal
        isOpen={linkModal.isOpen}
        initialText={linkModal.initialText}
        onClose={() => setLinkModal({ ...linkModal, isOpen: false })}
        onConfirm={onLinkConfirm}
      />

      {/* Footer */}
      <div
        className={cn(
          "flex justify-between border-t px-3 py-1 text-xs",
          colors.borderColor,
          colors.inputBg,
          colors.textMuted,
        )}
      >
        <span>{isRichText ? "富文本模式" : "Markdown 已启用"}</span>
        <span>{draft.body.length} 字符</span>
      </div>
    </div>
  );
};

const ToolbarButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
}> = ({ icon, title, onClick, disabled }) => {
  const { colors } = useForumTheme();
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded p-2 transition-colors",
        colors.textSecondary,
        colors.listHover,
        disabled && "cursor-not-allowed opacity-50",
      )}
      title={title}
    >
      {icon}
    </button>
  );
};
