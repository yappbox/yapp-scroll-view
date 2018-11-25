import EmberCollection from 'ember-collection/components/ember-collection';
import { classNames, layout } from '@ember-decorators/component';
import template from './template';
import { action } from '@ember-decorators/object';
import { set } from '@ember/object';
import { argument } from '@ember-decorators/argument';
import { optional, type } from '@ember-decorators/argument/type';
import { ClosureAction } from '@ember-decorators/argument/types';

/* An ember-collection subclass which integrates ScrollView */
@layout(template)
@classNames('CollectionScrollView')
export default class CollectionScrollView extends EmberCollection {
  @argument @type('any') auxiliaryComponent;
  @argument @type(optional(ClosureAction)) scrolledToTopChange;

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
}
