import Component from '@ember/component';
import { classNames, layout } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
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
  @argument @type(ClosureAction) registerWithScrollView;

  init() {
    super.init(...arguments);
    // Default viewportHeight to something close to resonable
    this.set('viewportHeight', this.contentHeight);
  }

  didInsertElement(){
    this._super(...arguments);
    assert("vertical-scroll-bar has zero height (missing CSS?)", this.element.offsetHeight !== 0);
    this.set('viewportHeight', this.element.offsetHeight);
    this.registerWithScrollView(this.updateScrollingParamerters.bind(this));

    this.thumb = this.element.querySelector('[data-thumb]');
  }

  @computed('contentHeight', 'viewportHeight')
  get contentRatio() {
    return Math.min(1, this.viewportHeight / this.contentHeight);
  }

  updateScrollingParamerters(isScrolling, scrollTop) {
    this._scrollTop = scrollTop;
    this._isScrolling = isScrolling;
    this.updateThumbStyle();
  }

  updateThumbStyle() {
    let { viewportHeight, contentRatio, scrollTopRatio, _isScrolling, compressionFactor } = this;
    if (!viewportHeight) {
      return;
    }
    let thumbHeight = Math.max(MIN_THUMB_LENGTH, contentRatio * viewportHeight * compressionFactor);
    let maxThumbY = viewportHeight - thumbHeight;
    let thumbY = scrollTopRatio * viewportHeight;
    thumbY = Math.min(maxThumbY, Math.max(0, thumbY));
    if (this.scrollTopRatio < 0) {
      thumbY = 0;
    } else if (this.contentRatio > 0.9) {
      thumbY = maxThumbY;
    }

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
    if ((this.scrollTopRatio + this.contentRatio) > 1) {
      return 1 - (((this.scrollTopRatio + this.contentRatio) - 1) * COMPRESSION_MULTIPLIER);
    }
    return 1;
  }

  get scrollTopRatio() {
    return this._scrollTop / this.contentHeight;
  }
}
