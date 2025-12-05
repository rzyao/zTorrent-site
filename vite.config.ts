import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
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
      minify: false,
      chunkSizeWarningLimit: 1024,
      rollupOptions: {}
    },
    define: {
      'import.meta.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL)
    }
  }
})
