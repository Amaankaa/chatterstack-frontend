import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/v1': { target: 'http://chatterstack-alb-730649082.us-east-1.elb.amazonaws.com', changeOrigin: true },
      '/ws': { 
        target: 'ws://chatterstack-alb-730649082.us-east-1.elb.amazonaws.com', 
        ws: true,
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReqWs', (proxyReq, req, _socket, _options, _head) => {
            // Extract token from query string and inject as Header
            if (req.url && req.url.includes('token=')) {
               const match = req.url.match(/token=([^&]*)/);
               if (match && match[1]) {
                 proxyReq.setHeader('Authorization', `Bearer ${match[1]}`);
                 console.log('Vite Proxy: Injected Authorization header for WebSocket');
               }
            }
          });
        }
      },
    },
  },
})