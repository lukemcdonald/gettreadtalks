import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import perfectionistPlugin from "eslint-plugin-perfectionist";

const __dirname = dirname(__filename);
const __filename = fileURLToPath(import.meta.url);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "**/*.d.ts",
      "*.config.",
      "*.log",
      "*.tsbuildinfo",
      ".DS_Store",
      ".env*",
      ".next/**",
      ".turbo/**",
      ".vercel/**",
      "build/**",
      "convex/**",
      "coverage/**",
      "dist/**",
      "next-env.d.ts",
      "node_modules/**",
      "out/**",
    ],
  },
  {
    plugins: {
      perfectionist: perfectionistPlugin,
    },
    rules: {
      // Turn off rules that conflict with Perfectionist
      "import/order": 'off',
      "react/jsx-sort-props": 'off',
      "sort-imports": 'off',
      "sort-keys": 'off',

      // Perfectionist rules
      "perfectionist/sort-objects": [
        "error",
        {
          order: "asc",
          type: "alphabetical",
          partitionByComment: true,
          partitionByNewLine: true,
        },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        {
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-object-types": [
        "error",
        {
          order: "asc",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          customGroups: {
            value: {
              internal: ['^@/.*'],
              react: ['^react$', '^react-.+'],
            },
          },
          groups: [
            "type",
            "react",
            ["builtin", "external"],
            "internal-type",
            "internal",
            ["parent-type", "sibling-type", "index-type"],
            ["parent", "sibling", "index"],
            "object",
            "unknown",
          ],
          newlinesBetween: 'always',
          order: "asc",
          type: "alphabetical",
        },
      ],
      // Sort named imports alphabetically
      "perfectionist/sort-named-imports": [
        "error",
        {
          order: "asc",
          type: "alphabetical",
        },
      ],
    },
    settings: {
      perfectionist: {
        order: 'asc',
        partitionByComment: true,
        type: "natural",
      },
    },
  },
];

export default eslintConfig;
