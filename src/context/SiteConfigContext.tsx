import React, { createContext, useContext, useEffect, useState } from 'react';
import { SettingsService } from '@/api';

type SiteConfig = {
  title: string;
  logoUrl: string;
  logoSvg: string;
  archInfo: string;
};

const SiteConfigContext = createContext<SiteConfig>({ title: '', logoUrl: '', logoSvg: '', archInfo: '' });

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>({ title: '', logoUrl: '', logoSvg: '', archInfo: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await SettingsService.settingsControllerListSettingsByGroup({ group: 'site' });
        const body: any = (resp as any)?.code !== undefined ? resp : (resp as any)?.data;
        const items: Array<any> = body?.data ?? [];
        const map: Record<string, string> = Object.fromEntries(
          items
            .filter((it) => it?.key)
            .map((it) => [String(it.key), String(it.value ?? '')])
        );
        const title = map['site.title'] ?? '';
        const logoUrl = map['site.logo.url'] ?? '';
        const logoSvg = map['site.logo.svg'] ?? '';
        const archInfo = map['site.arch'] ?? map['site.architecture'] ?? '';
        if (mounted) setConfig({ title, logoUrl, logoSvg, archInfo });
      } catch {
        if (mounted) setConfig({ title: '', logoUrl: '', logoSvg: '', archInfo: '' });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SiteConfigContext.Provider value={config}>{children}</SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
