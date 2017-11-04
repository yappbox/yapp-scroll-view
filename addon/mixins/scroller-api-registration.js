import Ember from 'ember';
const { computed } = Ember;

class ScrollControlApi {
  constructor(scrollable) {
    this._scrollable = scrollable;
  }

  resetScrollPosition() {
    this._scrollable.resetScrollPosition();
  }

  scrollToTop() {
    this._scrollable.scrollToTop();
  }
}

export default Ember.Mixin.create({
  scrollControlApi: computed(function(){
    return new ScrollControlApi(this);
  }),
  didInsertElement(){
    this._super(...arguments);
    let scrollControlApiRegistrar = this.get('scrollControlApiRegistrar');
    if (scrollControlApiRegistrar) {
      scrollControlApiRegistrar.register(this.get('scrollControlApi'));
    }
  },
  willDestroyElement(){
    this._super(...arguments);
    let scrollControlApiRegistrar = this.get('scrollControlApiRegistrar');
    if (scrollControlApiRegistrar) {
      scrollControlApiRegistrar.unregister(this.get('scrollControlApi'));
    }
  }
});
