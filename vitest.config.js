import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.js'],
    coverage: {
      reporter: ['text', 'text-summary'],
      include: ['script.js', 'server.js'],
    },
  },
});
