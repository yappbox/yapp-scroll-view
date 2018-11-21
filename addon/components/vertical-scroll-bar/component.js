import Component from '@ember/component';
import { classNames, layout } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import template from './template';
import { argument } from '@ember-decorators/argument';
import { htmlSafe } from '@ember/string';
import { timeout, waitForProperty } from 'ember-concurrency';
import { task, restartableTask } from 'ember-concurrency-decorators';
import { assert } from '@ember/debug';
import { optional, type } from '@ember-decorators/argument/type';

const MIN_THUMB_LENGTH = 15;
const IS_SCROLLING_TIMEOUT = 100;

@layout(template)
@classNames('VerticalScrollBar')
export default class VerticalScrollBar extends Component {
  @argument @type(optional('number')) contentHeight;
  @argument @type(optional('number')) scrollTop;
  @argument @type('boolean') isTouching;

  isShowingThumb = false;

  constructor() {
    super(...arguments);
    this.set('viewportHeight', this.contentHeight);
  }

  didInsertElement(){
    this._super(...arguments);
    assert("element has zero height", this.element.offsetHeight !== 0);
    this.set('viewportHeight', this.element.offsetHeight);
    this.manageIsShowingThumbTask.perform();
  }

  didUpdateAttrs() {
    this._super(...arguments);
    if (this.scrollTop !== this._scrollTop) {
      this.manageIsScrollingTask.perform();
      this._scrollTop = this.scrollTop;
    }
  }

  @computed('contentHeight', 'viewportHeight')
  get contentRatio() {
    return Math.min(1, this.viewportHeight / this.contentHeight);
  }

  @computed('contentRatio', 'scrollTopRatio', 'viewportHeight', 'isShowingThumb', 'compressionFactor')
  get thumbStyle() {
    let { viewportHeight, contentRatio, scrollTopRatio, isShowingThumb, compressionFactor } = this;
    if (!viewportHeight) {
      return;
    }
    let thumbHeight = Math.max(MIN_THUMB_LENGTH, contentRatio * viewportHeight * compressionFactor);
    let maxThumbY = viewportHeight - thumbHeight;
    let thumbY = Math.min(maxThumbY, Math.max(0, scrollTopRatio * viewportHeight));
    let styleParts = [
      `opacity: ${ isShowingThumb ? '1' : '0' }`,
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

  @task
  manageIsShowingThumbTask = function*() {
    while(true) { // eslint-disable-line no-constant-condition
      yield waitForProperty(this, 'isScrolling', true)
      this.set('isShowingThumb', true);
      yield waitForProperty(this, 'isScrolling', false);
      yield waitForProperty(this, 'isTouching', false);
      this.set('isShowingThumb', false);
    }
  }

  @restartableTask
  manageIsScrollingTask = function*() {
    this.set('isScrolling', true);
    yield timeout(IS_SCROLLING_TIMEOUT);
    this.set('isScrolling', false);
  }
}
