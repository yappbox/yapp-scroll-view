/* global Scroller */
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
// import { argument } from '@ember-decorators/argument';
// import { Action, optional } from '@ember-decorators/argument/types';
import normalizeWheel from 'yapp-scroll-view/utils/normalize-wheel';
import Hammer from 'hammerjs';
import ZyngaScrollerVerticalRecognizer from 'yapp-scroll-view/utils/zynga-scroller-vertical-recognizer';
import { join, schedule } from '@ember/runloop';
import { translate } from 'ember-collection/utils/translate';
import { timeout, waitForQueue } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import ScrollViewApi from 'yapp-scroll-view/utils/scroll-view-api';
import { DEBUG } from '@glimmer/env';
import { buildWaiter } from '@ember/test-waiters';
import Ember from 'ember';
import { cached } from 'ember-cached-decorator-polyfill';

let waiter = buildWaiter('yapp-scroll-view:scrolling');

const FIELD_REGEXP = /input|textarea|select/i;
const MEASUREMENT_INTERVAL = 250;
const MEASUREMENT_INTERVAL_WHILE_SCROLLING_OR_OFFSCREEN = 1000;
const LONG_PRESS_DELAY = 500;
const GHOST_CLICK_DELAY = 100;

const isIPhone = /iPhone|iPod|iPad/i.test(navigator.appVersion);

let timeoutID = 0;
function addCaptureClick(domElement) {
  if (timeoutID) {
    clearTimeout(timeoutID);
  } else {
    domElement.addEventListener('click', captureClick, true);
  }
  let cancelCaptureClick = () => {
    timeoutID = 0;
    domElement.removeEventListener('click', captureClick, true);
  };
  timeoutID = setTimeout(cancelCaptureClick, GHOST_CLICK_DELAY);
}

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
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
  if (isAtTop && (lastTop > offset || lastTop === undefined)) {
    isAtTopChanged = true;
  } else if (!isAtTop && (lastTop <= offset || lastTop === undefined)) {
    isAtTopChanged = true;
  }

  return { isAtTop, isAtTopChanged };
}

function captureClick(e) {
  e.stopPropagation();
  e.target
    .closest('.ScrollView')
    .removeEventListener('click', captureClick, true);
}

class ScrollView extends Component {
  // @argument(optional('number'))
  // contentHeight; // optional, when not provided, we measure the size
  //
  // @argument(optional('string'))
  // key;
  //
  // @argument(optional('number'))
  // scrollTopOffset; // when provided, we treat "isAtTop" as anywhere before this offset

  // @argument(optional('number'))
  // initialScrollTop;
  //
  // @argument(optional('any'))
  // auxiliaryComponent;
  //
  // @argument(optional(Action))
  // clientSizeChange;
  //
  // @argument(optional(Action))
  // scrollChange;
  //
  // @argument(optional(Action))
  // scrolledToTopChange;

  _scrollTop = 0;
  _isAtTop;
  _needsContentSizeUpdate = true;
  _appliedClientWidth;
  _appliedClientHeight;
  _appliedContentHeight;
  @tracked scrollBarClientHeight;
  @tracked scrollBarContentHeight;
  _appliedScrollTop;
  _shouldMeasureContent = undefined;
  _isScrolling = false;
  _touchStartTimeStamp = null;
  _lastIsScrolling = false;

  @service('scroll-position-memory')
  memory;

  constructor() {
    super(...arguments);
    this._scrollPositionCallbacks = [];
    this.debouncedOnScrollingComplete = debounce(this.onScrollingComplete, 500);
  }

  @action
  onContentHeightChanged() {
    if (this._shouldMeasureContent === undefined) {
      this._shouldMeasureContent = !this.args.contentHeight;
    }

    if (
      !this._shouldMeasureContent &&
      this._appliedContentHeight !== this.args.contentHeight
    ) {
      this.measureClientAndContent();
    }
  }

