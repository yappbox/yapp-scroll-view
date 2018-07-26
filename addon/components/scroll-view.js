/* globals Scroller */
import { readOnly } from '@ember/object/computed';

import Evented from '@ember/object/evented';
import Component from '@ember/component';
import { throttle } from '@ember/runloop';
import EmberObject, { computed, observer } from '@ember/object';
import Ember from 'ember';
const { Logger } = Ember;
import ScrollerEvents from '../mixins/scroller-events';
import ScrollbarHost from '../mixins/scrollbar-host';
import ScrollerMeasurement from '../mixins/scroller-measurement';
import ScrollPositionMemory from '../mixins/scroll-position-memory';
import getVendorPrefix from '../utils/vendor-prefix';
import cssTransform from '../utils/css-transform';
import ScrollerApiRegistration from '../mixins/scroller-api-registration';
import template from '../templates/components/scroll-view';

const SCOLLER_CALLBACK_THROTTLE_AMOUNT = 200;

let vendorPrefix = getVendorPrefix();
let translateY = cssTransform.translateY;

export default Component.extend(ScrollerEvents, ScrollbarHost, ScrollerMeasurement, ScrollerApiRegistration, ScrollPositionMemory, {
  classNames: ['y-scroll-view', 'js-scrollView'],
  layout: template,
  scroller: null,
  initialScrollTop: 0,
  scrollTop: 0,
  scrollableElement: null,
  viewport: null, // injected
  extraYOffsetForScrollToElement: 0,

  getScrollableElement() {
    return this.element.firstElementChild;
  },

  didInsertElement() {
    this._super(...arguments);

    let scrollableElement = this.getScrollableElement();
    this.set('scrollableElement', scrollableElement);

    let scrollerCallback = (left, top/*, zoom*/) => {
      if (this.isDestroyed || this.isDestroying) { return; }

      this.updateScrollbar(top);
      translateY(this.scrollableElement, top);
      this._decelerationVelocityY = scroller.__decelerationVelocityY;
      if (top === 0) {
        this.setScrollTop(top); // 0 is important and is sometimes missed by throttle
      } else {
        throttle(this, this.setScrollTop, top, SCOLLER_CALLBACK_THROTTLE_AMOUNT);
      }
    }
    let scrollerOptions = {
      scrollingX: false,
      scrollingComplete: () => {
        this.trigger('scrollingDidComplete');
      }
    };

    let scroller = new Scroller(scrollerCallback, scrollerOptions);

    this.scroller = scroller;
    this.trigger('didInitializeScroller');
    this.bindScrollerEvents();

    scrollableElement.style[vendorPrefix + 'TransformOrigin'] = "left top";
  },

  setScrollTop(top) {
    this.set('scrollTop', top);
  },

  dimensionsDidChange: observer('viewport.{width,height}',function() {
    this.scheduleRefresh();
  }),

  didInitializeScroller() { },
  scrollingDidComplete() { },

  willDestroyElement() {
    this._super(...arguments);
    this.unbindScrollerEvents();
    this.set('scrollableElement', null);
  },

  scrollTo(yPos, animated=false) {
    if (this.element) {
      return this.scroller.scrollTo(0, yPos, animated);
    }
  },

  scrollToTop() {
    return this.scrollTo(0, true);
  },

  resetScrollPosition() {
    return this.scrollTo(this.get('initialScrollTop'), false);
  },

  scrollToBottom() {
    let scrollableViewHeight = this.$(this.get('scrollableElement')).outerHeight();
    let height = this.$().height();

    return this.scrollTo(scrollableViewHeight - height, true);
  },

  scrollToElement(el, animated=false) {
    if (this.element) {
      let yPos = this._yOffset(el) + (this.get('extraYOffsetForScrollToElement') || 0);
      return this.scroller.scrollTo(0, yPos, animated);
    } else {
      return Logger.warn("scrollToElement called before scrollView is inDOM");
    }
  },

  _yOffset(el) {
    let top = el.offsetTop;
    while (el !== this.element && (el = el.offsetParent)) {
      top += el.offsetTop;
    }
    return top;
  },

  getViewHeight() {
    return this.$().height();
  },

  scrollView: computed(function() {
    return this;  // perhaps return a proxy that exposes only the "public" methods
  }),

  scrollViewApi: computed(function() {
    return ScrollViewApi.create({
      _scrollView: this
    });
  })
});

const ScrollViewApi = EmberObject.extend(Evented, {
  init(){
    this._super(...arguments);
    let _scrollView = this.get('_scrollView');
    this.scrollToBottom = _scrollView.scrollToBottom.bind(_scrollView);
    this.scrollToElement = _scrollView.scrollToElement.bind(_scrollView);
    this.scrollToTop = _scrollView.scrollToTop.bind(_scrollView);
    this.scheduleRefresh = _scrollView.scheduleRefresh.bind(_scrollView);
    this.getViewHeight = _scrollView.getViewHeight.bind(_scrollView);
  },
  scrollingChanged(value) {
    this.trigger('isScrollingChanged', value);
  },
  scrollTop: readOnly('_scrollView.scrollTop')
});
