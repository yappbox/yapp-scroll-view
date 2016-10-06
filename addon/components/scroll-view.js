/* globals Scroller */
import Ember from 'ember';
const { run, Logger, computed } = Ember;
import ScrollerEvents from '../mixins/scroller-events';
import ScrollbarHost from '../mixins/scrollbar-host';
import ScrollerMeasurement from '../mixins/scroller-measurement';
import getVendorPrefix from '../utils/vendor-prefix';
import cssTransform from '../utils/css-transform';
import ScrollsToTop from '../mixins/scroller-scrolls-to-top';
import template from '../templates/components/scroll-view';

let vendorPrefix = getVendorPrefix();
let translateY = cssTransform.translateY;

export default Ember.Component.extend(ScrollerEvents, ScrollbarHost, ScrollerMeasurement, ScrollsToTop, {
  classNames: ['y-scroll-view', 'js-scrollView'],
  layout: template,
  scroller: null,
  scrollTop: 0,
  scrollableElement: null,
  viewport: null, // injected
  extraYOffsetForScrollToElement: 0,

  getScrollableElement() {
    return this.element.firstElementChild;
  },

  didInsertElement: function() {
    this._super(...arguments);

    let scrollableElement = this.getScrollableElement();
    this.set('scrollableElement', scrollableElement);

    let scrollerOptions = {
      scrollingX: false,
      scrollingComplete: () => {
        console.log('scroller.scrollingComplete');
        this.trigger('scrollingDidComplete');
      }
    };
    let scroller = new Scroller( (left, top/*, zoom*/) => {
      if (this.isDestroyed || this.isDestroying) { return; }
      run(this, function() {
        console.log('scroller.run', top);
        this.set('scrollTop', top);
        this.updateScrollbar(top);
        translateY(this.scrollableElement, top);
        this._decelerationVelocityY = scroller.__decelerationVelocityY;
      });
    }, scrollerOptions);

    this.scroller = scroller;
    this.trigger('didInitializeScroller');
    this.bindScrollerEvents();

    scrollableElement.style[vendorPrefix + 'TransformOrigin'] = "left top";
  },

  dimensionsDidChange: function () {
    this.scheduleRefresh();
  }.observes('viewport.width', 'viewport.height'),

  // didInitializeScroller() { },
  // scrollingDidStart() { },
  // scrollingDidComplete() { },

  willDestroyElement() {
    this._super(...arguments);
    this.unbindScrollerEvents();
    this.set('scrollableElement', null);
  },

  scrollTo(yPos, animated=false) {
    if (this.element) {
      this.trigger('scrollingDidStart');
      return this.scroller.scrollTo(0, yPos, animated);
    } else {
      return Logger.warn("Called scrollTo before scrollView is inDOM");
    }
  },

  scrollToTop() {
    return this.scrollTo(0, true);
  },

  scrollToBottom() {
    let scrollableViewHeight = this.$(this.get('scrollableElement')).outerHeight();
    let height = this.$().height();

    return this.scrollTo(scrollableViewHeight - height, true);
  },

  scrollToElement(el, animated=false) {
    console.log('about to scroll to element', el);
    let yPos = this._yOffset(el) + (this.get('extraYOffsetForScrollToElement') || 0);
    return this.scrollTo(yPos, animated);
  },

  _yOffset(el) {
    let top = el.offsetTop;
    while ((el = el.offsetParent)) {
      top += el.offsetTop;
    }
    return top;
  },

  elementIsVisible(el) {
    let top = this._yOffset(el);
    let scrollTop = this.get('scrollTop');
    let height = this.$().height();

    return top > scrollTop && top < scrollTop + height;
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

const ScrollViewApi = Ember.Object.extend(Ember.Evented, {
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
  scrollTop: computed.readOnly('_scrollView.scrollTop')
});