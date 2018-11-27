import Component from '@ember/component';
import { classNames, layout } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import template from './template';
import { argument } from '@ember-decorators/argument';
import { htmlSafe } from '@ember/string';
import { assert } from '@ember/debug';
import { optional, type } from '@ember-decorators/argument/type';

const MIN_THUMB_LENGTH = 15;

@layout(template)
@classNames('VerticalScrollBar')
export default class VerticalScrollBar extends Component {
  @argument @type(optional('number')) contentHeight;
  @argument @type(optional('number')) scrollTop;
  @argument @type('boolean') isScrolling;

  constructor() {
    super(...arguments);
    this.set('viewportHeight', this.contentHeight);
  }

  didInsertElement(){
    this._super(...arguments);
    assert("vertical-scroll-bar has zero height (missing CSS?)", this.element.offsetHeight !== 0);
    this.set('viewportHeight', this.element.offsetHeight);
  }

  @computed('contentHeight', 'viewportHeight')
  get contentRatio() {
    return Math.min(1, this.viewportHeight / this.contentHeight);
  }

  @computed('contentRatio', 'scrollTopRatio', 'viewportHeight', 'isScrolling', 'compressionFactor')
  get thumbStyle() {
    let { viewportHeight, contentRatio, scrollTopRatio, isScrolling, compressionFactor } = this;
    if (!viewportHeight) {
      return;
    }
    let thumbHeight = Math.max(MIN_THUMB_LENGTH, contentRatio * viewportHeight * compressionFactor);
    let maxThumbY = viewportHeight - thumbHeight;
    let thumbY = Math.min(maxThumbY, Math.max(0, scrollTopRatio * viewportHeight));
    let styleParts = [
      `opacity: ${ isScrolling ? '1' : '0' }`,
      `height: ${thumbHeight}px`,
      `transform: translateY(${thumbY}px)`
    ];
    return htmlSafe(styleParts.join(';'));
  }

  @computed('scrollTopRatio', 'contentRatio')
  get compressionFactor() {
    // when overscrolled, the thumb compresses
    if (this.scrollTopRatio < 0) {
      return (1 + (this.scrollTopRatio * 2));
    }
    if ((this.scrollTopRatio + this.contentRatio) > 1) {
      return 1 - (((this.scrollTopRatio + this.contentRatio) - 1) * 2);
    }
    return 1;
  }

  @computed('contentHeight', 'scrollTop')
  get scrollTopRatio() {
    return this.scrollTop / this.contentHeight;
  }
}
