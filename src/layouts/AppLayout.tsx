import { Header } from '@/layouts/Header';
import { OpenAPI } from '@/api';
import { SiteConfigProvider } from '@/context/SiteConfigContext';
import { useDynamicFavicon } from '@/hooks/useDynamicFavicon';

const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || '';
OpenAPI.BASE = apiBase;
OpenAPI.TOKEN = async () => localStorage.getItem('accessToken') || '';

function FaviconInjector() {
  useDynamicFavicon();
  return null;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteConfigProvider>
      <FaviconInjector />
      <div className="min-h-screen bg-[#0F171E]">
        <Header />
        <div>{children}</div>
      </div>
    </SiteConfigProvider>
  );
}
