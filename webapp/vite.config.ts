import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// host: true — чтобы туннель (cloudflared/ngrok) достучался до dev-сервера
// с телефона. /api проксируется на локальный бэкенд (bot), чтобы в режиме
// разработки Mini App и бот работали на одном origin.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
