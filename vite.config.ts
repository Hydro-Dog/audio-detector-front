import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
    port: 3000, // This is the port which we will use in docker
    // Thanks @sergiomoura for the window fix
    // add the next lines if you're using windows and hot reload doesn't work
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      '@pages/*': path.resolve(__dirname, './src/pages/*'),
      '@widgets/*': path.resolve(__dirname, 'src/widgets'),
      '@feature/*': path.resolve(__dirname, 'src/feature'),
      '@entities/*': path.resolve(__dirname, 'src/entities'),
      '@shared/*': path.resolve(__dirname, 'src/shared'),
      '@store/*': path.resolve(__dirname, 'src/store'),
    },
  },
});
