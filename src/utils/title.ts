export type TitleParts = {
  title?: string;
};

export function composeTitle(parts: TitleParts, pageName?: string) {
  const siteTitle = String(parts.title ?? '').trim();
  const page = String(pageName ?? '').trim();
  if (siteTitle && page) return `${siteTitle} :: ${page} - Powered by zTorrent`;
  if (siteTitle) return `${siteTitle} - Powered by zTorrent`;
  if (page) return `${page} - Powered by zTorrent`;
  return 'Powered by zTorrent';
}
