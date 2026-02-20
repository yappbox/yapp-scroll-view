import ScrollView from './scroll-view.gjs';
import VerticalScrollBar from './vertical-scroll-bar.gjs';
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
import emitterAction from '../helpers/emitter-action.js';

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

  <template>
    <div
      class='ScrollView {{this.extraCssClasses}}'
      ...attributes
      {{didInsert this.didInsert}}
      {{didUpdate this.onContentHeightChanged @contentHeight}}
      {{didUpdate this.onKeyUpdated @key}}
    >
      <div data-test-scroll-container>
        {{yield this.scrollViewApi}}
      </div>
      {{#if @auxiliaryComponent}}
        {{component @auxiliaryComponent}}
      {{/if}}
      <VerticalScrollBar
        data-test-scroll-bar
        class='ScrollView-scrollBar'
        @contentHeight={{this.scrollBarContentHeight}}
        @scrollerHeight={{this.scrollBarClientHeight}}
        @registerWithScrollView={{this.scrollViewApi.registerScrollPositionCallback}}
      />
      {{emitterAction
        emitter=this.windowRef
        eventName='requestScrollToTop'
        action=this.scrollViewApi.scrollToTopIfInViewport
      }}
    </div>
  </template>
}
