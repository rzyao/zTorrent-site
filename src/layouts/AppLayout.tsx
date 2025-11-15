import { Header } from '@/components/Header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F171E]">
      <Header />
      <div>{children}</div>
    </div>
  );
}
