import EmberObject, { action } from '@ember/object';
import EventEmitter from 'eventemitter3';
import { n } from 'decorator-transforms/runtime';

class ScrollViewApi extends EmberObject {
  events = new EventEmitter();
  constructor(args) {
    super(...arguments);
    let _scrollComponent = this._scrollComponent = args._scrollComponent;
    this.scrollToBottom = _scrollComponent.scrollToBottom.bind(_scrollComponent);
    this.scrollToElement = _scrollComponent.scrollToElement.bind(_scrollComponent);
    this.scrollToTop = _scrollComponent.scrollToTop.bind(_scrollComponent);
    this.scrollTo = _scrollComponent.scrollTo.bind(_scrollComponent);
    this.scrollToTopIfInViewport = _scrollComponent.scrollToTopIfInViewport.bind(_scrollComponent);
    this.getViewHeight = _scrollComponent.getViewHeight.bind(_scrollComponent);
    this.registerScrollPositionCallback = _scrollComponent.registerScrollPositionCallback.bind(_scrollComponent);
    this.unregisterScrollPositionCallback = _scrollComponent.unregisterScrollPositionCallback.bind(_scrollComponent);
  }
  scrollingChanged(value) {
    this.events.emit('isScrollingChanged', value);
  }
  addEventListener() {
    this.events.addListener(...arguments);
  }
  static {
    n(this.prototype, "addEventListener", [action]);
  }
  removeEventListener() {
    this.events.removeListener(...arguments);
  }
  static {
    n(this.prototype, "removeEventListener", [action]);
  }
}

export { ScrollViewApi as default };
//# sourceMappingURL=scroll-view-api.js.map
