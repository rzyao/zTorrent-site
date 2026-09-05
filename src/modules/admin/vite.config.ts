import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量，路径指向根目录
  const env = loadEnv(mode, path.resolve(__dirname, "../../../"), "");

  return {
    // 设置项目根目录为当前目录
    root: ".",
    // 环境变量目录指向根目录
    envDir: "../../..",
    base: "/",
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler", { target: "19" }]],
        },
      }),
    ],
    resolve: {
      alias: {
        // @ 映射到 src 目录 (位于当前目录的上两级)
        "@": path.resolve(__dirname, "../../"),
      },
    },
    server: {
      port: 48518, // 使用不同于主项目的端口，避免冲突
      strictPort: false,
      proxy: {
        "/api": {
          target: "http://localhost:48230",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    define: {
      // 注入环境变量
      "import.meta.env.VITE_BASE_URL": JSON.stringify(env.VITE_BASE_URL),
    },
  };
});
