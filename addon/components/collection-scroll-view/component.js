import EmberCollection from 'ember-collection/components/ember-collection';
import { classNames, layout } from '@ember-decorators/component';
import template from './template';
import { action } from '@ember/object';
import { set } from '@ember/object';
import { argument } from '@ember-decorators/argument';
import { Action, optional } from '@ember-decorators/argument/types';

/* An ember-collection subclass which integrates ScrollView */
@layout(template)
@classNames('CollectionScrollView')
export default class CollectionScrollView extends EmberCollection {
  @argument('any')
  auxiliaryComponent;

  @argument(optional(Action))
  scrolledToTopChange;

  @argument(optional('number'))
  scrollTopOffset = 0;

  @argument(optional('number'))
  initialScrollTop;

  @argument(optional('string'))
  key;

  @argument(optional('any'))
  revealService;

  @action
  scrollChange(scrollTop) {
    if (scrollTop !== this._scrollTop) {
      set(this, '_scrollTop', scrollTop);
      this._needsRevalidate();
    }
  }

  @action
  clientSizeChange(clientWidth, clientHeight) {
    if (this._clientWidth !== clientWidth ||
        this._clientHeight !== clientHeight) {
      set(this, '_clientWidth', clientWidth);
      set(this, '_clientHeight', clientHeight);
      this._needsRevalidate();
    }
  }

  @action
  onScrolledToTopChange(isAtTop) {
    if (this.scrolledToTopChange) {
      this.scrolledToTopChange(isAtTop);
    }
  }

  @action
  scrollToItem(scrollViewApi, revealItemPayload) {
    let { id, source } = revealItemPayload;
    if (source && isChildComponent(this, source)) {
      return;
    }
    let itemIndex = this.items.indexOf(this.items.findBy('id', id));
    if (itemIndex >= 0) {
      let { y } = this._cellLayout.positionAt(itemIndex);
      scrollViewApi.scrollTo(y, true);
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