  @action
  didInsert(element) {
    this.scrollViewElement = element;
    this.contentElement = element.firstElementChild;
    this.setupScroller();
    this.measurementTask.perform();
    this.bindScrollerEvents(element);
    this.onKeyUpdated();
  }

  @action
  onKeyUpdated() {
    let { _lastKey } = this;
    let { key } = this.args;
    if (key !== _lastKey) {
      if (_lastKey) {
        this.remember(_lastKey);
      }
      if (key) {
        this.restore(key);
      }
      this._lastKey = key;
    }
  }

  willDestroy() {
    this.unbindScrollerEvents(this.scrollViewElement);
    this.scrollViewElement = null;
    this._scrollPositionCallbacks = [];
    this.remember(this._lastKey);
    if (DEBUG) {
      if (Ember.testing) {
        window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP = null;
      }
      this._trackIsScrollingForWaiter(false);
    }
    super.willDestroy(...arguments);
  }

  setupScroller() {
    this.scroller = new Scroller(this.onScrollChange.bind(this), {
      scrollingX: false,
      scrollingComplete: this.onScrollingComplete.bind(this),
    });
  }

  onScrollChange(_left, top) {
    let scrollTop = top | 0;
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    let { scroller } = this;
    let isScrolling = !!(
      scroller.__isDragging ||
      scroller.__isDecelerating ||
      scroller.__isAnimating
    );
    this._isScrolling = isScrolling;
    this._decelerationVelocityY = scroller.__decelerationVelocityY;
    this.applyScrollTop({
      scrollTop,
      lastTop: this._appliedScrollTop,
      isScrolling,
      decelerationVelocityY: this._decelerationVelocityY,
    });
    if (
      +new Date() - this._lastMeasurement >
      MEASUREMENT_INTERVAL_WHILE_SCROLLING_OR_OFFSCREEN
    ) {
      this.measureClientAndContent();
    }

    // There are times when onScrollComplete is not called. This is due to subtleties
    // In how the hammer recognizer pass events around. This debounced call will ensure
    // scroll thumb is hidden 500ms after the last onScrollChange call
    this.debouncedOnScrollingComplete();
  }

