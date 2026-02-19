export default {
  plugins: [
    'ember-concurrency/async-arrow-task-transform',
    '@embroider/addon-dev/template-colocation-plugin',
    [
      'babel-plugin-ember-template-compilation',
      {
        targetFormat: 'hbs',
      },
    ],
    [
      'module:decorator-transforms',
      { runtime: { import: 'decorator-transforms/runtime' } },
    ],
  ],
};
