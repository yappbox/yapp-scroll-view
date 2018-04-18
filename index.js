'use strict';

module.exports = {
  name: 'yapp-scroll-view',

  isDevelopingAddon: function() {
    return true;
  },

  included: function (app) {
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;

    this._super.included.apply(this, arguments);

    app.import('vendor/fastclick/fastclick.js');
    app.import('vendor/yapp-scroll-view-shims/shims.js');
  }
};
