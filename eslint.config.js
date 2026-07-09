// @ts-check
// ESLint v9 flat config
// Uses typescript-eslint@8 (unified package — replaces @typescript-eslint/parser + plugin)
// Prettier handles formatting; ESLint handles correctness and type safety.

const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  // ── Global ignores ──────────────────────────────────────────────────────────
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '*.config.js',  // Exclude config files (non-TS, no tsconfig reference)
    ],
  },

  // ── Type-aware TypeScript rules ──────────────────────────────────────────────
  // recommendedTypeChecked requires parserOptions.project to be set.
  // It includes rules like no-floating-promises, await-thenable that catch real bugs.
  ...tseslint.configs.recommendedTypeChecked,

  // ── Project-level parserOptions ─────────────────────────────────────────────
  // project: true → finds the nearest tsconfig.json for each linted file.
  // This enables type-aware linting in a monorepo without manual path specification.
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Unused vars are errors; leading _ marks intentionally unused params
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Explicit return types prevent accidental `any` from inference drift
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,           // Allow inline arrow functions
          allowHigherOrderFunctions: true,  // Allow HOF wrappers
        },
      ],

      // `any` is banned — use `unknown` and narrow explicitly
      '@typescript-eslint/no-explicit-any': 'error',

      // Enforce `import type` for type-only imports (no runtime overhead)
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Unhandled promises are silent production failures — make them errors
      '@typescript-eslint/no-floating-promises': 'error',

      // Awaiting a non-Promise is almost always a bug
      '@typescript-eslint/await-thenable': 'error',

      // Prevent passing async callbacks to non-async callers (e.g., Express handlers)
      // attributes: false allows async JSX event handlers
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],

      // console.log in production is a data-leak risk; allow warn/error for bootstrap code
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // ── Prettier (MUST be last) ──────────────────────────────────────────────────
  // Disables all ESLint rules that would conflict with Prettier formatting.
  // Prettier always wins on formatting decisions.
  eslintConfigPrettier,
);
