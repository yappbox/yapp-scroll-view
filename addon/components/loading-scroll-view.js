import ScrollView from './scroll-view/component';
import { classNames } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import { ClosureAction } from '@ember-decorators/argument/types';
import { run } from '@ember/runloop';

const MAX_LOAD_MORE_FREQUENCY_MS = 1000;

@classNames('LoadingScrollView')
export default class LoadingScrollView extends ScrollView {
  @argument @type('boolean') hasMore;
  @argument @type('boolean') isLoadingMore;
  @argument @type(ClosureAction) loadMore;
  @argument @type('number') threshold = 350;

  onScrollChange(scrollLeft, scrollTop, params) {
    super.onScrollChange(scrollLeft, scrollTop, params);
    this.triggerThrottledLoadMore();
  }

  triggerThrottledLoadMore() {
    if (!this.canLoadMore) {
      return;
    }
    run.once(this, this.throttledLoadMore);
  }

  get canLoadMore() {
    return (this.loadMore && this.hasMore && !this.isLoadingMore && !this.isDestroyed && !this.isDestroying);
  }

  throttledLoadMore() {
    run.throttle(this, this.conditionallyTriggerLoadMore, MAX_LOAD_MORE_FREQUENCY_MS, false);
  }

  conditionallyTriggerLoadMore() {
    if (!this.canLoadMore) {
      return;
    }

    let scrollTop = this._appliedScrollTop;
    let maxScrollTop = this._appliedContentHeight - this._appliedClientHeight;
    let distanceFromBottom = maxScrollTop - scrollTop;
    if (distanceFromBottom >= this.threshold) {
      return;
    }

    let loadMoreResult = this.loadMore();
    if (loadMoreResult && loadMoreResult.then) {
      loadMoreResult.then(() => {
        this.measureClientAndContent();
      });
    }
  }
}
