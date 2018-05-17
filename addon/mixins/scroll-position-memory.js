import Mixin from '@ember/object/mixin';
import { inject as service } from "@ember/service";
import { schedule } from '@ember/runloop';

export default Mixin.create({
  memory: service('scroll-position-memory'),
  didRender() {
    this._super(...arguments);
    let key = this.get('key');
    if (key && key !== this._lastKey) {
      this.remember(this._lastKey);
      this._lastKey = key;
      this.restore(key);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    this.remember(this.get('key'));
  },

  remember(key) {
    if (key) {
      let position = this.get('scrollTop');
      this.get('memory')[key] = position;
    }
  },

  restore(key) {
    let position = this.get('memory')[key] || this.get('initialScrollTop');
    schedule('afterRender', this, this.scrollTo, position);
    this.scrollTo(position);
  }
});
