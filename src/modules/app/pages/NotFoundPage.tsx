import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。"
        extra={
          <Button type="primary" onClick={handleBackHome}>
            返回首页
          </Button>
        }
      />
    </div>
  );
}
