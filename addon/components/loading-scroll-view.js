import ScrollView from './scroll-view';
// import { argument } from '@ember-decorators/argument';
// import { Action } from '@ember-decorators/argument/types';

const MAX_LOAD_MORE_FREQUENCY_MS = 1000;

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
  // threshold;

  _lastLoadMoreCheck = +new Date();

  onScrollChange(scrollLeft, scrollTop) {
    super.onScrollChange(scrollLeft, scrollTop);
    if (
      this.canLoadMore &&
      +new Date() - this._lastLoadMoreCheck > MAX_LOAD_MORE_FREQUENCY_MS
    ) {
      this.conditionallyTriggerLoadMore();
    }
  }

  onScrollingComplete() {
    super.onScrollingComplete();
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    this.conditionallyTriggerLoadMore();
  }

  get extraCssClasses() {
    // for overriding by LoadingScrollView
    return [super.extraCssClasses, 'LoadingScrollView']
      .filter(Boolean)
      .join(' ');
  }

  get canLoadMore() {
    if (this.isDestroyed || this.isDestroying) {
      return false;
    }
    return this.args.loadMore && this.args.hasMore && !this.args.isLoadingMore;
  }

  get threshold() {
    return this.args.threshold || 350;
  }

  conditionallyTriggerLoadMore() {
    this._lastLoadMoreCheck = +new Date();

    // on Android, the webview has initial content height of 0 until after the first
    // render cycle completes, so we can't do load-more checks until we have a
    // non-zero content height applied.
    if (!this.canLoadMore || !this._appliedContentHeight) {
      return;
    }

    let scrollTop = this._appliedScrollTop;
    let maxScrollTop = this._appliedContentHeight - this._appliedClientHeight;
    let distanceFromBottom = maxScrollTop - scrollTop;
    if (distanceFromBottom >= this.threshold) {
      return;
    }

    let loadMoreResult = this.args.loadMore();
    if (loadMoreResult && loadMoreResult.then) {
      loadMoreResult.then(() => {
        this.measureClientAndContent();
      });
    }
  }
}
