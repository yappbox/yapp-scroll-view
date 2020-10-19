import Component from '@glimmer/component';
import { reads } from 'macro-decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { next, schedule } from '@ember/runloop';

// import { argument } from '@ember-decorators/argument';
// import { Action, optional } from '@ember-decorators/argument/types';

/* A component which integrates a ScrollView with ember-collection */
export default class CollectionScrollView extends Component {
  // @argument('any')
  // auxiliaryComponent;
  //
  // @argument(optional(Action))
  // scrolledToTopChange;
  //
  // @argument(optional('number'))
  // scrollTopOffset;
  @reads('args.scrollTopOffset', 0) scrollTopOffset;

  // @argument(optional('number'))
  // initialScrollTop;
  //
  // @argument(optional('string'))
  // key;
  //
  // @argument(optional('any'))
  // revealService;
  //
  // @argument('any')
  // items;
  //
  // @argument(optional('any'))
  // buffer;

  element;

  @tracked headerDimensions;
  @tracked scrollTop = 0;
  @tracked clientWidth;
  @tracked clientHeight;
  @tracked measuredClientSize;
  @tracked contentSize;

  @reads('headerDimensions.height', 0) headerHeight;
  @reads('args.estimated-height') estimatedHeight;
  @reads('args.estimated-width') estimatedWidth;
  @reads('args.cell-layout') cellLayout;

  get scrollHeight() {
    let { contentSize, clientSize, headerHeight } = this;
    contentSize = contentSize || this.cellLayout.contentSize(clientSize.width, clientSize.height);
    return contentSize.height + headerHeight;
  }

  get clientSize() {
    return this.measuredClientSize || { width: this.estimatedWidth, height: this.estimatedHeight };
  }

  get collectionClientSize() {
    let { clientSize, headerHeight, scrollTop } = this;
    let result = {
      width: clientSize.width,
      height: clientSize.height - Math.max(headerHeight - scrollTop, 0),
    };
    return result;
  }

  get collectionScrollTop() {
    let { headerHeight, scrollTop } = this;
    return Math.max(0, scrollTop - headerHeight);
  }

  @action updateHeaderDimensions(scrollViewApi, entry) {
    let isFirstMeasure = !this.headerDimensions;
    this.headerDimensions = { width: entry.contentRect.width, height: entry.contentRect.height };

    // If an initialScrollTop was set we need to apply it after the collections rows render
    if (isFirstMeasure && this.args.initialScrollTop) {
      next(scrollViewApi, scrollViewApi.scrollTo, this.args.initialScrollTop);
    }
  }

  @action
  updateContentSizeAfterRender(contentSize) {
    schedule('afterRender', this, () => { this.contentSize = contentSize; });
  }

  @action
  scrollChange(scrollTop) {
    if (scrollTop !== this.scrollTop) {
      this.scrollTop = scrollTop;
      // this._needsRevalidate();
    }
  }

  @action
  clientSizeChange(clientWidth, clientHeight) {
    this.measuredClientSize = {
      width: clientWidth,
      height: clientHeight
    };
    // this._needsRevalidate();
  }

  @action
  onScrolledToTopChange(isAtTop) {
    if (this.args.scrolledToTopChange) {
      this.args.scrolledToTopChange(isAtTop);
    }
  }

  @action
  scrollToItem(scrollViewApi, revealItemPayload) {
    let { id, source } = revealItemPayload;
    if (source && (isChildComponent(this, source) || isChildElement(this.element, source))) {
      return;
    }
    let { items } = this.args;
    let itemIndex = items.indexOf(items.findBy('id', id));
    if (itemIndex >= 0) {
      let { y } = this.cellLayout.positionAt(itemIndex);
      scrollViewApi.scrollTo(y + this.headerHeight, true);
    }
  }
}

function isChildComponent(component, candidateChildComponent) {
  let parentView  = candidateChildComponent;
  while (parentView = parentView.parentView) { // eslint-disable-line no-cond-assign
    if (parentView === component) {
      return true;
    }
  }
  return false;
}

function isChildElement(element, candidateChildElement) {
  return  element && (candidateChildElement instanceof HTMLElement) && element.contains(candidateChildElement);
}
