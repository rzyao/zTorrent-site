import { useEffect, useRef } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { setFaviconFromSvg, setFaviconFromUrl, ensureNamespace } from '@/utils/tabTitle';

export function useDynamicFavicon() {
  const { logoSvg, logoUrl } = useSiteConfig();
  const prevBlobUrl = useRef<string | null>(null);

  useEffect(() => {
    const head = document.head;
    const svg = ensureNamespace(logoSvg);
    if (svg) {
      const ok = setFaviconFromSvg(svg);
      if (ok) return;
    }
    if (logoUrl && logoUrl.trim().length > 0) {
      setFaviconFromUrl(logoUrl);
    }
  }, [logoSvg, logoUrl]);
}
