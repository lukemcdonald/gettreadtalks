import { defineConfig } from 'oxlint';
import core from 'ultracite/oxlint/core';
import next from 'ultracite/oxlint/next';
import react from 'ultracite/oxlint/react';

export default defineConfig({
  extends: [core, next, react],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    '.claude/**',
    '.pnpm-store/**',
    'convex/**/_generated/**',
    'convex/betterAuth/schema.ts',
    'src/components/ui/primitives/**',
  ],
  rules: {
    'func-style': 'off',
    'import/no-cycle': 'off',
    'import/no-duplicates': 'off',
    'no-empty-function': 'off',
    'no-use-before-define': 'off',
    'node/global-require': 'off',
    'oxc/no-barrel-file': 'off',
    'promise/prefer-await-to-then': 'off',
    'react-perf/jsx-no-new-function-as-prop': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-no-constructed-context-values': 'off',
    'react/style-prop-object': 'off',
    'sort-keys': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/prefer-module': 'off',
  },
});
