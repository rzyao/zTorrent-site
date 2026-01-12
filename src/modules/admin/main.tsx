import { createRoot } from "react-dom/client";
import { AdminDevApp } from "./AdminDevApp.tsx";
import "@/index.css";
// Admin 专用样式已在 index.css 中通过 @import 引入
import { setupAxiosInterceptors } from "@/api/axiosInterceptors";
import { initOpenAPI } from "@/api/setup";
import { QueryProvider } from "@/providers/QueryProvider";

// 初始化 API 配置
setupAxiosInterceptors();

initOpenAPI().then(() => {
  createRoot(document.getElementById("root-admin")!).render(
    <QueryProvider>
      <AdminDevApp />
    </QueryProvider>,
  );
});
