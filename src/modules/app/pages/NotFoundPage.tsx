import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/modules/app/components/ui/button";

/**
 * 404 页面
 * 当访问的路由不存在时显示
 */
export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBackHome = () => {
    const isLoggedIn = !!localStorage.getItem("accessToken");
    navigate(isLoggedIn ? "/app/home" : "/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F171E] px-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-9xl font-bold text-neutral-700">404</h1>
        <h2 className="text-2xl font-bold text-neutral-200 md:text-3xl">{t('notFound.title')}</h2>
        <p className="mt-4 text-neutral-400">{t('notFound.description')}</p>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          className="min-w-[120px] rounded-lg border-[#92702a] bg-transparent text-[#d4a733] hover:border-[#d4a733] hover:bg-[#d4a733]/10 hover:text-[#e8bc4a]"
          onClick={handleBackHome}
        >
          {t('notFound.backHome')}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="min-w-[120px] rounded-lg border-neutral-600 bg-transparent text-neutral-300 hover:border-neutral-500 hover:bg-neutral-700/50 hover:text-neutral-200"
          onClick={() => navigate(-1)}
        >
          {t('notFound.backPrev')}
        </Button>
      </div>
    </div>
  );
}
