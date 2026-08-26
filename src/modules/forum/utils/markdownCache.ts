import { marked } from "marked";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

/**
 * Markdown 解析结果缓存（LRU 简易实现）
 * 目标：减少重复内容的解析开销，缓解长帖/多次渲染的 CPU 压力
 */
const MAX_ENTRIES = 200;
const htmlCache = new Map<string, string>();

/**
 * 解析 Markdown 为 HTML（带结果缓存）
 * - 当内容重复出现时直接命中缓存，避免再次调用 marked.parse
 * - 使用 Map 维持插入顺序，实现近似 LRU 的淘汰（删除最旧的 key）
 */
export function parseMarkdownCached(markdown: string): string {
  const key = markdown;
  const cached = htmlCache.get(key);
  if (cached) {
    return cached;
  }
  const html = sanitizeHtml(marked.parse(markdown, { async: false }) as string);
  htmlCache.set(key, html);
  if (htmlCache.size > MAX_ENTRIES) {
    const firstKey = htmlCache.keys().next().value;
    if (firstKey) {
      htmlCache.delete(firstKey);
    }
  }
  return html;
}

