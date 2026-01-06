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
    // 编辑器创建后，将光标移动到文档末尾的引用块外部
    onCreate: ({ editor }) => {
      // 使用 setTimeout 确保 DOM 更新后再移动光标
      setTimeout(() => {
        // 先移动到文档末尾
        editor.commands.focus("end");

        // 检查当前是否在 blockquote 内
        if (editor.isActive("blockquote")) {
          // 退出 blockquote，在其后添加新段落
          editor
            .chain()
            .focus()
            .setTextSelection(editor.state.doc.content.size) // 移动到最后
            .liftEmptyBlock() // 尝试退出当前块
            .run();

          // 如果仍在 blockquote 中，插入一个新段落
          if (editor.isActive("blockquote")) {
            editor
              .chain()
              .focus()
              .insertContentAt(editor.state.doc.content.size, { type: "paragraph" })
              .focus("end")
              .run();
          }
        }
      }, 10);
    },
  });

  // 同步外部 value 变化到编辑器
  // 当从 Markdown 切换到富文本时，或者点击外部引用按钮时，需要更新编辑器内容
  React.useEffect(() => {
    if (!editor) return;

    // 如果编辑器已经聚焦，说明是用户正在操作（包括点击工具栏按钮），
    // 此时编辑器本身就是内容的源头，不需要（也不应该）从外部同步 value，
    // 否则会导致 selection 和 focus 丢失。
    if (editor.isFocused) return;

    const currentContent = editor.getHTML();
    if (value !== currentContent) {
      // 检查内容是否真的不同（避免不必要的更新和光标跳动）
      // 移除空白差异比较
      const normalizedValue = value.replace(/\s+/g, " ").trim();
      const normalizedContent = currentContent.replace(/\s+/g, " ").trim();

      if (normalizedValue !== normalizedContent) {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }
  }, [editor, value]);

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
          onClick={() => {
            const { $from, $to } = editor.state.selection;
            let externalQuoteDepth = -1;
            let totalBlockquotes = 0;
            let innerBlockquoteDepth = -1;

            // 检查路径中的所有引用块
            for (let d = $from.depth; d > 0; d--) {
              const node = $from.node(d);
              if (node.type.name === "blockquote") {
                totalBlockquotes++;
                if (innerBlockquoteDepth === -1) innerBlockquoteDepth = d;

                // 检查是否为外部引用（带用户名格式）
                if (node.firstChild && node.firstChild.type.name === "paragraph") {
                  let paraText = "";
                  node.firstChild.forEach((child) => {
                    if (child.isText || child.type.name === "text") {
                      paraText += child.text;
                    }
                  });
                  if (/^[^:]+:\s*$/.test(paraText.trim())) {
                    externalQuoteDepth = d;
                  }
                }
              }
            }

            // 情况 1: 在外部引用内
            if (externalQuoteDepth !== -1) {
              // 如果我们在外部引用里的另一个引用内，说明是嵌套引用，现在点击应该是"取消"
              if (totalBlockquotes > 1 && innerBlockquoteDepth > externalQuoteDepth) {
                // 取消嵌套引用 (Lift)
                const { from, to } = editor.state.selection;
                editor.chain().focus().lift("blockquote").run();
                // 尝试恢复选区（位置可能会有偏移，blockquote 开启/闭合 -1Each -> -2?
                // 但 lift 会处理位置，通常不需要手动 set，除非失效）
              } else {
                // 在外部引用内，但还没嵌套：创建嵌套引用
                const { from: selFrom, to: selTo } = editor.state.selection;
                const isSelectionEmpty = selFrom === selTo;

                if (!isSelectionEmpty) {
                  const selectedText = editor.state.doc.textBetween(selFrom, selTo, "\n");
                  const startPos = selFrom;

                  // 处理多行文本：按换行符分割并创建段落
                  const paragraphs = selectedText.split("\n");
                  const content = paragraphs.map((text) => ({
                    type: "paragraph",
                    content: text ? [{ type: "text", text }] : [],
                  }));

                  // 计算插入内容的总长度
                  // blockquote: start(1) + end(1) = 2
                  // 每个段落: start(1) + end(1) + text.length = 2 + length
                  const totalLength = 2 + paragraphs.reduce((acc, p) => acc + 2 + p.length, 0);

                  editor
                    .chain()
                    .focus()
                    .deleteSelection()
                    .insertContent({
                      type: "blockquote",
                      content: content,
                    })
                    // 调整选区：+1 偏移量用于修正嵌套引用时的节点位置计算
                    .setTextSelection({
                      from: startPos + 1,
                      to: startPos + totalLength - 3,
                    })
                    .run();
                } else {
                  // 没选文字，在当前行创建引用块
                  editor.chain().focus().toggleBlockquote().run();
                }
              }
            } else {
              // 情况 2: 不在外部引用内，使用标准 toggle
              editor.chain().focus().toggleBlockquote().run();
            }
          }}
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
              className="z-100 mt-2 shadow-xl outline-none"
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
        /* 移除引用块的引号装饰 */
        .ProseMirror blockquote {
          font-style: normal;
          background-color: #F9F9F9;
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
        }
        .dark .ProseMirror blockquote {
          background-color: rgba(38, 38, 38, 0.5);
        }
        /* 外部引用样式 */
        .ProseMirror blockquote.external-quote {
          border-left-color: #3b82f6;
        }
        /* 隐藏外部引用标记 */
        .ProseMirror .external-quote-marker {
          display: none !important;
        }
        /* 嵌套引用块样式 - 更深的背景色 */
        .ProseMirror blockquote blockquote {
          background-color: #E8F4FC;
          border-left-color: #3b82f6;
          margin: 0.5rem 0;
        }
        .dark .ProseMirror blockquote blockquote {
          background-color: rgba(59, 130, 246, 0.15);
        }
        /* 更深层的嵌套 */
        .ProseMirror blockquote blockquote blockquote {
          background-color: #D1E9FA;
        }
        .dark .ProseMirror blockquote blockquote blockquote {
          background-color: rgba(59, 130, 246, 0.25);
        }
        .ProseMirror blockquote::before,
        .ProseMirror blockquote::after {
          content: none !important;
        }
        .ProseMirror blockquote p::before,
        .ProseMirror blockquote p::after {
          content: none !important;
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
    // 阻止 mousedown 默认行为，防止编辑器失去焦点和选择被清除
    onMouseDown={(e) => e.preventDefault()}
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
