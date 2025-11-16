import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
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
  }
})
