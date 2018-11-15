## Module Report
### Unknown Global

**Global**: `Ember.Logger`

**Location**: `addon/components/scroll-view.js` at line 9

```js
import EmberObject, { computed, observer } from '@ember/object';
import Ember from 'ember';
const { Logger } = Ember;
import ScrollerEvents from '../mixins/scroller-events';
import ScrollbarHost from '../mixins/scrollbar-host';
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `addon/services/scroller-registry.js` at line 16

```js
      viewport.on('heightDidChange', this, this.refreshAll);
    }
    if (Ember.testing) {
      registerWaiter(() => {
        return this.get('isScrolling') === false;
```
