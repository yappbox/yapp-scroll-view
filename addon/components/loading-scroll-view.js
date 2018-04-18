import { run } from '@ember/runloop';
import { observer } from '@ember/object';
import ScrollView from './scroll-view';

const THRESHOLD_FROM_BOTTOM_TO_TRIGGER_LOAD_MORE = 350;
const MAX_LOAD_MORE_FREQUENCY_MS = 1000;

export default ScrollView.extend({
  hasMore: null, // passed in
  isLoadingMore: null, // passed in
  scrollingList: null, // passed in

  scrollingListLengthChanged: observer('scrollingList.[]', function() {
    this.scheduleRefresh();
  }),

  didInsertElement() {
    this._super(...arguments);
    this.scheduleRefresh();
    this.setupLoadMoreHooks();
    if (this.scrollableRegistry) {
      this.scrollableRegistry.register(this);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.scrollableRegistry) {
      this.scrollableRegistry.unregister(this);
    }
    this.tearDownLoadMoreHooks();
  },

  triggerThrottledLoadMore() {
    if (!this.get('hasMore')) { return; }
    if (this.get('isLoadingMore')) { return; }

    run.once(this, this.throttledLoadMore);
  },

  throttledLoadMore() {
    run.throttle(this, this.conditionallyTriggerLoadMore, MAX_LOAD_MORE_FREQUENCY_MS, false);
  },

  conditionallyTriggerLoadMore() {
    if (!this.get('hasMore')) {
      return;
    }
    if (this.get('isLoadingMore')) {
      return;
    }

    let scrollTop = this.get('scrollTop');
    let maxScrollTop = this.get('maxScrollTop');
    let distanceFromBottom = maxScrollTop - scrollTop;
    if (distanceFromBottom < THRESHOLD_FROM_BOTTOM_TO_TRIGGER_LOAD_MORE) {
      this.sendAction('loadMore'); //eslint-disable-line ember/closure-actions
    }
  },

  setupLoadMoreHooks() {
    this.addObserver('scrollTop', this, this.triggerThrottledLoadMore);
    this.addObserver('maxScrollTop', this, this.triggerThrottledLoadMore);
  },

  tearDownLoadMoreHooks() {
    this.removeObserver('scrollTop', this, this.triggerThrottledLoadMore);
    this.removeObserver('maxScrollTop', this, this.triggerThrottledLoadMore);
  }
});
