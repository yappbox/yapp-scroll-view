import Ember from 'ember';

const scrollerStack = [];

window.addEventListener("statusbartap", function() {
  let scrollResponder = scrollerStack.get('lastObject');
  if (scrollResponder) {
    scrollResponder.statusBarTapped();
  }
});

export default Ember.Mixin.create({
  init: function() {
    this._super();
    this.on("didInsertElement", this, 'pushScrollResponder');
    this.on("willDestroyElement", this, 'popScrollResponder');
  },
  pushScrollResponder() {
    scrollerStack.pushObject(this);
  },
  popScrollResponder() {
    scrollerStack.removeObject(this);
  },
  statusBarTapped() {
    this.scrollToTop();
  }
});
