import EmberObject from '@ember/object';
import EventEmitter from 'eventemitter3';
import { action } from '@ember/object';

export default class extends EmberObject {
  events = new EventEmitter();
  constructor(args){
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
  @action
  addEventListener() {
    this.events.addListener(...arguments);
  }
  @action
  removeEventListener() {
    this.events.removeListener(...arguments);
  }
}
