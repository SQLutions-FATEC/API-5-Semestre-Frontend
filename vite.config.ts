import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json', 'html'],
      exclude: ['node_modules/**', 'dist/**', '**/*.d.ts', '**/*.cjs'],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // Isso silencia avisos de bibliotecas externas
        silenceDeprecations: ['import'], // Silencia especificamente o erro do @import
      },
    },
  },
});
