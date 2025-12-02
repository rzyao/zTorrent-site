import { useEffect } from 'react';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { composeTitle } from '@/utils/title';

export function useDynamicTitle(pageName: string) {
  const cfg = useSiteConfig();
  useEffect(() => {
    const next = composeTitle(
      { title: cfg.title },
      pageName
    );
    if (next && next.length > 0) {
      document.title = next;
    }
  }, [cfg.title, pageName]);
}
