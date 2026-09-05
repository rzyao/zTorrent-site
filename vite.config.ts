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
        babel:
          mode === "production"
            ? {
                plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
              }
            : undefined,
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
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "zustand",
        "axios",
        "lucide-react",
        "sonner",
        "framer-motion",
        "clsx",
        "tailwind-merge",
        "dayjs",
        "es-toolkit",
        "crypto-js",
      ],
      dedupe: ["react", "react-dom"],
    },
    server: {
      port: 48300,
      watch: {
        usePolling: false,
        ignored: ["**/node_modules/**"],
      },
      proxy: {
        "/api": {
          target: "http://localhost:48230",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/uploads": {
          target: "http://localhost:48230",
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
