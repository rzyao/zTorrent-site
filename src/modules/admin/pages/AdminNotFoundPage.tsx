import { Button } from "@/modules/admin/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminNotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">页面未找到</h2>
      <p className="mt-2 max-w-md text-gray-500">抱歉，您访问的后台管理页面不存在或已被移除。</p>
      <div className="mt-8 flex gap-4">
        <Button variant="dashed" onClick={() => navigate(-1)}>
          返回上一页
        </Button>
        <Button onClick={() => navigate("/admin/dashboard")}>返回控制台</Button>
      </div>
    </div>
  );
}
