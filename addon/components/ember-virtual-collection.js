import { set } from '@ember/object';
import EmberCollection from 'ember-collection/components/ember-collection';
import layout from './ember-virtual-collection/template';
const hasTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch;
import { computed } from '@ember/object';
import ScrollViewApi from '../utils/scroll-view-api';

export default EmberCollection.extend({
  layout: layout,
  classNames: ['ember-virtual-collection'],
  isTouching: false,
  captureClicksWhenScrolling: true,
  init() {
    this._super(...arguments);
    this._initialScrollTop = this.getAttr('initial-scroll-top');
    this._scrollControlApiRegistrar = this.getAttr('scroll-control-api-registrar');
  },
  didInsertElement(){
    this._super(...arguments);
    if (this.get('captureClicksWhenScrolling')) {
      this.setupClickCapture();
    }
  },
  willDestroyElement(){
    this._super(...arguments);
    if (this.get('captureClicksWhenScrolling')) {
      this.teardownClickCapture();
    }
  },
  setupClickCapture(){
    let component = this;
    let element = this.get('element');
    component.captureClick = function(e){
      e.stopPropagation(); // Stop the click from being propagated.
      this.removeEventListener('click', component.captureClick, true); // cleanup
    };
    if (hasTouch) {
      component.ccTouchend = function() {
        if (component._isScrolling && Math.abs(component._decelerationVelocityY) > 2) {
          element.addEventListener('click', component.captureClick, true);
          setTimeout(function(){
            element.removeEventListener('click', component.captureClick, true);
          }, 0);
        }
      };
      element.addEventListener('touchend', component.ccTouchend, false);
    } else {
      component.ccMousedown = function() {
        component._didScroll = false;
      };
      component.ccMouseup = function() {
        if (component._didScroll || (component._isScrolling && Math.abs(component._decelerationVelocityY) > 2)) {
          element.addEventListener('click', component.captureClick, true);
          setTimeout(function(){
            element.removeEventListener('click', component.captureClick, true);
          }, 0);
        }
      };
      element.addEventListener('mousedown', component.ccMousedown, false);
      element.addEventListener('mouseup', component.ccMouseup, false);
    }
  },
  teardownClickCapture(){
    let element = this.get('element');
    element.removeEventListener('click', this.captureClick, true);
    if (hasTouch) {
      element.removeEventListener('touchend', this.ccTouchend, false);
    } else {
      element.removeEventListener('mousedown', this.ccMousedown, false);
      element.removeEventListener('mouseup', this.ccMouseup, false);
    }
  },
  handleScrollChange(scrollLeft, scrollTop, params){
    if (this._scrollChange) {
      if (this.scrollChange) {
        this.scrollChange('scrollChange', scrollLeft, scrollTop, params);
      }
    } else {
      if (scrollLeft !== this._scrollLeft ||
          scrollTop !== this._scrollTop) {
        set(this, '_scrollLeft', scrollLeft);
        set(this, '_scrollTop', scrollTop);
        this._needsRevalidate();
      }
    }
    this._isScrolling = this._didScroll = true;
    this._decelerationVelocityY = params.decelerationVelocityY;
  },
  handleScrollingComplete(){
    setTimeout(()=>{
      this._isScrolling = false;
      this._decelerationVelocityY = 0;
    }, 0);
  },
  scrollToBottom() {
    let scrollableViewHeight = this._contentSize.height;
    let height = this._clientHeight;

    return this.scrollTo(scrollableViewHeight - height, true);
  },
  scrollToElement() {},
  scrollToTop() {
    return this.scrollTo(0, true);
  },
  scheduleRefresh() {
    console.warn('scheduleRefresh is a no-op for ember-virtual-collection because ember-virtual-scrollable monitors its own size');
  },
  getViewHeight() {},
  scrollTo(yPos, animated = 'ignored') {
    set(this, '_scrollTop', yPos);
  },
  scrollViewApi: computed(function() {
    return ScrollViewApi.create({
      _scrollComponent: this
    });
  }),
  actions: {
    touchingChange(val){
      this.set('isTouching', val);
    },
    scrollingComplete() {
      this.handleScrollingComplete();
    },
    scrollChange(scrollLeft, scrollTop, params) {
      this.handleScrollChange(scrollLeft, scrollTop, params);
    },
    clientSizeChange(clientWidth, clientHeight) {
      if (this._clientWidth !== clientWidth ||
          this._clientHeight !== clientHeight) {
        set(this, '_clientWidth', clientWidth);
        set(this, '_clientHeight', clientHeight);
        this._needsRevalidate();
      }
    }
  }
});
