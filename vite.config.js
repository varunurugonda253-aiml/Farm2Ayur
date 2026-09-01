import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        about: resolve(__dirname, 'about.html'),
        scan: resolve(__dirname, 'scan.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
