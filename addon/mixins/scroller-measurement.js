import Ember from 'ember';

export default Ember.Mixin.create({
  init() {
    this._super(...arguments);
    this.get('scrollerRegistry').addScrollView(this);
  },
  destroy() {
    this.get('scrollerRegistry').removeScrollView(this);
    this._super(...arguments);
  },
  scrollerRegistry: Ember.inject.service('scroller-registry'),
  adjustScrollableViewMinHeight() {
    let height = this.$().height();
    let scrollableElement = this.get('scrollableElement');
    let $scrollableView = this.$(scrollableElement);
    let paddingTop = parseInt($scrollableView.css('padding-top'), 10);
    let paddingBottom = parseInt($scrollableView.css('padding-bottom'), 10);
    height = height - paddingTop - paddingBottom;
    if (height > 0) {
      $scrollableView.css({
        minHeight: height
      });
    }
  },
  refresh() {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }

    if (this._isScrolling) {
      this.one('becameValidForMeasurement', this, () => {
        Ember.run(this, 'scheduleRefresh');
      });
      return;
    }

    this.adjustScrollableViewMinHeight();
    let element = this.get('element');
    let scrollerHeight = element.clientHeight;
    this.scrollerHeight = scrollerHeight;
    this.scrollerTrackHeight = this.$('.y-scrollbar-track').height();
    if (scrollerHeight === 0) {
      return;
    }
    let scrollableElement = this.scrollableElement;
    if (!scrollableElement) {
      return; // can happen if triggered before component is inDOM
    }
    let scrollableHeight = scrollableElement.offsetHeight;
    this.scrollableHeight = scrollableHeight;
    this.set('maxScrollTop', scrollableHeight - scrollerHeight);
    if (this.scroller) {
      this.scroller.setDimensions(element.clientWidth, scrollerHeight, scrollableElement.offsetWidth, scrollableHeight);
    }
  },
  scheduleRefresh() {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    return Ember.run.scheduleOnce('afterRender', this, this.refresh);
  }
});
