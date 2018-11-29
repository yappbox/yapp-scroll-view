import Evented from '@ember/object/evented';
import { readOnly } from '@ember/object/computed';
import EmberObject from '@ember/object';

export default EmberObject.extend(Evented, {
  init(){
    this._super(...arguments);
    let _scrollComponent = this.get('_scrollComponent');
    this.scrollToBottom = _scrollComponent.scrollToBottom.bind(_scrollComponent);
    this.scrollToElement = _scrollComponent.scrollToElement.bind(_scrollComponent);
    this.scrollToTop = _scrollComponent.scrollToTop.bind(_scrollComponent);
    this.scrollTo = _scrollComponent.scrollTo.bind(_scrollComponent);
    this.scrollToTopIfInViewport = _scrollComponent.scrollToTopIfInViewport.bind(_scrollComponent);
    this.scheduleRefresh = _scrollComponent.scheduleRefresh.bind(_scrollComponent);
    this.getViewHeight = _scrollComponent.getViewHeight.bind(_scrollComponent);
  },
  scrollingChanged(value) {
    this.trigger('isScrollingChanged', value);
  },
  scrollTop: readOnly('_scrollComponent.scrollTop'),
  isAtTop: readOnly('_scrollComponent._isAtTop'),
  isScrolling: readOnly('_scrollComponent._isScrolling'),
});
