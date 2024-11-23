import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : '/convertopia-manager/',
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Isolation': 'enable'
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [
      '@ffmpeg/ffmpeg',
      '@ffmpeg/util',
      '@ffmpeg/core-mt'
    ],
  },
  build: {
    commonjsOptions: {
      include: [/@ffmpeg\/.*/, /node_modules/],
    },
    rollupOptions: {
      external: [
        'https://unpkg.com/@ffmpeg/ffmpeg@0.12.7/dist/esm/index.js',
        'https://unpkg.com/@ffmpeg/util@0.12.1/dist/esm/index.js'
      ],
    },
  },
}));
