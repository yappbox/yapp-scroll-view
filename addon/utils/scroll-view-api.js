import Evented from '@ember/object/evented';
import EmberObject from '@ember/object';

export default EmberObject.extend(Evented, {
  init(){
    this._super(...arguments);
    let { _scrollComponent } = this;
    this.scrollToBottom = _scrollComponent.scrollToBottom.bind(_scrollComponent);
    this.scrollToElement = _scrollComponent.scrollToElement.bind(_scrollComponent);
    this.scrollToTop = _scrollComponent.scrollToTop.bind(_scrollComponent);
    this.scrollTo = _scrollComponent.scrollTo.bind(_scrollComponent);
    this.scrollToTopIfInViewport = _scrollComponent.scrollToTopIfInViewport.bind(_scrollComponent);
    this.getViewHeight = _scrollComponent.getViewHeight.bind(_scrollComponent);
    this.registerScrollPositionCallback = _scrollComponent.registerScrollPositionCallback.bind(_scrollComponent);
    this.unregisterScrollPositionCallback = _scrollComponent.unregisterScrollPositionCallback.bind(_scrollComponent);
  },
  scrollingChanged(value) {
    this.trigger('isScrollingChanged', value);
  }
});