  applyScrollTop({ scrollTop, lastTop, isScrolling, decelerationVelocityY }) {
    let { isAtTop, isAtTopChanged } = getScrolledToTopChanged(
      scrollTop,
      lastTop,
      this.scrollTopOffset
    );

    if (this.contentElement) {
      translate(this.contentElement, 0, -1 * scrollTop);
    }

    this.notifyScrollPosition(
      isScrolling,
      scrollTop,
      isAtTop,
      decelerationVelocityY
    );

    if (this.args.scrollChange && scrollTop !== lastTop) {
      this.args.scrollChange(scrollTop);
    }
    if (this.args.scrolledToTopChange && isAtTopChanged) {
      this.args.scrolledToTopChange(isAtTop);
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
    this.notifyScrollPosition(
      false,
      this._appliedScrollTop,
      this._appliedScrollTop <= this.scrollTopOffset,
      0
    );
    if (DEBUG) {
      this._trackIsScrollingForWaiter(false);
    }
  }

  updateScrollerDimensions() {
    if (this._appliedClientWidth && this._appliedClientHeight) {
      this.scroller.setDimensions(
        this._appliedClientWidth,
        this._appliedClientHeight,
        this._appliedClientWidth,
        this._appliedContentHeight
      );
    }
  }

  bindScrollerEvents(element) {
    this.hammer = new Hammer.Manager(element, {
      inputClass: Hammer.TouchMouseInput,
      recognizers: [
        [ZyngaScrollerVerticalRecognizer, { scrollComponent: this }],
      ],
    });
    this._boundHandleWheel = this.handleWheel.bind(this);
    element.addEventListener(
      normalizeWheel.getEventType(),
      this._boundHandleWheel,
      { passive: false }
    );
  }

  unbindScrollerEvents(element) {
    if (this.hammer) {
      this.hammer.destroy();
      this.hammer = null;
    }
    element?.removeEventListener(
      normalizeWheel.getEventType(),
      this._boundHandleWheel,
      false
    );
  }

  doTouchStart(touches, timeStamp) {
    this._wasScrollingAtTouchStart = this._isScrolling;
    this._touchStartTimeStamp = timeStamp;
    this.scroller.doTouchStart(touches, timeStamp);
  }

  doTouchMove(touches, timeStamp, scale) {
    this.scroller.doTouchMove(touches, timeStamp, scale);
  }

  doTouchEnd(_touches, timeStamp, event) {
    // In most cases, `doTouchStart` is being called before `doTouchEnd`, allowing to set `_touchStartTimeStamp`
    // It is not true when the event occurs on some elements (`input`, `textarea`, or `select`) which can be scrolled.
    // In this case, `ZyngaScrollerVerticalOrganizer` will not call `doTouchStart`
    let touchDuration = this._touchStartTimeStamp
      ? timeStamp - this._touchStartTimeStamp
      : 0;
    let preventClick = this.needsPreventClick(touchDuration);

    if (preventClick) {
      // A touchend event can prevent a follow-on click event by calling preventDefault.
      // On Android, it works well.
      // On iOS, we see a click event being triggered after a touchend event,
      // even when `preventDefault` and `stopPropagation` were called. However, phantom clicks
      // are not triggered consistently. In order to avoid capturing legit click events,
      // we only try to capture phantom clicks if they happen less than 100ms after a touchend event.
      // On desktop browsers, a mouseup event cannot do this so we need to capture the upcoming click instead.

      if (isIPhone || event instanceof MouseEvent) {
        addCaptureClick(this.scrollViewElement);
      }
      event.preventDefault();
      event.stopPropagation();
    }

    this._touchStartTimeStamp = null;
    this.scroller.doTouchEnd(timeStamp);
  }

  needsPreventClick(touchDuration) {
    // There are three cases where we want to prevent the click that normally follows a mouseup/touchend.
    //
    // 1) when the user is just finishing a purposeful scroll (i.e. dragging scroll view beyond a threshold)
    //    This is only true on a desktop.
    // 2) when animating with "momentum", a tap should stop the movement rather than
    //    trigger an interactive element that may be under the tap. Zynga scroller
    //    takes care of stopping the movement, but we need to capture the click
    //    and stop propagation.
    // 3) when the user does a long press (> 500 ms)
    //
    // This method determines whether either of these cases apply.
    let isFinishingDragging = this.scroller.__isDragging;
    let wasAnimatingWithMomentum =
      this._wasScrollingAtTouchStart &&
      Math.abs(this._decelerationVelocityY) > 2;
    let isLongPress = touchDuration > LONG_PRESS_DELAY;
    return isFinishingDragging || wasAnimatingWithMomentum || isLongPress;
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
    if (
      (scrollTop === 0 && candidatePosition < 0) ||
      (scrollTop === maxScrollTop && candidatePosition > maxScrollTop)
    ) {
      return;
    }
    scroller.scrollBy(0, delta, true);
    e.stopPropagation();
  }

  @task
  measurementTask = function* () {
    // Before we check the size for the first time, we capture the intended scroll position
    // and apply it after we determine and apply the size. The reason we need to do this
    // is that attempting to apply the scroll position before the scroller has size results
    // in a scroll position of [0,0].
    let initialScrollTop =
      this.args.initialScrollTop !== undefined
        ? this.args.initialScrollTop
        : this.scrollTopOffset;
    this._shouldMeasureContent = !this.args.contentHeight;
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
    while (true) {
      // eslint-disable-line no-constant-condition
      yield timeout(
        lastIsInViewport
          ? MEASUREMENT_INTERVAL
          : MEASUREMENT_INTERVAL_WHILE_SCROLLING_OR_OFFSCREEN
      );
      lastIsInViewport = this.isInViewport;
      if (lastIsInViewport && !this._isScrolling) {
        this.measureClientAndContent();
      }
    }
  };

  measureClientAndContent() {
    if (!this.scrollViewElement) {
      return;
    }
    this._lastMeasurement = +new Date();
    let { clientWidth, clientHeight, contentHeight } =
      this.getCurrentClientAndContentSizes();

    if (
      !this.hasClientOrContentSizeChanged(
        clientWidth,
        clientHeight,
        contentHeight
      )
    ) {
      return;
    }
    join(
      this,
      this.applyNewMeasurements,
      clientWidth,
      clientHeight,
      contentHeight
    );
  }

  getCurrentClientAndContentSizes() {
    let {
      scrollViewElement: { offsetWidth, offsetHeight },
    } = this;
    let contentHeight = this.args.contentHeight;
    if (this._shouldMeasureContent) {
      contentHeight = this.contentElement.offsetHeight;
    }

    return {
      contentHeight,
      clientHeight: offsetHeight,
      clientWidth: offsetWidth,
    };
  }

  hasClientOrContentSizeChanged(clientWidth, clientHeight, contentHeight) {
    return (
      contentHeight !== this._appliedContentHeight ||
      clientWidth !== this._appliedClientWidth ||
      clientHeight !== this._appliedClientHeight
    );
  }

  applyNewMeasurements(clientWidth, clientHeight, contentHeight) {
    this._appliedClientWidth = clientWidth;
    this._appliedClientHeight = clientHeight;
    this._appliedContentHeight = contentHeight;
    this.contentElement.style.minHeight = `${clientHeight}px`;
    this.updateScrollBarDimensionsTask.perform();
    this.updateScrollerDimensions();
    if (this.args.clientSizeChange) {
      this.args.clientSizeChange(clientWidth, clientHeight);
    }
  }

  @task
  *updateScrollBarDimensionsTask() {
    yield waitForQueue('afterRender');
    this.scrollBarClientHeight = this._appliedClientHeight;
    this.scrollBarContentHeight = this._appliedContentHeight;
  }

  get extraCssClasses() {
    // for overriding by LoadingScrollView
    return null;
  }

  get windowRef() {
    // need a way to reference `window` from hbs
    return window;
  }

  get scrollTopOffset() {
    return this.args.scrollTopOffset || 0;
  }

  get isInViewport() {
    if (!this.scrollViewElement) {
      return false;
    }
    let rect = this.scrollViewElement.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  scrollTo(yPos, animated = false) {
    if (this.scrollViewElement) {
      this.measureClientAndContent();
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
    return this.scrollTo(
      this._appliedContentHeight - this._appliedClientHeight,
      true
    );
  }

  scrollToElement(el, animated = false) {
    this.measureClientAndContent();
    if (this.scrollViewElement) {
      let yPos = this._yOffset(el);
      return this.scroller.scrollTo(0, yPos, animated);
    } else {
      return console.warn('scrollToElement called before scrollView is inDOM'); // eslint-disable-line
    }
  }

  _yOffset(el) {
    let top = el.offsetTop;
    while (el !== this.scrollViewElement && (el = el.offsetParent)) {
      top += el.offsetTop;
    }
    return top;
  }

  getViewHeight() {}

  remember(key) {
    if (key) {
      let position = this._appliedScrollTop;
      this.memory[key] = position;
    }
  }

  restore(key) {
    let position =
      this.args.initialScrollTop || this.memory[key] || this.scrollTopOffset;
    if (this.scrollViewElement) {
      this.scrollTo(position);
    } else {
      schedule('afterRender', this, this.scrollTo, position);
    }
  }

  @cached
  get scrollViewApi() {
    return new ScrollViewApi({
      _scrollComponent: this,
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

  _waiterToken;
  _trackIsScrollingForWaiter(isScrolling) {
    if (isScrolling && !this._waiterToken) {
      this._waiterToken = waiter.beginAsync();
    } else if (!isScrolling && this._waiterToken) {
      waiter.endAsync(this._waiterToken);
      this._waiterToken = undefined;
    }
    this._lastIsScrolling = isScrolling;
  }

  _isScrollingForWaiter() {
    return !this._lastIsScrolling;
  }
}

export default ScrollView;
