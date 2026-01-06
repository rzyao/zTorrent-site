import { useState, useCallback } from "react";
import { useComposerStore } from "../../../components/Composer/ComposerStore";
import { PostData } from "../types";

export function usePostSelection(
  post: PostData,
  postIndex: number,
  topicTitle?: string,
  topicId?: string,
) {
  const [selectionMenu, setSelectionMenu] = useState<{ x: number; y: number; text: string } | null>(
    null,
  );

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectionMenu(null);
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setSelectionMenu(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // 显示菜单
    setSelectionMenu({
      x: rect.left + rect.width / 2,
      y: rect.top, // 固定定位使用视口坐标
      text,
    });
  }, []);

  const handleQuote = useCallback(() => {
    if (!selectionMenu) return;

    const composer = useComposerStore.getState();
    const replyContextTitle = topicTitle
      ? `${topicTitle} (回复 #${postIndex} ${post.username})`
      : undefined;

    // 根据编辑器模式生成不同的引用格式
    let quoteContent: string;

    if (composer.isRichText) {
      // 富文本模式：使用 HTML blockquote，携带完整元数据
      const escapedText = selectionMenu.text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");

      const topicIdAttr = topicId ? `data-topic-id="${topicId}"` : "";
      const postIdAttr = post.id ? `data-post-id="${post.id}"` : "";

      quoteContent = `<blockquote 
        ${topicIdAttr}
        ${postIdAttr}
        data-username="${post.username}"
      ><p><strong>${post.username}:</strong></p><p>${escapedText}</p></blockquote><p></p>`;
    } else {
      // Markdown 模式：使用 [quote] 标签，携带完整元数据
      // 格式: [quote="username, post:postId, topic:topicId"]content[/quote]
      const parts = [`"${post.username}`];
      if (post.id && String(post.id).trim() !== "") parts.push(`post:${post.id}`);
      if (topicId && String(topicId).trim() !== "") parts.push(`topic:${topicId}`);

      const meta = parts.join(", ") + '"';

      quoteContent = `[quote=${meta}]\n${selectionMenu.text}\n[/quote]\n\n`;
    }

    // 创建引用信息
    const quoteInfo = {
      postId: post.id,
      username: post.username,
      floor: postIndex,
      content: selectionMenu.text,
    };

    if (!composer.isOpen) {
      composer.open("REPLY", {
        replyToPostId: post.id,
        replyToTitle: replyContextTitle,
        replyToTopicId: topicId,
        body: quoteContent,
        quotes: [quoteInfo],
        selectedQuoteIndex: 0,
      });
    } else {
      composer.appendContent(quoteContent);
      // 添加引用到列表
      composer.addQuote(quoteInfo);
      composer.updateDraft({
        replyToTitle: replyContextTitle,
      });
    }

    // 清除选区
    setSelectionMenu(null);
    window.getSelection()?.removeAllRanges();
  }, [selectionMenu, post, postIndex, topicTitle, topicId]);

  return {
    selectionMenu,
    setSelectionMenu,
    handleMouseUp,
    handleQuote,
  };
}
