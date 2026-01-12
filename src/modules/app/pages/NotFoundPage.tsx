import { useNavigate } from "react-router-dom";
import { Button } from "@/modules/admin/components/ui/button";

/**
 * 404 页面
 * 当访问的路由不存在时显示
 */
export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    const isLoggedIn = !!localStorage.getItem("accessToken");
    navigate(isLoggedIn ? "/app/home" : "/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-9xl font-bold text-neutral-200">404</h1>
        <h2 className="text-2xl font-bold text-neutral-800 md:text-3xl">页面找不到啦</h2>
        <p className="mt-4 text-neutral-500">抱歉，您访问的页面不存在或已被移除。</p>
      </div>

      <div className="flex gap-4">
        <Button variant="primary" size="lg" className="min-w-[120px]" onClick={handleBackHome}>
          返回首页
        </Button>
        <Button variant="default" size="lg" className="min-w-[120px]" onClick={() => navigate(-1)}>
          返回上一页
        </Button>
      </div>
    </div>
  );
}
