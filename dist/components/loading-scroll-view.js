import ScrollView from './scroll-view.js';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<div\n  class=\"ScrollView {{this.extraCssClasses}}\"\n  ...attributes\n  {{did-insert this.didInsert}}\n  {{did-update this.onContentHeightChanged @contentHeight}}\n  {{did-update this.onKeyUpdated @key}}\n>\n  <div data-test-scroll-container>\n    {{yield this.scrollViewApi}}\n  </div>\n  {{#if @auxiliaryComponent}}\n    {{component @auxiliaryComponent}}\n  {{/if}}\n  <VerticalScrollBar\n      data-test-scroll-bar\n      class=\"ScrollView-scrollBar\"\n      @contentHeight={{this.scrollBarContentHeight}}\n      @scrollerHeight={{this.scrollBarClientHeight}}\n      @registerWithScrollView={{this.scrollViewApi.registerScrollPositionCallback}}\n  />\n  {{emitter-action\n    emitter=this.windowRef\n    eventName=\"requestScrollToTop\"\n    action=this.scrollViewApi.scrollToTopIfInViewport\n  }}\n</div>\n");

const MAX_LOAD_MORE_FREQUENCY_MS = 1000;
class LoadingScrollView extends ScrollView {
  _lastLoadMoreCheck = +new Date();
  onScrollChange(scrollLeft, scrollTop) {
    super.onScrollChange(scrollLeft, scrollTop);
    if (this.canLoadMore && +new Date() - this._lastLoadMoreCheck > MAX_LOAD_MORE_FREQUENCY_MS) {
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
    return [super.extraCssClasses, 'LoadingScrollView'].filter(Boolean).join(' ');
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
setComponentTemplate(TEMPLATE, LoadingScrollView);

export { LoadingScrollView as default };
//# sourceMappingURL=loading-scroll-view.js.map
