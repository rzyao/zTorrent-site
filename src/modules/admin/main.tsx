import { createRoot } from "react-dom/client";
import { AdminDevApp } from "./AdminDevApp";
import "@/index.css"; // 引入全局样式
import { setupAxiosInterceptors } from "@/api/axiosInterceptors";
import { initOpenAPI } from "@/api/setup";
import { QueryProvider } from "@/providers/QueryProvider";

// 初始化 API 配置
setupAxiosInterceptors();

initOpenAPI().then(() => {
  createRoot(document.getElementById("root")!).render(
    <QueryProvider>
      <AdminDevApp />
    </QueryProvider>,
  );
});
