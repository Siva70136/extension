import { defineProject } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';

export default defineProject({
  test: {
    globals:true,
    mockReset: true,
    restoreMocks: true,
    environment:"jsdom",
    setupFiles: ['./setupTests.ts'],
  },
  plugins: [WxtVitest()],
});