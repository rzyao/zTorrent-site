import React, { useRef, useEffect, useMemo } from "react";
import { marked } from "marked";
import TurndownService from "turndown";
import { useComposerStore } from "./ComposerStore";
import { EditorToggleSwitch } from "./EditorToggleSwitch";
import { RichTextEditor } from "./RichTextEditor";
import { cn } from "@/utils/cn";
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
import { useAsyncAction } from "@/modules/app/hooks/useAsyncAction";
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

  // 用于跟踪上一次的编辑器模式
  const prevIsRichTextRef = useRef(isRichText);

  // HTML → Markdown 转换器
  const turndownService = useMemo(() => {
    const service = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
    });
    // 添加代码块规则
    service.addRule("fencedCodeBlock", {
      filter: (node) => {
        return (
          node.nodeName === "PRE" &&
          node.firstChild &&
          (node.firstChild as Element).nodeName === "CODE"
        );
      },
      replacement: (content, node) => {
        const codeNode = (node as HTMLElement).querySelector("code");
        const className = codeNode?.className || "";
        const langMatch = className.match(/language-(\w+)/);
        const lang = langMatch ? langMatch[1] : "";
        const code = codeNode?.textContent || content;
        return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
      },
    });

    // 添加外部引用块转换规则：将 blockquote (带 username: 格式) 转换为 [quote] 标签
    service.addRule("externalQuote", {
      filter: (node) => {
        if (node.nodeName !== "BLOCKQUOTE") return false;
        // 检查第一个 p 是否包含 "username:" 格式
        const firstP = node.querySelector("p");
        if (!firstP) return false;
        const text = firstP.textContent?.trim() || "";
        // 匹配 "username:" 格式（可能有 strong 标签包裹）
        return /^[^:]+:$/.test(text);
      },
      replacement: (content, node) => {
        const element = node as HTMLElement;
        const firstP = element.querySelector("p");
        const username = firstP?.textContent?.replace(/:$/, "").trim() || "unknown";

        // 获取引用内容（除第一个段落外的所有内容）
        const paragraphs = element.querySelectorAll("p");
        let quoteContent = "";
        for (let i = 1; i < paragraphs.length; i++) {
          quoteContent += (paragraphs[i].textContent || "") + "\n";
        }
        quoteContent = quoteContent.trim();

        // 生成 [quote] 格式，暂时没有 post 和 topic 信息时使用简化格式
        return `\n[quote="${username}"]\n${quoteContent}\n[/quote]\n\n`;
      },
    });

    return service;
  }, []);

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

  // 监听模式切换，进行格式转换
  useEffect(() => {
    const prevIsRichText = prevIsRichTextRef.current;
    prevIsRichTextRef.current = isRichText;

    // 如果模式没变化，不处理
    if (prevIsRichText === isRichText) return;
    // 空内容不转换
    if (!draft.body.trim()) return;

    if (isRichText) {
      // Markdown → HTML（切换到富文本模式）
      // 如果已经是 HTML，不转换
      if (!draft.body.trim().startsWith("<")) {
        // 预处理：将 [quote] 标签替换为占位符，避免 marked 处理
        let processedBody = draft.body;

        // 规范化换行符：将字面的 \\n 转换为实际换行符（如果存在）
        processedBody = processedBody.replace(/\\n/g, "\n");

        const quotePlaceholders: { placeholder: string; html: string }[] = [];
        let placeholderIndex = 0;

        // 匹配 [quote="username, post:x, topic:y"] 或 [quote="username"] 或 [quote]
        // 使用更宽松的匹配模式
        const quoteRegex = /\[quote(?:="([^"]*)")?\][\r\n]*([\s\S]*?)[\r\n]*\[\/quote\]/gi;

        processedBody = processedBody.replace(quoteRegex, (_, attrs, content) => {
          // 解析 username
          let username = "引用";
          if (attrs) {
            // attrs 可能是 "username" 或 "username, post:x, topic:y"
            const userMatch = attrs.match(/^([^,]+)/);
            if (userMatch) {
              username = userMatch[1].trim();
            }
          }
          // 确保内容的换行被正确处理
          const escapedContent = (content || "")
            .trim()
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>");

          // 使用 HTML 注释格式作为占位符，这样 marked 不会解析它
          const placeholder = `<!--QUOTE_PH_${placeholderIndex++}-->`;
          const html = `<blockquote><p><strong>${username}:</strong></p><p>${escapedContent}</p></blockquote>`;
          quotePlaceholders.push({ placeholder, html });
          return placeholder;
        });

        // 使用 marked 转换其他 Markdown 内容
        let html = marked.parse(processedBody, { async: false }) as string;

        // 将占位符替换回 HTML
        quotePlaceholders.forEach(({ placeholder, html: quoteHtml }) => {
          // 转义正则特殊字符
          const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          // 占位符可能被包裹在 <p> 标签中，需要处理
          html = html.replace(new RegExp(`<p>${escapedPlaceholder}</p>`, "g"), quoteHtml);
          html = html.replace(new RegExp(escapedPlaceholder, "g"), quoteHtml);
        });

        updateDraft({ body: html });
      }
    } else {
      // HTML → Markdown（切换到 Markdown 模式）
      // 如果内容以 < 开头，说明是 HTML，需要转换
      if (draft.body.trim().startsWith("<")) {
        const markdown = turndownService.turndown(draft.body);
        updateDraft({ body: markdown });
      }
    }
  }, [isRichText, draft.body, updateDraft, turndownService]);

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
        // 获取文件名作为 alt 文本（去除扩展名）
        const altText = file.name.replace(/\.[^/.]+$/, "") || "image";

        if (isRichText) {
          // 富文本模式：将图片 HTML 追加到内容中
          const imgHtml = `<img src="${imageUrl}" alt="${altText}" />`;
          updateDraft({ body: draft.body + imgHtml });
        } else {
          // Markdown 模式：使用标准 Markdown 图片语法
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const text = textarea.value;
            const imageMarkdown = `\n![${altText}](${imageUrl})\n`;
            const newText = text.substring(0, start) + imageMarkdown + text.substring(start);
            updateDraft({ body: newText });

            // 恢复光标位置到图片后
            setTimeout(() => {
              textarea.focus();
              const newPos = start + imageMarkdown.length;
              textarea.setSelectionRange(newPos, newPos);
            }, 0);
          }
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
            onClick={() => {
              const textarea = textareaRef.current;
              if (!textarea) return;

              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const text = textarea.value;
              const selectedText = text.substring(start, end);

              // 检查是否在 [quote] 标签内（外部引用）
              const textBeforeCursor = text.substring(0, start);
              const lastQuoteOpen = textBeforeCursor.lastIndexOf("[quote");
              const lastQuoteClose = textBeforeCursor.lastIndexOf("[/quote]");
              const isInExternalQuote = lastQuoteOpen > lastQuoteClose;

              if (isInExternalQuote && selectedText) {
                // 在外部引用内：创建嵌套引用
                const newContent = "\n> " + selectedText.split("\n").join("\n> ") + "\n";
                const newFullText = text.substring(0, start) + newContent + text.substring(end);
                updateDraft({ body: newFullText });

                setTimeout(() => {
                  textarea.focus();
                  // 选中新插入的嵌套引用内容
                  textarea.setSelectionRange(start, start + newContent.length);
                }, 0);
              } else if (selectedText) {
                // 选中文本时的智能 Toggle 逻辑
                const lines = selectedText.split("\n");
                // 检查是否所有非空行都以 > 开头
                const isAllQuoted = lines.every((line) => !line.trim() || line.startsWith("> "));

                let newContent: string;
                if (isAllQuoted) {
                  // 取消引用：移除每行开头的 "> "
                  newContent = lines
                    .map((line) => (line.startsWith("> ") ? line.substring(2) : line))
                    .join("\n");
                } else {
                  // 添加引用：每行开头加 "> "
                  newContent = lines.map((line) => `> ${line}`).join("\n");
                }

                const newFullText = text.substring(0, start) + newContent + text.substring(end);
                updateDraft({ body: newFullText });

                setTimeout(() => {
                  textarea.focus();
                  // 保持对转换后文本的选择
                  textarea.setSelectionRange(start, start + newContent.length);
                }, 0);
              } else {
                // 没有选中文本：正常添加引用符号
                insertText("\n> ");
              }
            }}
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
          value={(() => {
            // 将 Markdown 转换为 HTML 供 TipTap 使用
            // 如果内容已经是 HTML（以 < 开头），则直接使用
            if (draft.body.trim().startsWith("<")) {
              return draft.body;
            }
            // 否则转换 Markdown 为 HTML
            return marked.parse(draft.body, { async: false }) as string;
          })()}
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
      // 阻止 mousedown 默认行为，防止 textarea 失去焦点和选择被清除
      onMouseDown={(e) => e.preventDefault()}
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
