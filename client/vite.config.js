import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const env = loadEnv("all", process.cwd())
const PORT = env.VITE_PORT

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: PORT,
    proxy: {
      '/api': {
        target: 'https://realtime-messaging-app-9hpl.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, ''),
      },
    },
  },
})
