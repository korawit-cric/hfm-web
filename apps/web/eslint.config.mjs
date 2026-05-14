import { nextJsConfig } from '@repo/eslint-config/next-js';
import globals from 'globals';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ['*.config.mjs', 'eslint.config.mjs', 'postcss.config.mjs'],
  },
  ...nextJsConfig,
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
