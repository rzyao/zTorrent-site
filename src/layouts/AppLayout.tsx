import { Header } from '@/layouts/Header';
import { SiteConfigProvider } from '@/context/SiteConfigContext';
import { useDynamicFavicon } from '@/hooks/useDynamicFavicon';


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
