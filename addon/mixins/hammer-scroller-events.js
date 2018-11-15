import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import Hammer from 'hammerjs';
import { run } from '@ember/runloop';
import ZyngaScrollerVerticalRecognizer from 'yapp-scroll-view/utils/zynga-scroller-vertical-recognizer'

// TODO: wheel
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
  },
  unbindScrollerEvents() {
    this.hammer.destroy();
    this.off('scrollingDidComplete', this, scrollingDidComplete);
  }
});
