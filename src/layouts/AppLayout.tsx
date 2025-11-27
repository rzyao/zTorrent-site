import { Header } from '@/layouts/Header';
import { OpenAPI } from '@/api';

const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || '';
OpenAPI.BASE = apiBase;
OpenAPI.TOKEN = async () => localStorage.getItem('accessToken') || '';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F171E]">
      <Header />
      <div>{children}</div>
    </div>
  );
}
