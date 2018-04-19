import { registerWaiter } from '@ember/test';
import Service from '@ember/service';
import Ember from 'ember';

export default Service.extend({
  viewport: null,
  init() {
    this._super(...arguments);

    this._scrollViews = [];
    this.isScrolling = false;
    let viewport = this.get('viewport');
    if (viewport) {
      viewport.on('heightDidChange', this, this.refreshAll);
    }
    if (Ember.testing) {
      registerWaiter(() => {
        return this.get('isScrolling') === false;
      });
    }
  },
  willDestroy: function() {
    let viewport = this.get('viewport');
    if (viewport) {
      viewport.off('heightDidChange', this, this.refreshAll);
    }
  },
  addScrollView: function(scrollView) {
    this._scrollViews.push(scrollView);
  },
  removeScrollView: function(scrollView) {
    this._scrollViews.removeObject(scrollView);
  },
  startScrolling: function() {
    this.set('isScrolling', true);
  },
  endScrolling: function() {
    this.set('isScrolling', false);
  },
  startRefreshing: function() {
    this.set('isRefreshing', true);
  },
  endRefreshing: function() {
    this.set('isRefreshing', false);
  },
  refreshAll: function() {
    this._scrollViews.forEach(function(scrollView) {
      scrollView.refresh();
    });
  }
});
