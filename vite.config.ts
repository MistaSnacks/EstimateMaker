import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'pdf-vendor': ['jspdf', 'jspdf-autotable'],
          'openai-vendor': ['openai'],
        },
      },
    },
    // Increase chunk size warning limit to 1000KB (current largest is ~770KB)
    chunkSizeWarningLimit: 1000,
  },
})
