import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // Isso silencia avisos de bibliotecas externas
        silenceDeprecations: ['import'], // Silencia especificamente o erro do @import
      },
    },
  },
});
