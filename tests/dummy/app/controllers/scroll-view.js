/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Controller from '@ember/controller';

export default Controller.extend({
  isShort: false,
  actions: {
    toggleIsShort() {
      this.set('isShort', !this.isShort);
    }
  }
});
