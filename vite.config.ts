import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(),
    splitVendorChunkPlugin(),
      // visualizer({
      //   open: true, // 打包后自动在浏览器打开分析图
      //   filename: 'stats.html', // 生成的分析文件名称
      //   gzipSize: true, // 显示 gzip 后的体积
      //   brotliSize: true,
      // }),
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'sonner'],
      dedupe: ['react', 'react-dom']
    },
    server: {
      watch: {
        usePolling: true,
        interval: 300,
        ignored: ['**/node_modules/**']
      }
    },
    build: {
      sourcemap: true,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        output: {
        }
      }
    },
    define: {
      'import.meta.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL)
    }
  }
})
