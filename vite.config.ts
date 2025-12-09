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
      // 开启 source map 便于线上问题快速定位
      sourcemap: true,
      // 将压缩器切换回 Vite 默认的 esbuild，规避部分库与 terser 的已知兼容问题
      // 尤其是在 React 19 与某些三方依赖的组合下，terser 可能产生
      // “Cannot access 'X' before initialization” 的 TDZ 错误
      minify: 'esbuild',
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('react-router-dom')) return 'react-vendor'
            if (id.includes('recharts')) return 'charts'
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('@tanstack/react-query')) return 'react-query'
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('@radix-ui')) return 'radix'
            return 'vendor'
          }
        }
      }
    },
    define: {
      'import.meta.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL)
    }
  }
})
