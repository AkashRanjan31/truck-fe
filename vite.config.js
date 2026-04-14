import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      '/api':     { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:5000', changeOrigin: true },
      '/socket.io': { target: 'http://localhost:5000', changeOrigin: true, ws: true },
    },
  },

  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks — split large deps for better caching
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          'map-vendor':    ['leaflet', 'react-leaflet'],
          'motion-vendor': ['framer-motion'],
          'chart-vendor':  ['recharts'],
          'socket-vendor': ['socket.io-client'],
        },
      },
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'leaflet', 'react-leaflet'],
  },
});
