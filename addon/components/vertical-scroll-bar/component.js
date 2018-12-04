import Component from '@ember/component';
import { classNames, layout } from '@ember-decorators/component';
import template from './template';
import { argument } from '@ember-decorators/argument';
import { assert } from '@ember/debug';
import { optional, type } from '@ember-decorators/argument/type';
import { ClosureAction } from '@ember-decorators/argument/types';

const MIN_THUMB_LENGTH = 15;
const COMPRESSION_MULTIPLIER = 3.1416;

@layout(template)
@classNames('VerticalScrollBar')
export default class VerticalScrollBar extends Component {
  @argument @type(optional('number')) contentHeight;
  @argument @type(optional('number')) scrollerHeight;
  @argument @type(ClosureAction) registerWithScrollView;

  _isScrolling = false;
  _scrollTop = 0;

  init() {
    super.init(...arguments);
    this.trackHeight = this.clientHeight;
  }

  didInsertElement(){
    this._super(...arguments);
    assert("vertical-scroll-bar has zero height (missing CSS?)", this.element.offsetHeight !== 0);
    this.trackHeight = this.element.offsetHeight;

    this.thumb = this.element.querySelector('[data-thumb]');
    this.updateThumbStyle();

    this.registerWithScrollView(this.updateScrollingParameters.bind(this));
  }

  updateScrollingParameters(isScrolling, scrollTop) {
    this._scrollTop = scrollTop;
    this._isScrolling = isScrolling;
    this.updateThumbStyle();
  }

  updateThumbStyle() {
    let { scrollerHeight, trackHeight, contentRatio, scrollTopRatio, _isScrolling, compressionFactor } = this;
    if (!scrollerHeight) {
      return;
    }
    let thumbHeight = contentRatio * trackHeight;

    let trackAreaScrollSize = trackHeight - thumbHeight
    // let maxThumbY = trackHeight - thumbHeight;
    let thumbY = scrollTopRatio * trackAreaScrollSize;
    let isAtMax = thumbY + thumbHeight >= trackHeight;
    // thumbHeight = Math.max(MIN_THUMB_LENGTH, thumbHeight * compressionFactor);
    thumbHeight = Math.max(MIN_THUMB_LENGTH, thumbHeight);
    if (isAtMax) {
      thumbY = trackHeight - thumbHeight;
    }
    if (thumbY < 0) {
      thumbY = 0;
    }
    // console.log({ _scrollTop: this._scrollTop, contentRatio, scrollTopRatio, compressionFactor });
    // thumbY = Math.min(maxThumbY, Math.max(0, thumbY));
    // if (this.scrollTopRatio < 0) {
    //   thumbY = 0;
    // } else if (this.contentRatio > 0.9) {
    //   thumbY = maxThumbY;
    // }
    // console.log({ thumbHeight, thumbY, trackHeight })
    let styleParts = {
      opacity: _isScrolling ? '1' : '0',
      height: `${thumbHeight}px`,
      transform: `translateY(${thumbY}px)`
    };
    Object.assign(this.thumb.style, styleParts);
  }

  get compressionFactor() {
    // when overscrolled, the thumb compresses
    if (this.scrollTopRatio < 0) {
      return (1 + (this.scrollTopRatio * COMPRESSION_MULTIPLIER));
    }
    if ((this.scrollTopRatio) > 1) {
      return 1 - ((this.scrollTopRatio - 1) * COMPRESSION_MULTIPLIER);
    }
    return 1;
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
    let size = this.effectiveContentHeight - this.scrollerHeight;
    // if (this._scrollTop < 0) {
    //   size = size + this._scrollTop;
    // } else if (this._scrollTop > this.contentHeight) {
    //   size = size - (this._scrollTop - this.contentHeight);
    // }
    return size;
  }
}
