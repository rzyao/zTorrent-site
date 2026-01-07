// 工具：浏览器标签页图标与标题的统一管理
// 设计目标：集中处理 favicon 与 document.title，避免分散在各页面，提升可维护性

/**
 * 替换或创建 `<link rel="icon">` 标签以设置浏览器标签页图标
 * 说明：
 * - 优先复用现有标签，避免重复创建；若不存在则创建一个
 * - 根据文件扩展名设置 `type`，提升部分浏览器的渲染兼容性
 */
export function setFavicon(href: string) {
  const head = document.head
  let link = head.querySelector<HTMLLinkElement>("link[rel='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    head.appendChild(link)
  }
  link.href = href
  if (href.endsWith('.svg')) link.type = 'image/svg+xml'
  else if (href.endsWith('.ico')) link.type = 'image/x-icon'
  else if (href.endsWith('.png')) link.type = 'image/png'
  else link.removeAttribute('type')
  // 对于 SVG favicon，声明 sizes=any，提示浏览器可自由缩放，尽可能让图形占满显示区域
  if (link.type === 'image/svg+xml') {
    try { link.sizes = 'any' } catch { }
  } else {
    try { link.removeAttribute('sizes') } catch { }
  }
}

/**
 * 以内联 SVG 文本设置 favicon
 * 说明：
 * - 输入需为完整的 `<svg ...>...</svg>` 字符串
 * - 使用 data URL 承载，避免额外网络请求；并设置 `type=image/svg+xml`
 */
let _lastFaviconObjectUrl: string | null = null

export function setFaviconFromSvg(svgMarkup: string) {
  const head = document.head
  let link = head.querySelector<HTMLLinkElement>("link[rel='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    head.appendChild(link)
  }
  const raw = typeof svgMarkup === 'string' ? svgMarkup.trim() : ''
  if (!raw) return
  const hasNs = /<svg[^>]*\sxmlns=/.test(raw)
  let safeWithNs = hasNs ? raw : raw.replace(/<svg(\s|>)/, '<svg xmlns="http://www.w3.org/2000/svg" $1')
  // 若缺少 preserveAspectRatio，则添加为 xMidYMid slice，让图形填满可视区（更“显大”）
  if (!/preserveAspectRatio=/.test(safeWithNs)) {
    safeWithNs = safeWithNs.replace(/<svg([^>]*)>/, '<svg$1 preserveAspectRatio="xMidYMid slice">')
  }

  // 先尝试使用 Blob URL，避免对内容进行过度编码导致引用失败
  try {
    if (_lastFaviconObjectUrl) {
      URL.revokeObjectURL(_lastFaviconObjectUrl)
      _lastFaviconObjectUrl = null
    }
    const blob = new Blob([safeWithNs], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    _lastFaviconObjectUrl = url
    link.type = 'image/svg+xml'
    link.href = url
    try { link.sizes = 'any' } catch { }
    return
  } catch {
    // 忽略错误，走 data URL 兜底
  }

  // 兜底方案：data URL（使用 utf8 标记提高兼容性）
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(safeWithNs)}`
  link.type = 'image/svg+xml'
  link.href = dataUrl
  try { link.sizes = 'any' } catch { }
}

/**
 * 构建标签页标题文案：站点标题 + 页面名 + 固定品牌说明
 * 示例：`GuoYuan · 用户管理 · Powered by zTorrent`
 */
export function buildTitle(siteTitle: string, pageName: string) {
  return `${siteTitle} :: ${pageName} - Powered by zTorrent`
}

/**
 * 根据当前路径与前缀映射表计算页面名
 * 说明：
 * - 通过 `startsWith` 匹配最长前缀；若无匹配则回退到根路径 `/`
 */
export function getPageNameByPath(pathname: string, map: Record<string, string>) {
  const matchedKey = Object.keys(map).find((k) => pathname.startsWith(k)) || '/'
  return map[matchedKey]
}

export function svgToDataUrl(svgMarkup: string) {
  const raw = typeof svgMarkup === 'string' ? svgMarkup.trim() : ''
  if (!raw) return ''
  const hasNs = /<svg[^>]*\sxmlns=/.test(raw)
  let safe = hasNs ? raw : raw.replace(/<svg(\s|>)/, '<svg xmlns="http://www.w3.org/2000/svg" $1')
  if (!/preserveAspectRatio=/.test(safe)) {
    safe = safe.replace(/<svg([^>]*)>/, '<svg$1 preserveAspectRatio="xMidYMid slice">')
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(safe)}`
}
