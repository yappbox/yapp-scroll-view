/* jshint node: true */
'use strict';

module.exports = {
  name: 'yapp-scroll-view',

  isDevelopingAddon: function() {
    return true;
  },

  included: function (app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/fastclick/fastclick.js');
    app.import('vendor/yapp-scroll-view-shims/shims.js');
  }
};
