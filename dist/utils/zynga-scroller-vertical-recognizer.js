import Hammer from 'hammerjs';

const FIELD_REGEXP = /input|textarea|select/i;
class ZyngaScrollerVerticalRecognizer extends Hammer.Pan {
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
    // We want to be sure to delegate to the scroll component if this is a mousedown or touchstart.
    // There are circumstances where this.canEmit() will return false because a "requireFail"'d recognizer
    // has not yet reset.
    if ((inputData.isFirst || this.canEmit()) && !isOverElementThatPreventsScrollingInteraction) {
      this.delegateToScrollComponent(inputData);
    }
    if (isOverElementThatPreventsScrollingInteraction) {
      this.state = Hammer.STATE_FAILED;
      return;
    }
    super.recognize(inputData);
    if (inputData.isFinal) {
      setTimeout(() => {
        this.state = Hammer.STATE_POSSIBLE;
      }, 0);
    }
  }
  shouldPreventScrollingInteraction(inputData) {
    let {
      target
    } = inputData;
    return inputData.isFirst && (target && target.tagName.match(FIELD_REGEXP) || target && target.hasAttribute('data-prevent-scrolling'));
  }
  delegateToScrollComponent(inputData) {
    if (inputData.isFirst) {
      this.options.scrollComponent.doTouchStart(inputData.pointers, inputData.timeStamp);
    } else if (inputData.isFinal) {
      this.options.scrollComponent.doTouchEnd(inputData.pointers, inputData.timeStamp, inputData.srcEvent);
    } else {
      this.options.scrollComponent.doTouchMove(inputData.pointers, inputData.timeStamp, inputData.scale);
    }
  }
}

export { ZyngaScrollerVerticalRecognizer as default };
//# sourceMappingURL=zynga-scroller-vertical-recognizer.js.map
