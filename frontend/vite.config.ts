import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true, // Ensures Vite uses exactly this port
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    },
    // Ensure Vite handles all requests properly
    origin: 'http://localhost:3000'
  },
  // Ensure source files are handled properly
  appType: 'spa' // Single Page Application
})