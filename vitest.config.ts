// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';

export default defineConfig({
  test: {
    environment:'jsdom',
    globals: true,
    setupFiles: './entrypoints/popup/setupTests.ts',
    
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'lcov', 'json'],
      exclude: ['node_modules', 'test', 'dist'], // Exclude unnecessary files
    },
  },
  plugins: [WxtVitest()],
});