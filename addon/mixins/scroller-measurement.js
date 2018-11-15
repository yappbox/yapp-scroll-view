import { run, scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
  init() {
    this._super(...arguments);
    this.get('scrollerRegistry').addScrollView(this);
  },
  destroy() {
    this.get('scrollerRegistry').removeScrollView(this);
    this._super(...arguments);
  },
  scrollerRegistry: service('scroller-registry'),
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
        run(this, 'scheduleRefresh');
      });
      return;
    }

    this.adjustScrollableViewMinHeight();
    let element = this.get('element');
    let scrollerHeight = element.clientHeight;
    this.set('scrollerHeight', scrollerHeight);
    this.set('scrollerTrackHeight', this.$('.y-scrollbar-track').height());
    if (scrollerHeight === 0) {
      return;
    }
    let scrollableElement = this.scrollableElement;
    if (!scrollableElement) {
      return; // can happen if triggered before component is inDOM
    }
    let scrollableHeight = scrollableElement.offsetHeight;
    this.set('scrollableHeight', scrollableHeight);
    this.set('maxScrollTop', scrollableHeight - scrollerHeight);
    if (this.scroller) {
      this.scroller.setDimensions(element.clientWidth, scrollerHeight, scrollableElement.offsetWidth, scrollableHeight);
    }
  },
  scheduleRefresh() {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    return scheduleOnce('afterRender', this, this.refresh);
  }
});
