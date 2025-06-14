import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'primevue': path.resolve(__dirname, 'node_modules/primevue'), // Handle primevue imports
        'primeicons': path.resolve(__dirname, 'node_modules/primeicons'), // Handle primeicons imports
      },
    },
    define: {
      'process.env': env,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/variables.scss";`, // Example for global variables
        },
      },
    },
  };
});
