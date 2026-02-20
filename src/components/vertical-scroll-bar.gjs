import Component from '@glimmer/component';
import { action } from '@ember/object';
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import didUpdate from "@ember/render-modifiers/modifiers/did-update";
const MIN_THUMB_LENGTH = 15;


export default class VerticalScrollBar extends Component {<template><div class="VerticalScrollBar" ...attributes {{didInsert this.didInsert}} {{didUpdate this.didUpdateScrollerHeight @scrollerHeight}}>
  <div class="VerticalScrollBar-thumb" data-test-thumb data-thumb></div>
</div>
</template>
  _isScrolling = false;
  _scrollTop = 0;

  constructor() {
    super(...arguments);
    this.trackHeight = 0;
    this.trackElement = null;
  }

  @action
  didInsert(element) {
    this.trackElement = element;
    this.thumb = element.querySelector('[data-thumb]');
    this.updateTrackHeight();
    this.updateThumbStyle();
    this.args.registerWithScrollView(this.updateScrollingParameters.bind(this));
  }

  @action
  didUpdateScrollerHeight(element) {
    if (this._lastScrollerHeight !== this.args.scrollerHeight) {
      if (element) {
        this.trackElement = element;
        this.updateTrackHeight();
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
    if (!scrollerHeight || !this.thumb) {
      return;
    }
    let trackHeight = this.updateTrackHeight();
    if (!trackHeight) {
      return;
    }
    let { contentRatio, scrollTopRatio, _isScrolling } = this;
    if (!_isScrolling) {
      this.thumb.style.opacity = '0';
      return;
    }

    let rawThumbHeight = contentRatio * trackHeight;
    let thumbHeight = Math.max(MIN_THUMB_LENGTH, rawThumbHeight);
    let trackAreaScrollSize = Math.max(0, trackHeight - thumbHeight);
    let thumbY = scrollTopRatio * trackAreaScrollSize;
    let isAtMax = thumbY + thumbHeight >= trackHeight;

    if (isAtMax) {
      thumbY = trackHeight - thumbHeight;
    }

    if (thumbY < 0) {
      thumbY = 0;
    }

    Object.assign(this.thumb.style, {
      opacity: '1',
      height: `${thumbHeight}px`,
      boxSizing: 'border-box',
      transform: `translateY(${thumbY}px)`,
    });
  }

  updateTrackHeight() {
    if (!this.trackElement) {
      return this.trackHeight;
    }
    this.trackHeight = Math.max(0, this.trackElement.offsetHeight);
    return this.trackHeight;
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
