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
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('/react')) return 'react'
              if (id.includes('@radix-ui')) return 'radix'
              if (id.includes('framer-motion')) return 'motion'
              if (id.includes('@tanstack')) return 'query'
              return 'vendor'
            }
            if (id.includes('/src/api/')) return 'sdk'
            if (id.includes('/src/pages/')) return 'pages'
            return undefined
          }
        }
      }
    },
    define: {
      'import.meta.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL)
    }
  }
})
