import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { resolve } from 'path'

const isReportBuild = process.env.VITE_BUILD_MODE === 'report';

export default defineConfig({
  plugins: [
    react(),
    // 仅在报告构建模式下开启单文件打包，将所有资源注入 HTML
    isReportBuild && viteSingleFile(),
  ].filter(Boolean),
  build: {
    // 强制将所有资源（不论大小）转为 Base64 内联
    assetsInlineLimit: 10000000, 
    rollupOptions: {
      input: isReportBuild ? {
        report: resolve(__dirname, 'report.html'),
      } : {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  appType: 'spa'
})