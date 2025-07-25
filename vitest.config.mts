import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: true,
    alias: {
      '@': '/src',
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    exclude: ['node_modules', 'dist', '.next', 'e2e'],
  },
  plugins: [
    // Use dynamic import for vite-tsconfig-paths to support ESM
    // @ts-ignore
    (await import('vite-tsconfig-paths')).default()
  ],
  
}); 