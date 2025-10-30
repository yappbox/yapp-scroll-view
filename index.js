'use strict';
const stew = require('broccoli-stew');

module.exports = {
  name: require('./package').name,
  isDevelopingAddon() {
    return true;
  },

  options: {
    babel: {
      plugins: [
        require.resolve('ember-concurrency/async-arrow-task-transform'),
      ],
    },
  },

  treeForApp() {
    let tree = this._super.treeForApp.apply(this, arguments);
    if (this.doNotExportComponents) {
      tree = stew.rm(tree, 'components/*');
    }
    return tree;
  },

  included(app) {
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;

    this._super.included.apply(this, arguments);

    if (
      app.options.yappScrollView &&
      app.options.yappScrollView.doNotExportComponents
    ) {
      this.doNotExportComponents = true;
    }

    this.import('vendor/zynga-scroller/Animate.js');
    this.import('vendor/zynga-scroller/Scroller.js');
  },
};
