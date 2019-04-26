/* global Ember, Scroller */
import Component from '@ember/component';
import { classNames, layout } from '@ember-decorators/component';
import template from './template';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
// import { argument } from '@ember-decorators/argument';
// import { optional, type } from '@ember-decorators/argument/type';
// import { ClosureAction } from '@ember-decorators/argument/types';
import normalizeWheel from 'yapp-scroll-view/utils/normalize-wheel';
import Hammer from 'hammerjs';
import ZyngaScrollerVerticalRecognizer from 'yapp-scroll-view/utils/zynga-scroller-vertical-recognizer'
import { join, schedule } from '@ember/runloop';
import { translate } from 'ember-collection/utils/translate';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import ScrollViewApi from '../../utils/scroll-view-api';
import { DEBUG } from '@glimmer/env';
import { registerWaiter, unregisterWaiter } from '@ember/test';

const FIELD_REGEXP = /input|textarea|select/i;
const MEASUREMENT_INTERVAL = 250;
const MEASUREMENT_INTERVAL_WHILE_SCROLLING_OR_OFFSCREEN = 1000;

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function getScrolledToTopChanged(currentTop, lastTop, offset) {
  let isAtTop = currentTop <= offset;
  let isAtTopChanged = false;
  if (isAtTop && (lastTop > offset || lastTop === undefined) ) {
    isAtTopChanged = true;
  } else if (!isAtTop && (lastTop <= offset || lastTop === undefined) ) {
    isAtTopChanged = true;
  }

  return { isAtTop, isAtTopChanged };
}

@layout(template)
@classNames('ScrollView')
export default class ScrollView extends Component {
  // @argument @type(optional('number'))
  contentHeight; // optional, when not provided, we measure the size

  // @argument @type(optional('string'))
  key;

  // @argument @type(optional('number'))
  scrollTopOffset = 0; // optional, when provided, we treat "isAtTop" as anywhere before this offset

  // @argument @type(optional('number'))
  initialScrollTop;

  // @argument @type(optional('any'))
  auxiliaryComponent;

  // @argument @type(optional(ClosureAction))
  clientSizeChange;

  // @argument @type(optional(ClosureAction))
  scrollChange;

  // @argument @type(optional(ClosureAction))
  scrolledToTopChange;

  _scrollTop = 0;
  _isAtTop;
  _needsContentSizeUpdate = true;
  _appliedClientWidth;
  _appliedClientHeight;
  _appliedContentHeight;
  _appliedScrollTop;
  _shouldMeasureContent = undefined;
  _isScrolling = false;
  _lastIsScrolling = false;

  @service('scroll-position-memory')
  memory;

  constructor() {
    super(...arguments);
    this._scrollPositionCallbacks = [];
    this.debouncedOnScrollingComplete = debounce(this.onScrollingComplete, 500);
  }

  didReceiveAttrs() {
    if (this._shouldMeasureContent === undefined) {
      this._shouldMeasureContent = !this.contentHeight;
    }

    if (!this._shouldMeasureContent && (this._appliedContentHeight !== this.contentHeight)) {
      this.measureClientAndContent();
    }
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.contentElement = this.element.firstElementChild;
    this.setupScroller();
    this.measurementTask.perform();
    this.bindScrollerEvents();
    if (DEBUG) {
      registerWaiter(this, this._isScrollingForWaiter);
    }
  }

  didRender() {
    let { key, _lastKey } = this;
    if (key && key !== _lastKey) {
      this.remember(_lastKey);
      this._lastKey = key;
      this.restore(key);
    }
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    this.unbindScrollerEvents();
    this._scrollPositionCallbacks = []
    this.remember(this.key);
    if (DEBUG) {
      if (Ember.testing) {
        window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP = null;
      }
      unregisterWaiter(this, this._isScrollingForWaiter);
    }
  }

  setupScroller(){
    this.scroller = new Scroller(
      this.onScrollChange.bind(this),
      {
        scrollingX: false,
        scrollingComplete: this.onScrollingComplete.bind(this)
      }
    );
  }

  onScrollChange(left, top) {
    let scrollTop = top|0;
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    let { scroller } = this;
    this._decelerationVelocityY = scroller.__decelerationVelocityY;
    this.applyScrollTop({
      scrollTop,
      lastTop: this._appliedScrollTop,
      isScrolling: !!(scroller.__isDragging || scroller.__isDecelerating || scroller.__isAnimating),
  decelerationVelocityY: this._decelerationVelocityY
    });
    if (+(new Date()) - this._lastMeasurement > MEASUREMENT_INTERVAL_WHILE_SCROLLING_OR_OFFSCREEN) {
      this.measureClientAndContent();
    }

    // There are times when onScrollComplete is not called. This is due to subtleties
    // In how the hammer recognizer pass events around. This debounced call will ensure
    // scroll thumb is hidden 500ms after the last onScrollChange call
    this.debouncedOnScrollingComplete()
  }

