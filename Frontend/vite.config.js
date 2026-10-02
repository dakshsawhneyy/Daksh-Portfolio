import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  server: {
    // same-origin /api in dev too, mirroring the production ingress
    proxy: { '/api': { target: process.env.VITE_DEV_API || 'http://localhost:4000', changeOrigin: true } },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
  },
})