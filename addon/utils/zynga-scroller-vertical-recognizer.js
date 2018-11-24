import Hammer from 'hammerjs';
import { run } from '@ember/runloop';
const FIELD_REGEXP = /input|textarea|select/i;

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
    let isOverElementThatPreventsScrollingInteraction = this.shouldPreventScrollingInteraction(inputData);
    if (this.canEmit() && !isOverElementThatPreventsScrollingInteraction) {
      this.delegateToScrollComponent(inputData);
    }
    if (isOverElementThatPreventsScrollingInteraction) {
      this.state = Hammer.STATE_FAILED;
      return;
    }
    super.recognize(inputData);
  }

  shouldPreventScrollingInteraction(inputData) {
    let { target } = inputData;
    return inputData.isFirst
      && (target && target.tagName.match(FIELD_REGEXP)
          || target && target.hasAttribute('data-prevent-scrolling')
         );
  }

  delegateToScrollComponent(inputData) {
    if (inputData.isFirst) {
      run(this, function() {
        this.options.scrollComponent.doTouchStart(inputData.pointers, inputData.timeStamp);
      });
    } else if (inputData.isFinal) {
      run(this, function() {
        this.options.scrollComponent.doTouchEnd(inputData.pointers, inputData.timeStamp);
      });
    } else {
      run(this, function() {
        this.options.scrollComponent.doTouchMove(inputData.pointers, inputData.timeStamp, inputData.scale);
      });
    }
  }
}