import Component from '@glimmer/component';
import { tracked, cached } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { join, schedule } from '@ember/runloop';
import { task, timeout, waitForQueue } from 'ember-concurrency';
import ScrollViewApi from 'yapp-scroll-view/utils/scroll-view-api';
import { DEBUG } from '@glimmer/env';
import { buildWaiter } from '@ember/test-waiters';
import { isTesting } from '@embroider/macros';

let waiter = buildWaiter('yapp-scroll-view:scrolling');
let measurementWaiter = buildWaiter('yapp-scroll-view:measurement');

const MEASUREMENT_INTERVAL = 250;
const MEASUREMENT_INTERVAL_WHILE_SCROLLING_OR_OFFSCREEN = 1000;
const SCROLL_IDLE_DELAY = 150;
const FIELD_REGEXP = /input|textarea|select/i;

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

function now() {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }
  return Date.now();
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

  _appliedClientWidth;
  _appliedClientHeight;
  _appliedContentHeight;
  @tracked scrollBarClientHeight;
  @tracked scrollBarContentHeight;
  _appliedScrollTop = 0;
  _shouldMeasureContent = undefined;
  _isScrolling = false;
  _lastIsScrolling = false;
  _lastScrollEventAt = 0;
  _lastScrollTop = 0;
  _scrollEndTimer = null;
  _ignoreScrollBecauseOfField = false;
  _usingPointerEvents = false;
  _measurementWaiterToken = null;

  @service('scroll-position-memory')
  memory;

  constructor() {
    super(...arguments);
    this._scrollPositionCallbacks = [];
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
    this.wrapperElement = element;
    let scrollViewElement =
      element.querySelector('.ScrollView-scroller') ||
      element.querySelector('[data-test-scroll-container]') ||
      element;
    this.scrollViewElement = scrollViewElement;
    this.contentElement =
      scrollViewElement.querySelector('.ScrollView-content') ||
      scrollViewElement.firstElementChild ||
      scrollViewElement;
    this._appliedScrollTop = scrollViewElement.scrollTop || 0;
    scrollViewElement.addEventListener('scroll', this.handleNativeScroll, {
      passive: true,
    });
    this.addInteractionEventListeners(scrollViewElement);
    this.measurementTask.perform();
    this.onKeyUpdated();
    this.applyScrollTop({
      scrollTop: this._appliedScrollTop,
      lastTop: undefined,
      isScrolling: false,
      velocityY: 0,
    });
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
    this.cancelScrollEndTimer();
    this.removeInteractionEventListeners(this.scrollViewElement);
    this.scrollViewElement?.removeEventListener(
      'scroll',
      this.handleNativeScroll,
      false,
    );
    this.scrollViewElement = null;
    this.wrapperElement = null;
    this._scrollPositionCallbacks = [];
    this.remember(this._lastKey);
    if (DEBUG) {
      if (isTesting()) {
        window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP = null;
      }
      this._trackIsScrollingForWaiter(false);
    }
    super.willDestroy(...arguments);
  }

  @action
  handleNativeScroll(event) {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    let { target } = event;
    if (this._ignoreScrollBecauseOfField) {
      if (target.scrollTop !== this._appliedScrollTop) {
        target.scrollTop = this._appliedScrollTop;
      }
      return;
    }
    let scrollTop = target.scrollTop;
    let instant = now();
    let deltaTime = this._lastScrollEventAt
      ? Math.max(instant - this._lastScrollEventAt, 1)
      : 1;
    let velocityY = ((scrollTop - this._lastScrollTop) / deltaTime) * 1000;

    this._isScrolling = true;
    this._lastScrollEventAt = instant;
    this._lastScrollTop = scrollTop;

    this.applyScrollTop({
      scrollTop,
      lastTop: this._appliedScrollTop,
      isScrolling: true,
      velocityY,
    });

    this.scheduleScrollEndNotification();
  }

  addInteractionEventListeners(element) {
    if (!element || typeof window === 'undefined') {
      return;
    }
    this._usingPointerEvents = 'PointerEvent' in window;
    if (this._usingPointerEvents) {
      element.addEventListener('pointerdown', this.handlePointerDown, true);
      element.addEventListener('pointerup', this.handlePointerUp, true);
      element.addEventListener('pointercancel', this.handlePointerUp, true);
    } else {
      element.addEventListener('touchstart', this.handlePointerDown, true);
      element.addEventListener('touchend', this.handlePointerUp, true);
      element.addEventListener('touchcancel', this.handlePointerUp, true);
      element.addEventListener('mousedown', this.handlePointerDown, true);
      element.addEventListener('mouseup', this.handlePointerUp, true);
    }
  }

  removeInteractionEventListeners(element) {
    if (!element) {
      return;
    }
    if (this._usingPointerEvents) {
      element.removeEventListener('pointerdown', this.handlePointerDown, true);
      element.removeEventListener('pointerup', this.handlePointerUp, true);
      element.removeEventListener('pointercancel', this.handlePointerUp, true);
    } else {
      element.removeEventListener('touchstart', this.handlePointerDown, true);
      element.removeEventListener('touchend', this.handlePointerUp, true);
      element.removeEventListener('touchcancel', this.handlePointerUp, true);
      element.removeEventListener('mousedown', this.handlePointerDown, true);
      element.removeEventListener('mouseup', this.handlePointerUp, true);
    }
  }

  @action
  handlePointerDown(event) {
    let field = event.target?.closest
      ? event.target.closest('input, textarea, select')
      : null;
    if (field && FIELD_REGEXP.test(field.tagName)) {
      this._ignoreScrollBecauseOfField = true;
    }
  }

  @action
  handlePointerUp() {
    this._ignoreScrollBecauseOfField = false;
  }

  scheduleScrollEndNotification() {
    this.cancelScrollEndTimer();
    this._scrollEndTimer = window.setTimeout(
      () => this.onScrollingComplete(),
      SCROLL_IDLE_DELAY,
    );
  }

  cancelScrollEndTimer() {
    if (this._scrollEndTimer) {
      window.clearTimeout(this._scrollEndTimer);
      this._scrollEndTimer = null;
    }
  }

  applyScrollTop({ scrollTop, lastTop, isScrolling, velocityY }) {
    let { isAtTop, isAtTopChanged } = getScrolledToTopChanged(
      scrollTop,
      lastTop,
      this.scrollTopOffset,
    );

    this.notifyScrollPosition(isScrolling, scrollTop, isAtTop, velocityY);

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
    this.cancelScrollEndTimer();
    this._isScrolling = false;
    let scrollTop = this.scrollViewElement
      ? this.scrollViewElement.scrollTop
      : this._appliedScrollTop;

    this.applyScrollTop({
      scrollTop,
      lastTop: this._appliedScrollTop,
      isScrolling: false,
      velocityY: 0,
    });
  }

  measurementTask = task(async () => {
    let initialScrollTop =
      this.args.initialScrollTop !== undefined
        ? this.args.initialScrollTop
        : this.scrollTopOffset;
    this._shouldMeasureContent = !this.args.contentHeight;
    this.measureClientAndContent();
    this._initialSizeCheckCompleted = true;
    if (initialScrollTop) {
      this.scrollTo(initialScrollTop, false);
    }
    if (DEBUG && isTesting()) {
      window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP = () => {
        this.measureClientAndContent();
      };
      return;
    }
    let lastIsInViewport = true;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await timeout(
        lastIsInViewport
          ? MEASUREMENT_INTERVAL
          : MEASUREMENT_INTERVAL_WHILE_SCROLLING_OR_OFFSCREEN,
      );
      lastIsInViewport = this.isInViewport;
      if (lastIsInViewport && !this._isScrolling) {
        this.measureClientAndContent();
      }
    }
  });

  measureClientAndContent() {
    this._beginMeasurementWaiter();
    try {
      if (!this.scrollViewElement) {
        return;
      }
      this._lastMeasurement = now();
      let { clientWidth, clientHeight, contentHeight } =
        this.getCurrentClientAndContentSizes();

      if (
        !this.hasClientOrContentSizeChanged(
          clientWidth,
          clientHeight,
          contentHeight,
        )
      ) {
        return;
      }
      join(
        this,
        this.applyNewMeasurements,
        clientWidth,
        clientHeight,
        contentHeight,
      );
    } finally {
      this._endMeasurementWaiter();
    }
  }

  getCurrentClientAndContentSizes() {
    let { scrollViewElement } = this;
    let { offsetWidth, offsetHeight, scrollHeight } = scrollViewElement;
    let contentHeight = this.args.contentHeight;
    if (this._shouldMeasureContent) {
      let measuredContentHeight =
        this.contentElement?.scrollHeight ??
        this.contentElement?.offsetHeight ??
        0;
      contentHeight = measuredContentHeight || scrollHeight;
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
    if (this.contentElement) {
      if (this.contentElement === this.scrollViewElement) {
        this.contentElement.style.minHeight = `${clientHeight}px`;
      } else {
        this.contentElement.style.minHeight = '';
      }
    }
    this.updateScrollBarDimensionsTask.perform();
    if (this.args.clientSizeChange) {
      this.args.clientSizeChange(clientWidth, clientHeight);
    }
  }

  updateScrollBarDimensionsTask = task(async () => {
    await waitForQueue('afterRender');
    this.scrollBarClientHeight = this._appliedClientHeight;
    this.scrollBarContentHeight = this._appliedContentHeight;
  });

  get windowRef() {
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
    let viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    let viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= viewportHeight &&
      rect.right <= viewportWidth
    );
  }

  scrollTo(yPos, animated = false) {
    if (!this.scrollViewElement) {
      schedule('afterRender', this, this.scrollTo, yPos, animated);
      return;
    }
    this.measureClientAndContent();
    if (animated && typeof this.scrollViewElement.scrollTo === 'function') {
      try {
        this.scrollViewElement.scrollTo({
          top: yPos,
          behavior: 'smooth',
        });
        return;
      } catch (e) {
        // fall through to direct assignment
      }
    }
    this.scrollViewElement.scrollTop = yPos;
  }

  scrollToTop() {
    this.scrollTo(0, true);
  }

  scrollToTopIfInViewport() {
    if (this.isInViewport) {
      this.scrollToTop();
    }
  }

  scrollToBottom() {
    let contentHeight =
      this._appliedContentHeight ?? this.scrollViewElement?.scrollHeight ?? 0;
    let clientHeight =
      this._appliedClientHeight ?? this.scrollViewElement?.clientHeight ?? 0;
    this.scrollTo(Math.max(0, contentHeight - clientHeight), true);
  }

  scrollToElement(el, animated = false) {
    this.measureClientAndContent();
    if (this.scrollViewElement && el) {
      let yPos = this._yOffset(el);
      this.scrollTo(yPos, animated);
    } else {
      // eslint-disable-next-line no-console
      console.warn('scrollToElement called before scrollView is inDOM');
    }
  }

  _yOffset(el) {
    let top = el.offsetTop;
    while (el !== this.scrollViewElement && (el = el.offsetParent)) {
      top += el.offsetTop;
    }
    return top;
  }

  getViewHeight() {
    return (
      this._appliedClientHeight ?? this.scrollViewElement?.clientHeight ?? 0
    );
  }

  get extraCssClasses() {
    return this._isScrolling ? 'isScrolling' : '';
  }

  remember(key) {
    if (key) {
      this.memory[key] = this._appliedScrollTop || 0;
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

  _beginMeasurementWaiter() {
    if (!this._measurementWaiterToken) {
      this._measurementWaiterToken = measurementWaiter.beginAsync();
    }
  }

  _endMeasurementWaiter() {
    if (this._measurementWaiterToken) {
      measurementWaiter.endAsync(this._measurementWaiterToken);
      this._measurementWaiterToken = null;
    }
  }
}

export default ScrollView;
