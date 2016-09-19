import Ember from 'ember';

export default Ember.Service.extend({
  viewport: null,
  init: function() {
    this._scrollViews = [];
    this.isScrolling = false;
    let viewport = this.get('viewport');
    if (viewport) {
      viewport.on('heightDidChange', this, this.refreshAll);
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
  startScrolling: function(scrollView) {
    this.set('isScrolling', true);
    this._currentlyScrollingView = scrollView;
  },
  endScrolling: function() {
    this.set('isScrolling', false);
    this._currentlyScrollingView = null;
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