  applyScrollTop({ scrollTop, lastTop, isScrolling, decelerationVelocityY }) {
    let { isAtTop, isAtTopChanged } = getScrolledToTopChanged(scrollTop, lastTop, this.scrollTopOffset);

    if (this.contentElement) {
      translate(this.contentElement, 0, -1 * scrollTop);
    }

    this.notifyScrollPosition(isScrolling, scrollTop, isAtTop, decelerationVelocityY);

    if (this.scrollChange && scrollTop !== lastTop) {
      this.scrollChange(scrollTop);
    }
    if (this.scrolledToTopChange && isAtTopChanged) {
      this.scrolledToTopChange(isAtTop)
    }
    this._appliedScrollTop = scrollTop;
    if (DEBUG) {
      this._trackIsScrollingForWaiter(isScrolling);
    }
  }

  onScrollingComplete() {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    this.notifyScrollPosition(false, this._appliedScrollTop, this._appliedScrollTop <= this.scrollTopOffset, 0);
    if (DEBUG) {
      this._trackIsScrollingForWaiter(false);
    }
  }

  updateScrollerDimensions() {
    if (this._appliedClientWidth && this._appliedClientHeight) {
      this.scroller.setDimensions(this._appliedClientWidth, this._appliedClientHeight, this._appliedClientWidth, this._appliedContentHeight);
    }
  }

  bindScrollerEvents() {
    this.hammer = new Hammer.Manager(this.element, {
      inputClass: Hammer.TouchMouseInput,
      recognizers: [
        [ZyngaScrollerVerticalRecognizer, { scrollComponent: this }]
      ]
    });
    this._boundHandleWheel = this.handleWheel.bind(this);
    this.element.addEventListener(
      normalizeWheel.getEventType(),
      this._boundHandleWheel,
      { passive: false }
    );
  }

  unbindScrollerEvents() {
    if (this.hammer) {
      this.hammer.destroy();
    }
    this.element.removeEventListener(
      normalizeWheel.getEventType(),
      this._boundHandleWheel,
      false
    );
  }

  doTouchStart(touches, timeStamp) {
    this.scroller.doTouchStart(touches, timeStamp);
  }

  doTouchMove(touches, timeStamp, scale) {
    this.scroller.doTouchMove(touches, timeStamp, scale)
  }

  doTouchEnd(touches, timeStamp) {
    if (this.needsCaptureClick()) {
      this.setupCaptureClickTask.perform();
    }
    this.scroller.doTouchEnd(timeStamp);
  }

  @task
  setupCaptureClickTask = function *() {
    try {
      let { element } = this;
      let captureClick = (e) => {
        e.stopPropagation(); // Stop the click from being propagated.
        element.removeEventListener('click', captureClick, true); // cleanup
      }
      this.element.addEventListener('click', captureClick, true);
      yield timeout(0);
      element.removeEventListener('click', captureClick, true);
    } finally {
      this._decelerationVelocityY = null;
    }
  }

  needsCaptureClick() {
    // There are two cases where we want to prevent the click that normally follows a mouseup/touchend.
    //
    // 1) when the user is just finishing a purposeful scroll (i.e. dragging scroll view beyond a threshold)
    // 2) when animating with "momentum", a tap should stop the movement rather than
    //    trigger an interactive element that may be under the tap. Zynga scroller
    //    takes care of stopping the movement, but we need to capture the click
    //    and stop propagation.
    //
    // This method determines whether either of these cases apply.
    let isFinishingDragging = this.scroller.__isDragging;
    let wasAnimatingWithMomentum = Math.abs(this._decelerationVelocityY) > 2;
    return isFinishingDragging || wasAnimatingWithMomentum;
  }

  handleWheel(e) {
    if (e.target && e.target.tagName.match(FIELD_REGEXP)) {
      return;
    }
    let eventInfo = normalizeWheel(e);
    let delta = eventInfo.pixelY;
    let { scroller } = this;
    let scrollTop = scroller.__scrollTop;
    let maxScrollTop = scroller.__maxScrollTop;
    let candidatePosition = scrollTop + delta;

    e.preventDefault();
    if ( (scrollTop === 0 && candidatePosition < 0) ||
         (scrollTop === maxScrollTop && candidatePosition > maxScrollTop)) {
      return;
    }
    scroller.scrollBy(0, delta, true);
    e.stopPropagation();
  }

