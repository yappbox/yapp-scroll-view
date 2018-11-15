import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';
import { computed } from '@ember/object';
import $ from 'jquery';
import FastClick from 'fastclick';
import normalizeWheel from 'yapp-scroll-view/utils/normalize-wheel';

let fieldRegex = /input|textarea|select/i;
let fastClickWillSynthesizeClicks = !FastClick.notNeeded(document.body);

function mouseEventToFauxTouchEvent(e) {
  var fauxTouch, originalEvent;
  fauxTouch = {
    pageX: e.pageX,
    pageY: e.pageY,
    screenX: e.screenX,
    screenY: e.screenY,
    clientX: e.clientX,
    clientY: e.clientY,
    target: e.target,
    ctrlKey: e.ctrlKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey,
    metaKey: e.metaKey
  };
  originalEvent = e;
  return {
    target: e.target,
    touches: [fauxTouch],
    changedTouches: [fauxTouch],
    timeStamp: e.timeStamp,
    fromMouseEvent: true,
    preventDefault() {
      return originalEvent.preventDefault();
    }
  };
}

function scrollingDidComplete() {
  run(() => {
    this.get('scrollerRegistry').endScrolling();
  });
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

function handleStart(e) {
  let touch = e.touches[0];
  if (!touch) { return; }
  let target = touch.target;
  if (target && target.tagName.match(fieldRegex) || target && target.hasAttribute('data-prevent-scrolling')) {
    return;
  }
  if (e.fromMouseEvent) {
    bindDocumentMouseEvents.call(this);
  } else {
    bindDocumentTouchEvents.call(this);
    let el = this.get('element');
    let handlers = this.scrollerEventHandlers;
    el.addEventListener("click", handlers.fastclick, false);
  }
  run(this, function() {
    this.scroller.doTouchStart(e.touches, e.timeStamp);
  });
  if (fastClickWillSynthesizeClicks && (this.$().css('touchAction') !== 'manipulation')) {
    e.preventDefault();
  }
}

function handleMove(e) {
  if (!this.canScroll()) {
    handleCancel.call(this, e);
    return;
  }
  let scrollTopBefore = this.scrollTop;
  this.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
  if (!e.fromMouseEvent) {
    e.preventDefault(); // Works around a touch events bug in Android KitKat and below:
                        // https://code.google.com/p/android/issues/detail?id=19827
  }
  if (!this._isScrolling && scrollTopBefore !== this.scrollTop) {
    this._didScroll = true;
    run(this, function() {
      this.set('isScrolling', true);
      this.showScrollbar();
      this.get('scrollerRegistry').startScrolling(this);
      let scrollerstart = $.Event('scrollerstart');
      scrollerstart.originalEvent = e;
      $(e.target).trigger(scrollerstart);
    });
  }
}

function handleEnd(e) {
  handleCancel.call(this, e);
}

function handleCancel(e) {
  if (e.fromMouseEvent) {
    unbindDocumentMouseEvents.call(this);
  } else {
    unbindDocumentTouchEvents.call(this);
    let el = this.get('element');
    let handlers = this.scrollerEventHandlers;
    setTimeout(function(){
      if (el) {
        el.removeEventListener("click", handlers.fastclick, false);
      }
    }, 0);
  }
  run(this, function(){
    this.scroller.doTouchEnd(e.timeStamp);
  });
}

function bindDocumentTouchEvents() {
  let handlers = this.scrollerEventHandlers;
  if (handlers == null) {
    return;
  }
  document.addEventListener("touchmove", handlers.touchmove, { capture: true, passive: false });
  document.addEventListener("touchend", handlers.touchend, { capture: true, passive: false });
  document.addEventListener("touchcancel", handlers.touchcancel, { capture: true, passive: false });
}

function bindDocumentMouseEvents() {
  let handlers = this.scrollerEventHandlers;
  if (handlers == null) {
    return;
  }
  document.addEventListener("mousemove", handlers.mousemove, { capture: true, passive: false });
  document.addEventListener("mouseup", handlers.mouseup, { capture: true, passive: false });
}

function unbindDocumentTouchEvents() {
  let handlers = this.scrollerEventHandlers;
  if (handlers == null) {
    return;
  }
  document.removeEventListener("touchmove", handlers.touchmove, { capture: true, passive: false });
  document.removeEventListener("touchend", handlers.touchend, { capture: true, passive: false });
  document.removeEventListener("touchcancel", handlers.touchcancel, { capture: true, passive: false });
}

function unbindDocumentMouseEvents() {
  let handlers = this.scrollerEventHandlers;
  if (handlers == null) {
    return;
  }
  document.removeEventListener("mousemove", handlers.mousemove, { capture: true, passive: false });
  document.removeEventListener("mouseup", handlers.mouseup, { capture: true, passive: false });
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
    let el = this.element;
    let scrollView = this;
    let handlers = { };
    this.scrollerEventHandlers = handlers;
    handlers.captureClick = function(e){
      e.stopPropagation(); // Stop the click from being propagated.
      el.removeEventListener('click', handlers.captureClick, true);
    };
    handlers.fastclick = function(e) {
      if (scrollView._isScrolling && Math.abs(scrollView._decelerationVelocityY) > 2) {
        e.stopPropagation();
      }
    };

    handlers.touchstart = handleStart.bind(scrollView);
    handlers.touchmove = handleMove.bind(scrollView);
    handlers.touchend = handleEnd.bind(scrollView);
    handlers.touchcancel = handleCancel.bind(scrollView);

    let mousedown = false;
    handlers.mousedown = function(e) {
      handleStart.call(scrollView, mouseEventToFauxTouchEvent(e));
      mousedown = true;
      scrollView._didScroll = false;
    };
    handlers.mousemove = function(e) {
      if (!mousedown) {
        return;
      }
      handleMove.call(scrollView, mouseEventToFauxTouchEvent(e));
      mousedown = true;
    };
    handlers.mouseup = function(e) {
      if (!mousedown) {
        return;
      }
      handleEnd.call(scrollView, mouseEventToFauxTouchEvent(e));
      if (scrollView._didScroll || (scrollView._isScrolling && Math.abs(scrollView._decelerationVelocityY) > 2)) {
        el.addEventListener('click', handlers.captureClick, true);
        setTimeout(function(){
          el.removeEventListener('click', handlers.captureClick, true);
        }, 0);
      }
      mousedown = false;
    };
    handlers.wheel = function(e) {
      let eventInfo = normalizeWheel(e);
      let delta = eventInfo.pixelY;
      let scroller = scrollView.scroller;
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
    };
    el.addEventListener("touchstart", handlers.touchstart, { passive: false });
    el.addEventListener("mousedown", handlers.mousedown, false);
    el.addEventListener(normalizeWheel.getEventType(), handlers.wheel, { passive: false });
  },
  unbindScrollerEvents: function() {
    this.off('scrollingDidComplete', this, scrollingDidComplete);
    let el = this.get('element');
    let handlers = this.scrollerEventHandlers;
    if (handlers == null) {
      return;
    }
    unbindDocumentTouchEvents.call(this);
    unbindDocumentMouseEvents.call(this);
    this.scrollerEventHandlers = null;
    if (el) {
      el.removeEventListener("touchstart", handlers.touchstart, false);
      el.removeEventListener("mousedown", handlers.mousedown, false);
      el.removeEventListener("click", handlers.fastclick, false);
      el.removeEventListener(normalizeWheel.getEventType(), handlers.wheel, false);
    }
  },
  canScroll() {
    return true;
  }
});
