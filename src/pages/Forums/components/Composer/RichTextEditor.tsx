import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { cn } from "@/components/ui/utils";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Smile, // Added Smile icon for emoji button
} from "lucide-react";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import * as Popover from "@radix-ui/react-popover";
import { LinkModal } from "./LinkModal";
import { useForumTheme } from "../../context/ForumThemeContext"; // Assuming this path is correct

/**
 * 富文本编辑器组件
 * 参考 Discourse ProseMirror 实现 (prosemirror-editor.gjs)
 *
 * 使用 TipTap (基于 ProseMirror 的 React 封装)
 */
interface RichTextEditorProps {
  /** 编辑器内容 (Markdown 或 HTML) */
  value: string;
  /** 内容变化回调 */
  onChange: (value: string) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 工具栏前缀内容 (如模式切换按钮) */
  toolbarPrefix?: React.ReactNode;
  /** 点击上传图片的回调 */
  onImageUploadClick?: () => void;
  /** 是否正在上传 */
  isUploading?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "开始输入...",
  disabled = false,
  className,
  toolbarPrefix,
  onImageUploadClick,
  isUploading = false,
}) => {
  const { theme } = useForumTheme();
  const [linkModal, setLinkModal] = React.useState<{ isOpen: boolean; initialText: string }>({
    isOpen: false,
    initialText: "",
  });
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 禁用部分默认扩展，使用自定义配置
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-sky-400 underline hover:text-sky-300",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-lg",
        },
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      // 将 HTML 转换为 Markdown 或直接输出 HTML
      // TODO: 实现 HTML -> Markdown 转换 (参考 Discourse serializer.js)
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert max-w-none",
          "min-h-[200px] w-full px-4 py-3 focus:outline-none",
          "text-gray-900 dark:text-neutral-100",
          // 标题样式
          "prose-headings:text-gray-900 prose-headings:font-semibold dark:prose-headings:text-white",
          "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
          // 链接样式
          "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-sky-400",
          // 代码块样式
          "prose-code:text-emerald-600 prose-code:bg-gray-100 prose-code:rounded prose-code:px-1 dark:prose-code:text-emerald-400 dark:prose-code:bg-neutral-800",
          "prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:bg-neutral-900 dark:prose-pre:border-neutral-700",
          // 引用块样式
          "prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-600 dark:prose-blockquote:border-l-sky-500 dark:prose-blockquote:text-neutral-300",
          // 列表样式
          "prose-li:marker:text-gray-400 dark:prose-li:marker:text-neutral-500",
        ),
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("rich-text-editor flex h-full flex-col", className)}>
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5 dark:border-neutral-700/50 dark:bg-neutral-800/50">
        {/* 工具栏前缀 (如模式切换按钮) */}
        {toolbarPrefix}

        {/* 历史操作 */}
        <ToolbarButton
          icon={<Undo className="h-4 w-4" />}
          title="撤销 (Ctrl+Z)"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        />
        <ToolbarButton
          icon={<Redo className="h-4 w-4" />}
          title="重做 (Ctrl+Shift+Z)"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        />

        <ToolbarDivider />

        {/* 文本格式 */}
        <ToolbarButton
          icon={<Bold className="h-4 w-4" />}
          title="粗体 (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        />
        <ToolbarButton
          icon={<Italic className="h-4 w-4" />}
          title="斜体 (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        />
        <ToolbarButton
          icon={<Strikethrough className="h-4 w-4" />}
          title="删除线 (Ctrl+Shift+S)"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        />
        <ToolbarButton
          icon={<Code className="h-4 w-4" />}
          title="行内代码 (Ctrl+E)"
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
        />

        <ToolbarDivider />

        {/* 标题 */}
        <ToolbarButton
          icon={<Heading1 className="h-4 w-4" />}
          title="标题 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
        />
        <ToolbarButton
          icon={<Heading2 className="h-4 w-4" />}
          title="标题 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        />
        <ToolbarButton
          icon={<Heading3 className="h-4 w-4" />}
          title="标题 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        />

        <ToolbarDivider />

        {/* 列表 */}
        <ToolbarButton
          icon={<List className="h-4 w-4" />}
          title="无序列表"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        />
        <ToolbarButton
          icon={<ListOrdered className="h-4 w-4" />}
          title="有序列表"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        />

        <ToolbarDivider />

        {/* 块级元素 */}
        <ToolbarButton
          icon={<Quote className="h-4 w-4" />}
          title="引用块"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        />
        <ToolbarButton
          icon={<Minus className="h-4 w-4" />}
          title="分隔线"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />

        <ToolbarDivider />

        {/* 表情 */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button
              className={cn(
                "rounded p-1.5 transition-colors",
                "text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white",
              )}
              title="插入表情"
            >
              <Smile className="h-4 w-4" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="z-[100] mt-2 shadow-xl outline-none"
              align="start"
              sideOffset={5}
            >
              <EmojiPicker
                theme={theme === "dark" ? EmojiTheme.DARK : EmojiTheme.LIGHT}
                onEmojiClick={(emojiData) => {
                  editor.chain().focus().insertContent(emojiData.emoji).run();
                }}
                autoFocusSearch={false}
                lazyLoadEmojis={true}
                searchPlaceHolder="搜索表情..."
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        <ToolbarDivider />

        {/* 插入 */}
        <ToolbarButton
          icon={<LinkIcon className="h-4 w-4" />}
          title="插入链接"
          onClick={() => {
            if (editor) {
              const { from, to } = editor.state.selection;
              const text = editor.state.doc.textBetween(from, to, " ");
              setLinkModal({ isOpen: true, initialText: text });
            }
          }}
          active={editor.isActive("link")}
        />
        <ToolbarButton
          icon={<ImageIcon className="h-4 w-4" />}
          title="上传图片"
          onClick={() => {
            if (onImageUploadClick) {
              onImageUploadClick();
            } else {
              const url = window.prompt("输入图片地址:");
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }
          }}
          disabled={isUploading}
        />
      </div>

      <LinkModal
        isOpen={linkModal.isOpen}
        initialText={linkModal.initialText}
        onClose={() => setLinkModal({ ...linkModal, isOpen: false })}
        onConfirm={(url, text) => {
          if (editor) {
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .insertContent({
                type: "text",
                text: text,
                marks: [
                  {
                    type: "link",
                    attrs: {
                      href: url,
                    },
                  },
                ],
              })
              .run();
          }
        }}
      />

      {/* 编辑器内容区域 */}
      <div className="flex-1 overflow-auto bg-white dark:bg-[#1a1a1a]">
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* 样式 - 空编辑器占位符 */}
      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #6b7280;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror {
          min-height: 200px;
        }
      `}</style>
    </div>
  );
};

// 工具栏按钮组件
interface ToolbarButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  title,
  onClick,
  active = false,
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "rounded p-1.5 transition-colors",
      active
        ? "bg-blue-600/10 text-blue-600 dark:bg-sky-500/20 dark:text-sky-400"
        : "text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white",
      disabled && "cursor-not-allowed opacity-40",
    )}
    title={title}
  >
    {icon}
  </button>
);

// 工具栏分隔线
const ToolbarDivider: React.FC = () => (
  <div className="mx-1 h-5 w-px bg-gray-200 dark:bg-neutral-700" />
);

export default RichTextEditor;
