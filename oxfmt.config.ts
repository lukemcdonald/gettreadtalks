import { defineConfig } from 'oxfmt';
import ultracite from 'ultracite/oxfmt';

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    '.claude/**',
    '.pnpm-store/**',
    'convex/**/_generated/**',
    'convex/betterAuth/schema.ts',
    'src/components/ui/primitives/**',
  ],
  singleQuote: true,
  sortImports: {
    groups: [
      'type-import',
      ['value-builtin', 'value-external'],
      'value-internal',
      ['value-parent', 'value-sibling', 'value-index'],
      'unknown',
    ],
    ignoreCase: true,
    newlinesBetween: true,
    order: 'asc',
  },
});
