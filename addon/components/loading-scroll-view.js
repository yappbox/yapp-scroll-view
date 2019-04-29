import ScrollView from './scroll-view/component';
import { classNames } from '@ember-decorators/component';
// import { argument } from '@ember-decorators/argument';
// import { Action } from '@ember-decorators/argument/types';

const MAX_LOAD_MORE_FREQUENCY_MS = 1000;

@classNames('LoadingScrollView')
export default class LoadingScrollView extends ScrollView {
  // @argument('boolean')
  // hasMore;
  //
  // @argument('boolean')
  // isLoadingMore;
  //
  // @argument(Action)
  // loadMore;
  //
  // @argument('number')
  threshold = this.threshold || 350;

  _lastLoadMoreCheck = +(new Date());

  onScrollChange(scrollLeft, scrollTop) {
    super.onScrollChange(scrollLeft, scrollTop);
    if (this.canLoadMore && ((+(new Date()) - this._lastLoadMoreCheck) > MAX_LOAD_MORE_FREQUENCY_MS)) {
      this.conditionallyTriggerLoadMore();
    }
  }

  onScrollingComplete() {
    super.onScrollingComplete();
    this.conditionallyTriggerLoadMore();
  }

  get canLoadMore() {
    return (this.loadMore && this.hasMore && !this.isLoadingMore && !this.isDestroyed && !this.isDestroying);
  }

  conditionallyTriggerLoadMore() {
    this._lastLoadMoreCheck = +(new Date());

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
