'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const path = require('path');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    babel: {
      plugins: [
        require.resolve('ember-concurrency/async-arrow-task-transform'),
      ],
    },
    autoImport: {
      webpack: {
        resolve: {
          alias: {
            'yapp-scroll-view': path.resolve(__dirname, 'dist'),
          },
        },
      },
    },
    outputPaths: {
      app: {
        html: 'index.html',
      },
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
