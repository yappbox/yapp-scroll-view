/* global Ember, Scroller */
import Component from '@ember/component';
import { classNames, layout } from '@ember-decorators/component';
import template from './template';
import { computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
// import { optional, type } from '@ember-decorators/argument/type';
// import { ClosureAction } from '@ember-decorators/argument/types';
import normalizeWheel from 'yapp-scroll-view/utils/normalize-wheel';
import Hammer from 'hammerjs';
import ZyngaScrollerVerticalRecognizer from 'yapp-scroll-view/utils/zynga-scroller-vertical-recognizer'
import { join } from '@ember/runloop';
import { translate } from 'ember-collection/utils/translate';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import ScrollViewApi from '../../utils/scroll-view-api';

const FIELD_REGEXP = /input|textarea|select/i;
const MEASUREMENT_INTERVAL = 250;

function setupCaptureClick(component) {
  let { element } = component;
  function captureClick(e) {
    e.stopPropagation(); // Stop the click from being propagated.
    element.removeEventListener('click', captureClick, true); // cleanup
  }
  element.addEventListener('click', captureClick, true);
  setTimeout(function(){
    element.removeEventListener('click', captureClick, true);
  }, 0);
}

@layout(template)
@classNames('ScrollView')
export default class ScrollView extends Component {
  @argument contentHeight; // optional, when not provided, we measure the size

  _scrollTop = 0;
  _needsContentSizeUpdate = true;
  _appliedContentSize = {};
  _clientHeight;
  _contentHeight;
  _appliedScrollTop;
  _shouldMeasureContent = false;
  _isTouching = false;

  constructor() {
    super(...arguments);
    if (!this.contentHeight) {
      this._shouldMeasureContent = true;
    }
  }

  didReceiveAttrs() {
    this._scrollTop = this.scrollTop;
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.contentElement = this.element.firstElementChild;
    this.setupScroller();
    this.measurementTask.perform();
    this.bindScrollerEvents();
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    this.unbindScrollerEvents();
  }

  setupScroller(){
    this.scroller = new Scroller((left, top/*, zoom*/) => {
      let { scroller } = this;
      join(this, this.onScrollChange, left|0, top|0, {
        decelerationVelocityX: scroller.__decelerationVelocityX,
        decelerationVelocityY: scroller.__decelerationVelocityY
      });
    }, {
      scrollingX: false,
      scrollingComplete: () => {
        if (this.scrollingComplete) {
          this.scrollingComplete();
        }
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
    this._appliedScrollTop = scrollTop;
    if (this.contentElement) {
      translate(this.contentElement, 0, -1 * scrollTop);
    }
    this.set('_scrollTop', scrollTop);
    this._decelerationVelocityY = params.decelerationVelocityY;
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
    this.set('_isTouching', true);
    this.scroller.doTouchStart(touches, timeStamp)
  }

  doTouchMove(touches, timeStamp, scale) {
    this.scroller.doTouchMove(touches, timeStamp, scale)
  }

  doTouchEnd(touches, timeStamp) {
    this.set('_isTouching', false);
    this.scroller.doTouchEnd(timeStamp);
    if (this.needsCaptureClick()) {
      setupCaptureClick(this);
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
    let scroller = this.scroller;
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
    let initialScrollTop = this._initialScrollTop;
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

    while(true) {
      yield timeout(MEASUREMENT_INTERVAL);
      this.measureClientAndContent();
    }
  }

  measureClientAndContent() {
    let element = this.element;
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
    });
  }

  scrollTo(yPos, animated=false) {
    if (this.element) {
      return this.scroller.scrollTo(0, yPos, animated);
    }
  }

  scrollToTop() {
    return this.scrollTo(0, true);
  }

  scrollToBottom() {
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

  @computed
  get scrollViewApi() {
    return ScrollViewApi.create({
      _scrollComponent: this
    });
  }
}
