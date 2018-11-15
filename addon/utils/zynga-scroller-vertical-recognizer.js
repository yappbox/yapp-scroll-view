import Hammer from 'hammerjs';
import { run } from '@ember/runloop';

export default class ZyngaScrollerVerticalRecognizer extends Hammer.Pan {
  constructor(options) {
    super(options);
    this.options = Object.assign({}, this.defaults, options || {});
  }

  defaults = {
    enable: true,
    event: 'pan',
    threshold: 10,
    pointers: 1,
    direction: Hammer.DIRECTION_VERTICAL
  };

  recognize(inputData) {
    if (this.canEmit()) {
      if (inputData.isFirst) {
        run(this, function() {
          this.options.scrollComponent.scroller.doTouchStart(inputData.pointers, inputData.timeStamp);
        });
      } else if (inputData.isFinal) {
        run(this, function() {
          this.options.scrollComponent.scroller.doTouchEnd(inputData.timeStamp);
        });
      } else {
        run(this, function() {
          this.options.scrollComponent.scroller.doTouchMove(inputData.pointers, inputData.timeStamp, inputData.scale);
        });
      }
    }
    super.recognize(inputData);
  }
}
