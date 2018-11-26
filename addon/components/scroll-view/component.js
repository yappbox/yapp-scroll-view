/* global Ember, Scroller */
import Component from '@ember/component';
import { classNames, layout } from '@ember-decorators/component';
import template from './template';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { argument } from '@ember-decorators/argument';
import { optional, type } from '@ember-decorators/argument/type';
import { ClosureAction } from '@ember-decorators/argument/types';
import normalizeWheel from 'yapp-scroll-view/utils/normalize-wheel';
import Hammer from 'hammerjs';
import ZyngaScrollerVerticalRecognizer from 'yapp-scroll-view/utils/zynga-scroller-vertical-recognizer'
import { join, schedule } from '@ember/runloop';
import { translate } from 'ember-collection/utils/translate';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import ScrollViewApi from '../../utils/scroll-view-api';

const FIELD_REGEXP = /input|textarea|select/i;
const MEASUREMENT_INTERVAL = 250;

function getScrolledToTopChanged(currentTop, lastTop, offset) {
  if (currentTop <= offset && (lastTop > offset || lastTop === undefined) ) {
    return true;
  } else if (currentTop > offset && (lastTop <= offset || lastTop === undefined) ) {
    return false;
  }
}

@layout(template)
@classNames('ScrollView')
export default class ScrollView extends Component {
  @argument @type(optional('number')) contentHeight; // optional, when not provided, we measure the size
  @argument @type(optional('string')) key;
  @argument @type(optional('number')) scrollTopOffset = 0; // optional, when provided, we treat "isAtTop" as anywhere before this offset
  @argument @type(optional('number')) initialScrollTop;
  @argument @type(optional(ClosureAction)) scrollChange;
  @argument @type(optional(ClosureAction)) clientSizeChange;
  @argument @type(optional(ClosureAction)) scrolledToTopChange;

  _scrollTop = 0;
  _isAtTop;
  _needsContentSizeUpdate = true;
  _appliedContentSize = {};
  _clientHeight;
  _contentHeight;
  _appliedScrollTop;
  _shouldMeasureContent = false;
  _isScrolling = false;

  @service('scroll-position-memory')
  memory;

  constructor() {
    super(...arguments);
    if (!this.contentHeight) {
      this._shouldMeasureContent = true;
    }
  }

  didReceiveAttrs() {
    this.set('_scrollTop', this.scrollTop);
    if (!this._shouldMeasureContent && (this._contentHeight !== this.contentHeight)) {
      this.measureClientAndContent();
    }
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.contentElement = this.element.firstElementChild;
    this.setupScroller();
    this.measurementTask.perform();
    this.bindScrollerEvents();
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
    this.remember(this.key);
    if (Ember.testing) {
      window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP = null;
    }
  }

  setupScroller(){
    this.scroller = new Scroller((left, top/*, zoom*/) => {
      let { scroller } = this;
      join(this, this.onScrollChange, left|0, top|0, {
        decelerationVelocityY: scroller.__decelerationVelocityY,
        isDragging: scroller.__isDragging,
        isDecelerating: scroller.__isDecelerating,
        isAnimating: scroller.__isAnimating
      });
    }, {
      scrollingX: false,
      scrollingComplete: () => {
        if (this.isDestroyed || this.isDestroying) {
          return;
        }
        if (this.scrollingComplete) {
          this.scrollingComplete();
        }
        this.set('_isScrolling', false);
      }
    });
  }

  onScrollChange(scrollLeft, scrollTop, params) {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    if (this._appliedScrollTop === scrollTop) {
      return;
    }
    let lastTop = this._appliedScrollTop;
    this._appliedScrollTop = scrollTop;
    if (this.contentElement) {
      translate(this.contentElement, 0, -1 * scrollTop);
    }
    this.setProperties({
      _scrollTop: scrollTop,
      _isScrolling: !!(params.isDragging || params.isDecelerating || params.isAnimating)
    });
    this._decelerationVelocityY = params.decelerationVelocityY;
    if (this.scrollChange) {
      this.scrollChange(scrollTop);
    }
    if (this.scrolledToTopChange) {
      let isAtTop = getScrolledToTopChanged(scrollTop, lastTop, this.scrollTopOffset);
      if (isAtTop !== undefined) {
        this.scrolledToTopChange(isAtTop)
      }
    }
  }

  updateScrollerDimensions() {
    if (this._clientWidth && this._clientHeight) {
      this.scroller.setDimensions(this._clientWidth, this._clientHeight, this._clientWidth, this._contentHeight);
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
    this.hammer.destroy();
    this.element.removeEventListener(
      normalizeWheel.getEventType(),
      this._boundHandleWheel,
      false
    );
  }

  doTouchStart(touches, timeStamp) {
    this.scroller.doTouchStart(touches, timeStamp)
  }

  doTouchMove(touches, timeStamp, scale) {
    this.scroller.doTouchMove(touches, timeStamp, scale)
  }

  doTouchEnd(touches, timeStamp) {
    this.scroller.doTouchEnd(timeStamp);
    if (this.needsCaptureClick()) {
      this.setupCaptureClickTask.perform();
    }
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
    if (Math.abs(this._decelerationVelocityY) > 2) {
      return true;
    }
    return false;
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
    if (Ember.testing) {
      window.SIMULATE_SCROLL_VIEW_MEASUREMENT_LOOP = () => {
        this.measureClientAndContent();
      };
      return;
    }

    while(true) { // eslint-disable-line no-constant-condition
      yield timeout(MEASUREMENT_INTERVAL);
      this.measureClientAndContent();
    }
  }

  measureClientAndContent() {
    let { element } = this;
    if (!element) {
      return;
    }
    let clientWidth = element.offsetWidth;
    let clientHeight = element.offsetHeight;
    let { contentHeight } = this;
    if (this._shouldMeasureContent) {
      contentHeight = this.contentElement.offsetHeight;
    }
    if (clientWidth === this._clientWidth && clientHeight === this._clientHeight && contentHeight === this._contentHeight) {
      return;
    }
    this._clientWidth = clientWidth;
    this._clientHeight = clientHeight;
    this.set('_contentHeight', contentHeight);
    join(() => {
      this.contentElement.style.minHeight = `${clientHeight}px`;
      this.updateScrollerDimensions();
      if (this.clientSizeChange) {
        this.clientSizeChange(clientWidth, clientHeight);
      }
    });
  }

  @computed
  get windowRef() {
    return window;
  }

  get isInViewport() {
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
    return this.scrollTo(this._contentHeight - this._clientHeight, true);
  }

  scrollToElement(el, animated=false) {
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
      let position = this._scrollTop;
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
}
