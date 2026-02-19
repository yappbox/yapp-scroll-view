import ScrollView from './scroll-view.js';

const MAX_LOAD_MORE_FREQUENCY_MS = 1000;

export default class LoadingScrollView extends ScrollView {
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
