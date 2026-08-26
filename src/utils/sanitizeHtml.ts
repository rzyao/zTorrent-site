import DOMPurify from "dompurify";

/**
 * 集中净化用户生成 / 外部来源的 HTML，防止存储型 XSS。
 *
 * 使用场景：
 *  - BBCode 渲染（processDescription）的 dangerouslySetInnerHTML
 *  - Markdown（marked）输出（论坛帖子、引用块）的 dangerouslySetInnerHTML
 *
 * 配置要点：
 *  - 禁止 script / iframe / object / embed / form 等危险标签
 *  - 禁止所有 on* 事件处理器属性（onerror / onload / onmouseover ...）
 *  - DOMPurify 默认会剥离 javascript: / vbscript: 等危险协议（<a href>、<img src>）
 *  - 保留安全的排版标签与 style 属性（DOMPurify 会进一步净化 style 内容）
 */
const FORBID_TAGS = [
  "script",
  "iframe",
  "object",
  "embed",
  "link",
  "meta",
  "form",
  "input",
  "button",
  "textarea",
  "style",
  "base",
  "frame",
  "frameset",
];

const FORBID_ATTR = [
  "onerror",
  "onload",
  "onmouseover",
  "onmouseout",
  "onclick",
  "onmouseenter",
  "onmouseleave",
  "onfocus",
  "onblur",
  "onchange",
  "oninput",
  "onkeydown",
  "onkeypress",
  "onkeyup",
  "onsubmit",
  "onreset",
];

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    FORBID_TAGS,
    FORBID_ATTR,
    ADD_ATTR: ["target", "rel"],
  });
}
