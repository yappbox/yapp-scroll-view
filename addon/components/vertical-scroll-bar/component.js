import Component from '@ember/component';
import { classNames, layout } from '@ember-decorators/component';
import template from './template';
// import { argument } from '@ember-decorators/argument';
// import { assert } from '@ember/debug';
// import { Action, optional } from '@ember-decorators/argument/types';

const MIN_THUMB_LENGTH = 15;

export default
@layout(template)
@classNames('VerticalScrollBar')
class VerticalScrollBar extends Component {
  // @argument(optional('number'))
  // contentHeight;
  //
  // @argument(optional('number'))
  // scrollerHeight;
  //
  // @argument(Action)
  // registerWithScrollView;

  _isScrolling = false;
  _scrollTop = 0;

  init() {
    super.init(...arguments);
    this.trackHeight = this.clientHeight;
  }

  didInsertElement() {
    this._super(...arguments);

    this.thumb = this.element.querySelector('[data-thumb]');
    this.trackHeight = this.element.offsetHeight;
    this.updateThumbStyle();
    this.registerWithScrollView(this.updateScrollingParameters.bind(this));
  }

  didReceiveAttrs() {
    this._super(...arguments);
    if (this._lastScrollerHeight !== this.scrollerHeight) {
      if (this.element) {
        this.trackHeight = this.element.offsetHeight;
        this.updateThumbStyle();
      }
      this._lastScrollerHeight = this.scrollerHeight;
    }
  }

  updateScrollingParameters(isScrolling, scrollTop) {
    this._scrollTop = scrollTop;
    this._isScrolling = isScrolling;

    this.updateThumbStyle();
  }

  updateThumbStyle() {
    let { scrollerHeight, trackHeight, contentRatio, scrollTopRatio, _isScrolling } = this;
    if (!scrollerHeight) {
      return;
    }
    if (!_isScrolling) {
      this.thumb.style.opacity = '0';
      return;
    }

    let thumbHeight = contentRatio * trackHeight;
    let trackAreaScrollSize = trackHeight - thumbHeight;
    let thumbY = scrollTopRatio * trackAreaScrollSize;
    let isAtMax = thumbY + thumbHeight >= trackHeight;
    thumbHeight = Math.max(MIN_THUMB_LENGTH, thumbHeight);

    if (isAtMax) {
      thumbY = trackHeight - thumbHeight;
    }

    if (thumbY < 0) {
      thumbY = 0;
    }

    Object.assign(this.thumb.style, {
      opacity: '1',
      height: `${thumbHeight}px`,
      transform: `translateY(${thumbY}px)`
    });
  }

  get contentRatio() {
    let ratioBeforeOverscrollAdjustment = this.scrollerHeight / this.effectiveContentHeight;
    return this.scrollerHeight / (this.effectiveContentHeight + (this.overscrollAmount * (1/ratioBeforeOverscrollAdjustment)));
  }

  get effectiveContentHeight() {
    return Math.max(this.scrollerHeight + 1, this.contentHeight);
  }

  get scrollTopRatio() {
    return this._scrollTop / this.scrollAreaSize;
  }

  get overscrollAmount() {
    let scrollTop = this._scrollTop;

    if (scrollTop < 0) {
      return -scrollTop;
    } else if (scrollTop > this.scrollAreaSize) {
      return scrollTop - this.scrollAreaSize;
    }
    return 0;
  }

  get scrollAreaSize() {
    return this.effectiveContentHeight - this.scrollerHeight;
  }
}
