'use strict';

module.exports = {
  singleQuote: true,
  overrides: [
    {
      files: '*.{gjs,gts}',
      options: {
        parser: 'ember-template-tag',
      },
    },
  ],
  plugins: ['prettier-plugin-ember-template-tag'],
};
