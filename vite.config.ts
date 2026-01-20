import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // React Compiler 选项
  const ReactCompilerConfig = {
    target: "19", // 根据 React 19 进行优化
  };

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
        },
      }),
      // visualizer({
      //   open: true, // 打包后自动在浏览器打开分析图
      //   filename: 'stats.html', // 生成的分析文件名称
      //   gzipSize: true, // 显示 gzip 后的体积
      //   brotliSize: true,
      // }),
    ],
    resolve: {
      dedupe: ["react", "react-dom"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "sonner"],
      dedupe: ["react", "react-dom"],
    },
    server: {
      port: 3000,
      watch: {
        usePolling: true,
        interval: 300,
        ignored: ["**/node_modules/**"],
      },
      proxy: {
        "/api": {
          target: "http://localhost:8890",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/uploads": {
          target: "http://localhost:8890",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      sourcemap: true,
      minify: "esbuild",
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "ui-vendor": [
              "framer-motion",
              "@radix-ui/react-dialog",
              "@radix-ui/react-popover",
              "@radix-ui/react-dropdown-menu",
            ],
            "data-vendor": ["@tanstack/react-query", "axios", "zustand"],
            "chart-vendor": ["recharts"],
            "utils-vendor": ["crypto-js", "es-toolkit"],
          },
        },
      },
    },
    define: {
      "import.meta.env.VITE_BASE_URL": JSON.stringify(env.VITE_BASE_URL),
    },
  };
});
