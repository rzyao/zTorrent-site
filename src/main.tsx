import { createRoot } from "react-dom/client";
import App from "./App";
import "@/index.css"; // 引入全局基础样式 (包含所有模块样式)
import { setupAxiosInterceptors } from "./api/axiosInterceptors";
import { initOpenAPI } from "./api/setup";

setupAxiosInterceptors();

import { QueryProvider } from "./providers/QueryProvider";

initOpenAPI().then(() => {
  createRoot(document.getElementById("root-app")!).render(
    <QueryProvider>
      <App />
    </QueryProvider>,
  );
});
