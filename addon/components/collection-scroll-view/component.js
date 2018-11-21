import EmberCollection from 'ember-collection/components/ember-collection';
import { classNames, layout } from '@ember-decorators/component';
import template from './template';
import { action } from '@ember-decorators/object';
import { set } from '@ember/object';

/* An ember-collection subclass which integrates ScrollView */
@layout(template)
@classNames('CollectionScrollView')
export default class CollectionScrollView extends EmberCollection {

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

}
