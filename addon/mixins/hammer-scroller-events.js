import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import Hammer from 'hammerjs';
import { run } from '@ember/runloop';
import ZyngaScrollerVerticalRecognizer from 'yapp-scroll-view/utils/zynga-scroller-vertical-recognizer'
import normalizeWheel from 'yapp-scroll-view/utils/normalize-wheel';
const FIELD_REGEXP = /input|textarea|select/i;

// TODO: other edge cases

function scrollingDidComplete() {
  setTimeout(()=>{
    if (this.isDestroyed || this.isDestroying) {
      return;
    }
    run(() => {
      this.set('isScrolling', false);
    });
    this._decelerationVelocityY = 0;
  }, 0);
}

export default Mixin.create({
  isScrolling: computed({
    get(){
      return this._isScrolling;
    },
    set(key, value){
      this._isScrolling = value;
      this.scrollViewApi.scrollingChanged(value);
      if (value === false) {
        this.trigger('becameValidForMeasurement');
      }

      return value;
    }
  }),

  bindScrollerEvents() {
    this.on('scrollingDidComplete', this, scrollingDidComplete);
    this.hammer = new Hammer.Manager(this.element, {
      inputClass: Hammer.TouchMouseInput,
      recognizers: [
        [ZyngaScrollerVerticalRecognizer, { scrollComponent: this }]
      ]
    });
    this._boundHandleWheel = this.handleWheel.bind(this);
    this.element.addEventListener(
      normalizeWheel.getEventType(),
      this._boundHandleWheel,
      { passive: false }
    );
  },
  unbindScrollerEvents() {
    this.hammer.destroy();
    this.element.removeEventListener(
      normalizeWheel.getEventType(),
      this._boundHandleWheel,
      false
    );
    this.off('scrollingDidComplete', this, scrollingDidComplete);
  },
  doTouchStart(touches, timeStamp) {
    this.scroller.doTouchStart(touches, timeStamp)
  },
  doTouchMove(touches, timeStamp, scale) {
    this.scroller.doTouchMove(touches, timeStamp, scale)
  },
  doTouchEnd(timeStamp) {
    this.scroller.doTouchEnd(timeStamp)
  },
  handleWheel(e) {
    if (e.target && e.target.tagName.match(FIELD_REGEXP)) {
      return;
    }
    let eventInfo = normalizeWheel(e);
    let delta = eventInfo.pixelY;
    let scroller = this.scroller;
    let scrollTop = scroller.__scrollTop;
    let maxScrollTop = scroller.__maxScrollTop;
    let candidatePosition = scrollTop + delta;

    e.preventDefault();
    if ( (scrollTop === 0 && candidatePosition < 0) ||
         (scrollTop === maxScrollTop && candidatePosition > maxScrollTop)) {
      return;
    }
    scroller.scrollBy(0, delta, true);
    e.stopPropagation();
  }
});