  @task
  measurementTask = function*() {
    // Before we check the size for the first time, we capture the intended scroll position
    // and apply it after we determine and apply the size. The reason we need to do this
    // is that attempting to apply the scroll position before the scroller has size results
    // in a scroll position of [0,0].
    let initialScrollTop = this.initialScrollTop !== undefined ? this.initialScrollTop : this.scrollTopOffset;
    this.measureClientAndContent();
    this._initialSizeCheckCompleted = true;
    if (initialScrollTop) {
      this.scroller.scrollTo(0, initialScrollTop);
    }
    if (DEBUG) {
      if (Ember.testing) {
        window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP = () => {
          this.measureClientAndContent();
        };
        return;
      }
    }
    let lastIsInViewport = true;
    while(true) { // eslint-disable-line no-constant-condition
      yield timeout(lastIsInViewport ? MEASUREMENT_INTERVAL : MEASUREMENT_INTERVAL_WHILE_SCROLLING_OR_OFFSCREEN);
      lastIsInViewport = this.isInViewport;
      if (lastIsInViewport && !this._isScrolling) {
        this.measureClientAndContent();
      }
    }
  }

  measureClientAndContent() {
    if (!this.element) {
      return;
    }
    this._lastMeasurement = +(new Date());
    let { clientWidth, clientHeight, contentHeight } = this.getCurrentClientAndContentSizes();

    if (!this.hasClientOrContentSizeChanged(clientWidth, clientHeight, contentHeight)) {
      return;
    }
    join(this, this.applyNewMeasurements, clientWidth, clientHeight, contentHeight);
  }

  getCurrentClientAndContentSizes() {
    let { contentHeight, element: { offsetWidth, offsetHeight }} = this;
    if (this._shouldMeasureContent) {
      contentHeight = this.contentElement.offsetHeight;
    }

    return { contentHeight, clientHeight: offsetHeight , clientWidth: offsetWidth }
  }

  hasClientOrContentSizeChanged(clientWidth, clientHeight, contentHeight) {
    return contentHeight !== this._appliedContentHeight || clientWidth !== this._appliedClientWidth || clientHeight !== this._appliedClientHeight;
  }

  applyNewMeasurements(clientWidth, clientHeight, contentHeight) {
    this._appliedClientWidth = clientWidth;
    this.set('_appliedClientHeight', clientHeight);
    this.set('_appliedContentHeight', contentHeight);
    this.contentElement.style.minHeight = `${clientHeight}px`;
    this.updateScrollerDimensions();
    if (this.clientSizeChange) {
      this.clientSizeChange(clientWidth, clientHeight);
    }
  }

  get windowRef() { // need a way to reference `window` from hbs
    return window;
  }

  get isInViewport() {
    if (!this.element) {
      return false;
    }
    let rect = this.element.getBoundingClientRect();
    return rect.top >= 0 &&
           rect.left >= 0 &&
           rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
           rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }

  scrollTo(yPos, animated=false) {
    if (this.element) {
      return this.scroller.scrollTo(0, yPos, animated);
    }
  }

  scrollToTop() {
    return this.scrollTo(0, true);
  }

  scrollToTopIfInViewport() {
    if (this.isInViewport) {
      this.scrollToTop();
    }
  }

  scrollToBottom() {
    this.measureClientAndContent();
    return this.scrollTo(this._appliedContentHeight - this._appliedClientHeight, true);
  }

  scrollToElement(el, animated=false) {
    this.measureClientAndContent();
    if (this.element) {
      let yPos = this._yOffset(el) + (this.get('extraYOffsetForScrollToElement') || 0);
      return this.scroller.scrollTo(0, yPos, animated);
    } else {
      return console.warn("scrollToElement called before scrollView is inDOM"); // eslint-disable-line
    }
  }

  _yOffset(el) {
    let top = el.offsetTop;
    while (el !== this.element && (el = el.offsetParent)) {
      top += el.offsetTop;
    }
    return top;
  }

  scheduleRefresh(){
    console.debug('scheduleRefresh is no longer needed. Hurray!'); // eslint-disable-line
  }
  getViewHeight(){}

  remember(key) {
    if (key) {
      let position = this._appliedScrollTop;
      this.memory[key] = position;
    }
  }

  restore(key) {
    let position = this.initialScrollTop || this.memory[key] || this.scrollTopOffset;
    if (this.element) {
      this.scrollTo(position);
    } else {
      schedule('afterRender', this, this.scrollTo, position);
    }
  }

  @computed
  get scrollViewApi() {
    return ScrollViewApi.create({
      _scrollComponent: this
    });
  }

  unregisterScrollPositionCallback(scrollPositionCallback) {
    let index = this._scrollPositionCallbacks.indexOf(scrollPositionCallback);
    if (index > -1) {
      this._scrollPositionCallbacks.splice(index, 1);
    }
  }

  registerScrollPositionCallback(scrollPositionCallback) {
    this._scrollPositionCallbacks.push(scrollPositionCallback);
  }

  notifyScrollPosition(isScrolling, scrollTop, isAtTop, velocityY) {
    this._scrollPositionCallbacks.forEach((callback) => {
      callback(isScrolling, scrollTop, isAtTop, velocityY);
    });
  }

  _trackIsScrollingForWaiter(isScrolling) {
    this._lastIsScrolling = isScrolling;
  }

  _isScrollingForWaiter() {
    return !this._lastIsScrolling;
  }
}
