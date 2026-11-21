import path from 'node:path';
import { defineConfig } from 'vitest/config';

const root = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@/convex',
        replacement: path.join(root, 'convex'),
      },
      {
        find: '@',
        replacement: path.join(root, 'src'),
      },
      {
        find: 'server-only',
        replacement: 'data:text/javascript,export default undefined',
      },
    ],
  },
  test: {
    globals: true,
    projects: [
      {
        test: {
          environment: 'edge-runtime',
          include: ['convex/**/*.test.ts'],
          name: 'convex',
        },
      },
      {
        test: {
          environment: 'node',
          include: ['src/**/*.test.ts'],
          name: 'node',
        },
      },
      {
        test: {
          environment: 'happy-dom',
          include: ['src/**/*.test.tsx'],
          name: 'components',
          setupFiles: ['src/test/setup.ts'],
        },
      },
    ],
  },
});
