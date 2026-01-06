/**
 * 统一响应解包辅助函数
 * 目的：与 OpenAPI 生成的服务返回保持兼容，抽取业务数据
 * 行为：
 * - 后端统一封装 `{ code, message, data, ... }` 时，优先返回其中的 `data`
 * - 若直接返回对象（无外层封装），则原样返回该对象
 * - 对于底层 `__request` 返回体，同样适用上述规则
 */
export function unwrapResponse<T = any>(response: any): T {
  const body = response?.code !== undefined ? response : response?.data;
  return (body?.data ?? body) as T;
}

/**
 * 统一错误信息提取辅助函数
 * 目的：规范化展示后端错误信息，避免不同来源报错格式差异影响用户提示
 * 行为：
 * - 优先使用 `ApiError.body.message`（OpenAPI 生成的错误包装）
 * - 其次回退至 `err.message`
 * - 最后使用通用文案 `请求失败`
 */
export function extractErrorMessage(err: any): string {
  try {
    const body = err?.body;
    const wrapped = body?.code !== undefined ? body : body?.data;
    return wrapped?.message || err?.message || '请求失败';
  } catch (_) {
    return err?.message || '请求失败';
  }
}

/** 高亮样式解析：将后端的状态数组映射为布尔标志 */
export const parseHighlight = (statuses?: string[]) => {
  const set = new Set(statuses || []);
  return { bold: set.has('bold'), red: set.has('red'), hot: set.has('badge:hot') };
};

const sanitizeImageSrc = (src: string) => {
  try {
    const s = String(src).trim();
    return /^https?:\/\//i.test(s) ? s : '';
  } catch {
    return '';
  }
};

export const renderPreview = (text: string) => {
  let html = text || '';
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-white mt-4 mb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-semibold text-white mt-4 mb-2">$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del class="line-through text-neutral-400">$1</del>');
  html = html.replace(/<u>(.+?)<\/u>/g, '<u class="underline">$1</u>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-neutral-800 text-amber-400 px-1.5 py-0.5 rounded text-sm">$1</code>');
  html = html.replace(/```\n?([\s\S]*?)\n?```/g, '<pre class="bg-neutral-800 text-neutral-300 p-4 rounded-lg overflow-x-auto my-3"><code>$1</code></pre>');
  html = html.replace(/^> (.+$)/gim, '<blockquote class="border-l-4 border-amber-500 pl-4 py-2 my-3 text-neutral-300 bg-neutral-800/50 rounded">$1</blockquote>');
  html = html.replace(/^\- (.+$)/gim, '<li class="ml-4">• $1</li>');
  html = html.replace(/^\d+\. (.+$)/gim, '<li class="ml-4 list-decimal">$1</li>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-3" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amber-400 hover:text-amber-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/\n/g, '<br />');
  return html;
};

/**
 * 引用内容渲染（带图片尺寸限制）
 * 目标：将 Markdown/HTML 图片在“引用块”中以受限尺寸展示，避免撑破布局
 * 限制：max-height 160px、max-width 100%、object-fit contain
 */
export const renderPreviewQuote = (text: string) => {
  let html = text || '';
  // 标题/行内样式与普通文本处理，复用主体规则
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm font-semibold text-white mt-2 mb-1">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-sm font-semibold text-white mt-2 mb-1">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-sm font-semibold text-white mt-2 mb-1">$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del class="line-through text-neutral-400">$1</del>');
  html = html.replace(/<u>(.+?)<\/u>/g, '<u class="underline">$1</u>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-neutral-800 text-amber-400 px-1 py-0.5 rounded text-xs">$1</code>');
  html = html.replace(/```\n?([\s\S]*?)\n?```/g, '<pre class="bg-neutral-800 text-neutral-300 p-3 rounded-lg overflow-x-auto my-2"><code>$1</code></pre>');
  html = html.replace(/^> (.+$)/gim, '<blockquote class="border-l-4 border-amber-500 pl-3 py-2 my-2 text-neutral-300 bg-neutral-800/50 rounded">$1</blockquote>');
  html = html.replace(/^\- (.+$)/gim, '<li class="ml-4">• $1</li>');
  html = html.replace(/^\d+\. (.+$)/gim, '<li class="ml-4 list-decimal">$1</li>');
  // Markdown 图片：受限尺寸
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) => {
    const src = sanitizeImageSrc(url);
    return src
      ? `<img src="${src}" alt="${alt}" class="rounded-lg my-2" style="max-width:100%;max-height:160px;object-fit:contain" />`
      : `<span class="text-neutral-500">[图片链接不安全或无效]</span>`;
  });
  // 原生 <img>：注入尺寸限制与 src 过滤
  html = html.replace(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi, (_m, url) => {
    const src = sanitizeImageSrc(url);
    return src
      ? `<img src="${src}" class="rounded-lg my-2" style="max-width:100%;max-height:160px;object-fit:contain" />`
      : `<span class="text-neutral-500">[图片链接不安全或无效]</span>`;
  });
  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text2, href) => {
    const safe = /^https?:\/\//i.test(href) ? href : '#';
    return `<a href="${safe}" class="text-amber-400 hover:text-amber-300 underline" target="_blank" rel="noopener noreferrer">${text2}</a>`;
  });
  html = html.replace(/\n/g, '<br />');
  return html;
};
