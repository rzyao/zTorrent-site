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
import { useForumTheme } from "../../context/ForumThemeContext";

interface ComposerEditorProps {
  className?: string;
}

export const ComposerEditor: React.FC<ComposerEditorProps> = ({ className }) => {
  const { colors } = useForumTheme();
  const { draft, updateDraft, isRichText, toggleEditorMode } = useComposerStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Basic toolbar actions (Markdown mode)
  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);

    const newText = text.substring(0, start) + before + selection + after + text.substring(end);
    updateDraft({ body: newText });

    // Restore cursor / focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
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
            title="标题"
            onClick={() => insertText("\n## ", "")}
          />
          <div className={cn("mx-1 h-4 w-px border-r", colors.dividerColor)}></div>
          <ToolbarButton
            icon={<Link className="h-4 w-4" />}
            title="插入链接"
            onClick={() => insertText("[", "](url)")}
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
            onClick={() => alert("WIP: 图片上传")}
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
          <ToolbarButton
            icon={<Smile className="h-4 w-4" />}
            title="插入表情"
            onClick={() => insertText(":")}
          />
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
          toolbarPrefix={
            <>
              <EditorToggleSwitch isRichText={isRichText} onToggle={toggleEditorMode} />
              <div className="mx-2 h-5 w-px bg-neutral-600" />
            </>
          }
        />
      )}

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

const ToolbarButton: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void }> = ({
  icon,
  title,
  onClick,
}) => {
  const { colors } = useForumTheme();
  return (
    <button
      onClick={onClick}
      className={cn("rounded p-2 transition-colors", colors.textSecondary, colors.listHover)}
      title={title}
    >
      {icon}
    </button>
  );
};
