export function ensureNamespace(svg: string) {
  const s = (svg || '').trim();
  if (!s) return '';
  const hasXmlns = /xmlns\s*=\s*["']http:\/\/www\.w3\.org\/2000\/svg["']/i.test(s);
  if (hasXmlns) return s;
  return s.replace(/<svg(\s*)/i, '<svg$1xmlns="http://www.w3.org/2000/svg" ');
}

export function resetFavicons() {
  const links = Array.from(document.head.querySelectorAll('link[rel*="icon"]')) as HTMLLinkElement[];
  for (const l of links) {
    if (l.id !== 'dynamic-favicon') document.head.removeChild(l);
  }
}

export function setFaviconFromSvg(svgMarkup: string) {
  const head = document.head;
  let link = head.querySelector('link#dynamic-favicon') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = 'dynamic-favicon';
    link.rel = 'icon';
    head.appendChild(link);
  }
  resetFavicons();
  const svg = ensureNamespace(svgMarkup);
  if (!svg) return false;
  try {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    link.type = 'image/svg+xml';
    link.setAttribute('sizes', 'any');
    link.href = url;
    return true;
  } catch {
    try {
      const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      link.type = 'image/svg+xml';
      link.setAttribute('sizes', 'any');
      link.href = url;
      return true;
    } catch {
      return false;
    }
  }
}

export function setFaviconFromUrl(url: string) {
  const head = document.head;
  let link = head.querySelector('link#dynamic-favicon') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = 'dynamic-favicon';
    link.rel = 'icon';
    head.appendChild(link);
  }
  resetFavicons();
  const u = (url || '').trim();
  if (!u) return false;
  link.removeAttribute('sizes');
  link.type = '';
  link.href = u;
  return true;
}

