import Component from '@glimmer/component';
const MIN_THUMB_LENGTH = 15;
import { action } from '@ember/object';

export default class VerticalScrollBar extends Component {
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

  constructor() {
    super(...arguments);
    this.trackHeight = this.clientHeight;
  }

  @action
  didInsert(element) {
    this.thumb = element.querySelector('[data-thumb]');
    this.trackHeight = element.offsetHeight;
    this.updateThumbStyle();
    this.args.registerWithScrollView(this.updateScrollingParameters.bind(this));
  }

  @action
  didUpdateScrollerHeight(element) {
    if (this._lastScrollerHeight !== this.args.scrollerHeight) {
      if (element) {
        this.trackHeight = element.offsetHeight;
        this.updateThumbStyle();
      }
      this._lastScrollerHeight = this.args.scrollerHeight;
    }
  }

  updateScrollingParameters(isScrolling, scrollTop) {
    this._scrollTop = scrollTop;
    this._isScrolling = isScrolling;

    this.updateThumbStyle();
  }

  updateThumbStyle() {
    let { scrollerHeight } = this.args;
    if (!scrollerHeight) {
      return;
    }
    let { trackHeight, contentRatio, scrollTopRatio, _isScrolling } = this;
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
      transform: `translateY(${thumbY}px)`,
    });
  }

  get contentRatio() {
    let ratioBeforeOverscrollAdjustment =
      this.args.scrollerHeight / this.effectiveContentHeight;
    return (
      this.args.scrollerHeight /
      (this.effectiveContentHeight +
        this.overscrollAmount * (1 / ratioBeforeOverscrollAdjustment))
    );
  }

  get effectiveContentHeight() {
    return Math.max(this.args.scrollerHeight + 1, this.args.contentHeight);
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
    return this.effectiveContentHeight - this.args.scrollerHeight;
  }
}
