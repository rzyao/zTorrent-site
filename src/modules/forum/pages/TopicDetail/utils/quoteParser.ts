import { QuoteData } from "../components/QuoteBlock";

/**
 * 解析 HTML 中的 blockquote，提取引用信息
 * 返回分段内容：普通 HTML 和引用块交替
 */
export interface ContentSegment {
  type: "html" | "quote";
  content: string;
  quoteData?: QuoteData;
}

// BBCode [quote] 解析器
export function processBBCodeQuotes(text: string): string {
  // 正则匹配 [quote="username, post:x, topic:y"]content[/quote]
  // 同时支持 [quote=username]
  return text.replace(
    /\[quote="?([^",]+)(?:,\s*post:([^",]+))?(?:,\s*topic:([^",\]]+))?"?\]([\s\S]*?)\[\/quote\]/gi,
    (match, username, postId, topicId, content) => {
      const dataAttrs = [
        `data-username="${username.trim()}"`,
        postId ? `data-post-id="${postId.trim()}"` : "",
        topicId ? `data-topic-id="${topicId.trim()}"` : "",
      ]
        .filter(Boolean)
        .join(" ");

      // 确保内容后续作为 Markdown 处理，但包裹在 HTML 中
      // 我们使用 parseContentWithQuotes 可识别的特定结构
      return `<blockquote ${dataAttrs}><p><strong>${username.trim()}:</strong></p>\n${content}\n</blockquote>`;
    },
  );
}

export function parseContentWithQuotes(html: string): ContentSegment[] {
  const segments: ContentSegment[] = [];

  // 匹配 blockquote 标签
  // 格式: <blockquote ...options>...</blockquote>
  const blockquoteRegex = /<blockquote([^>]*)>([\s\S]*?)<\/blockquote>/gi;

  let lastIndex = 0;
  let match;

  while ((match = blockquoteRegex.exec(html)) !== null) {
    // 添加 blockquote 之前的 HTML
    if (match.index > lastIndex) {
      segments.push({
        type: "html",
        content: html.substring(lastIndex, match.index),
      });
    }

    const attrs = match[1];
    const blockquoteContent = match[2];

    // 从属性中提取元数据
    const topicIdMatch = attrs.match(/data-topic-id="([^"]+)"/);
    const postIdMatch = attrs.match(/data-post-id="([^"]+)"/);
    const usernameAttrMatch = attrs.match(/data-username="([^"]+)"/);

    let username = usernameAttrMatch ? usernameAttrMatch[1] : "";
    let content = blockquoteContent;

    // 如果没有属性元数据（旧格式），尝试从内容解析
    if (!username) {
      let usernameMatch = blockquoteContent.match(
        /<p>\s*<strong>@?([^<]+)<\/strong>:?\s*([\s\S]*)/i,
      );
      if (!usernameMatch) {
        usernameMatch = blockquoteContent.match(/<p>\s*@?([^:<]+):\s*<\/p>([\s\S]*)/i);
      }
      if (usernameMatch) {
        username = usernameMatch[1].trim();
        content = usernameMatch[2];
      }
    } else {
      // 如果是从 BBCode 转换来的，内容可能包含 <p><strong>username:</strong></p>，需要移除
      content = content.replace(/<p>\s*<strong>[^<]+<\/strong>:?\s*<\/p>/i, "");
    }

    if (username) {
      // 清理 content 中的 HTML 标签，保留换行结构
      content = content
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<p[^>]*>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .trim();

      // 尝试解析楼层号 (格式: username #floor)
      // 只有在没有 postId 时才依赖这个作为 fallback
      const floorMatch = username.match(/(.+)\s*#(\d+)/);

      segments.push({
        type: "quote",
        content: match[0], // 原始 HTML 作为 fallback
        quoteData: {
          username: floorMatch ? floorMatch[1].trim() : username,
          floor: floorMatch ? parseInt(floorMatch[2], 10) : undefined,
          postId: postIdMatch ? postIdMatch[1] : undefined,
          topicId: topicIdMatch ? topicIdMatch[1] : undefined,
          content: content,
          isCrossTopic: !!((topicIdMatch && topicIdMatch[1]) || (postIdMatch && postIdMatch[1])),
        },
      });
    } else {
      // 无法解析，作为普通 blockquote 渲染
      segments.push({
        type: "html",
        content: match[0],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // 添加剩余内容
  if (lastIndex < html.length) {
    segments.push({
      type: "html",
      content: html.substring(lastIndex),
    });
  }

  return segments;
}
