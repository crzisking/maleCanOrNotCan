import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 关键配置：确保 Electron 加载本地资源时路径正确
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
