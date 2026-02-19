'use strict';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['ember'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    'ember/no-runloop': 'off',
  },
  overrides: [
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.template-lintrc.cjs',
        './ember-cli-build.js',
        './index.js',
        './testem.js',
        './rollup.config.mjs',
        './config/**/*.js',
        './tests/dummy/config/**/*.js',
      ],
      parser: 'espree',
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 'latest',
      },
      env: {
        browser: false,
        node: true,
      },
      extends: ['plugin:n/recommended'],
    },
    {
      // Test files:
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
      rules: {
        'qunit/no-assert-equal': 'off',
        'qunit/require-expect': 'off',
      },
    },
  ],
};
