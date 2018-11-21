import ScrollView from './scroll-view/component';
import { classNames } from '@ember-decorators/component';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import { ClosureAction } from '@ember-decorators/argument/types';
import { run } from '@ember/runloop';

const THRESHOLD_FROM_BOTTOM_TO_TRIGGER_LOAD_MORE = 350;
const MAX_LOAD_MORE_FREQUENCY_MS = 1000;

@classNames('LoadingScrollView')
export default class LoadingScrollView extends ScrollView {
  @argument @type('boolean') hasMore;
  @argument @type('boolean') isLoadingMore;
  @argument @type(ClosureAction) loadMore;

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
    return (this.hasMore && !this.isLoadingMore && !this.isDestroyed && !this.isDestroying);
  }

  throttledLoadMore() {
    run.throttle(this, this.conditionallyTriggerLoadMore, MAX_LOAD_MORE_FREQUENCY_MS, false);
  }

  conditionallyTriggerLoadMore() {
    if (!this.canLoadMore) {
      return;
    }

    let scrollTop = this._scrollTop;
    let maxScrollTop = this._contentHeight - this._clientHeight;
    let distanceFromBottom = maxScrollTop - scrollTop;
    if (distanceFromBottom < THRESHOLD_FROM_BOTTOM_TO_TRIGGER_LOAD_MORE) {
      if (this.loadMore) {
        let loadMoreResult = this.loadMore();
        if (loadMoreResult && loadMoreResult.then) {
          loadMoreResult.then(() => {
            this.measureClientAndContent();
          });
        }
      }
    }
  }
}
