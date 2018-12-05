'use strict';

module.exports = {
  name: require('./package').name,
  isDevelopingAddon() {
    return true;
  },

  included(app) {
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;

    this._super.included.apply(this, arguments);

    app.import('vendor/zynga-scroller/Animate.js');
    app.import('vendor/zynga-scroller/Scroller.js');
  }
};
