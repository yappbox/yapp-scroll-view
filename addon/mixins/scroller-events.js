import Ember from 'ember';
const { computed } = Ember;
import $ from 'jquery';
import FastClick from 'fastclick';
import normalizeWheel from 'ember-virtual-scrollkit/utils/normalize-wheel';

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

function handleStart(e) {
  let touch = e.touches[0];
  if (!touch) { return; }
  let target = touch.target;
  if (target && target.tagName.match(fieldRegex) || target && target.hasAttribute('data-prevent-scrolling')) {
    return;
  }
  if (e.fromMouseEvent) {
    bindWindowMouseEvents.call(this);
  } else {
    bindWindowTouchEvents.call(this);
    let el = this.get('element');
    let handlers = this.scrollerEventHandlers;
    el.addEventListener("click", handlers.fastclick, false);
  }
  Ember.run(this, function() {
    this.scroller.doTouchStart(e.touches, e.timeStamp);
  });
  if (fastClickWillSynthesizeClicks) {
    e.preventDefault();
  }
}

function handleMove(e) {
  let scrollTopBefore = this.scrollTop;
  this.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
  if (!e.fromMouseEvent) {
    e.preventDefault(); // Works around a touch events bug in Android KitKat and below:
                        // https://code.google.com/p/android/issues/detail?id=19827
  }
  if (!this._isScrolling && scrollTopBefore !== this.scrollTop) {
    this._didScroll = true;
    Ember.run(this, function() {
      this.set('isScrolling', true);
      this.showScrollbar();
      this.get('scrollerRegistry').startScrolling(this);
      let scrollerstart = $.Event('scrollerstart');
      scrollerstart.originalEvent = e;
      $(e.target).trigger(scrollerstart);
    });
  }
}

function scrollingDidStart() {
  console.log('scrollingDidStart');
  Ember.run(() => {
    this.get('scrollerRegistry').startScrolling();
  });
}

function scrollingDidComplete() {
  console.log('scrollingDidComplete');
  Ember.run(() => {
    this.get('scrollerRegistry').endScrolling();
  });
  setTimeout(()=>{
    // if (this.isDestroyed || this.isDestroying) { return; }
    Ember.run(() => {
      this.set('isScrolling', false);
    });
    this._decelerationVelocityY = 0;
  }, 0);
}

function handleEnd(e) {
  handleCancel.call(this, e);
}

function handleCancel(e) {
  if (e.fromMouseEvent) {
    unbindWindowMouseEvents.call(this);
  } else {
    unbindWindowTouchEvents.call(this);
    let el = this.get('element');
    let handlers = this.scrollerEventHandlers;
    setTimeout(function(){
      if (el) {
        el.removeEventListener("click", handlers.fastclick, false);
      }
    }, 0);
  }
  Ember.run(this, function(){
    this.scroller.doTouchEnd(e.timeStamp);
  });
}

function bindWindowTouchEvents() {
  let handlers = this.scrollerEventHandlers;
  if (handlers == null) {
    return;
  }
  window.addEventListener("touchmove", handlers.touchmove, true);
  window.addEventListener("touchend", handlers.touchend, true);
  window.addEventListener("touchcancel", handlers.touchcancel, true);
}

function bindWindowMouseEvents() {
  let handlers = this.scrollerEventHandlers;
  if (handlers == null) {
    return;
  }
  window.addEventListener("mousemove", handlers.mousemove, true);
  window.addEventListener("mouseup", handlers.mouseup, true);
  window.addEventListener("mouseout", handlers.mouseout, true);
}

function unbindWindowTouchEvents() {
  let handlers = this.scrollerEventHandlers;
  if (handlers == null) {
    return;
  }
  window.removeEventListener("touchmove", handlers.touchmove, true);
  window.removeEventListener("touchend", handlers.touchend, true);
  window.removeEventListener("touchcancel", handlers.touchcancel, true);
}

function unbindWindowMouseEvents() {
  let handlers = this.scrollerEventHandlers;
  if (handlers == null) {
    return;
  }
  window.removeEventListener("mousemove", handlers.mousemove, true);
  window.removeEventListener("mouseup", handlers.mouseup, true);
  window.removeEventListener("mouseout", handlers.mouseout, true);
}

export default Ember.Mixin.create({
  init: function() {
    return this._super();
  },

  isScrolling: computed({
    get(){
      return this._isScrolling;
    },
    set(key, value){
      this._isScrolling = value;
      this.get('scrollViewApi').scrollingChanged(value);

      return value;
    }
  }),

  bindScrollerEvents: function() {
    console.log('binding scroller events');
    var handlers, mousedown, scrollView, scrollViewBound;
    this.on('scrollingDidStart', this, scrollingDidStart);
    this.on('scrollingDidComplete', this, scrollingDidComplete);
    let el = this.get('element');
    scrollView = this;
    scrollViewBound = function(f) {
      return function(e) {
        return f.call(scrollView, e);
      };
    };
    handlers = { };
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

    handlers.touchstart = scrollViewBound(handleStart);
    handlers.touchmove = scrollViewBound(handleMove);
    handlers.touchend = scrollViewBound(handleEnd);
    handlers.touchcancel = scrollViewBound(handleCancel);

    mousedown = false;
    handlers.mousedown = function(e) {
      scrollViewBound(handleStart)(mouseEventToFauxTouchEvent(e));
      mousedown = true;
      scrollView._didScroll = false;
    };
    handlers.mousemove = function(e) {
      if (!mousedown) {
        return;
      }
      scrollViewBound(handleMove)(mouseEventToFauxTouchEvent(e));
      mousedown = true;
    };
    handlers.mouseup = function(e) {
      if (!mousedown) {
        return;
      }
      scrollViewBound(handleEnd)(mouseEventToFauxTouchEvent(e));
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
    el.addEventListener("touchstart", handlers.touchstart, false);
    el.addEventListener("mousedown", handlers.mousedown, false);
    el.addEventListener(normalizeWheel.getEventType(), handlers.wheel, false);
  },
  unbindScrollerEvents: function() {
    this.off('scrollingDidStart', this, scrollingDidStart);
    this.off('scrollingDidComplete', this, scrollingDidComplete);
    let el = this.get('element');
    let handlers = this.scrollerEventHandlers;
    if (handlers == null) {
      return;
    }
    unbindWindowTouchEvents.call(this);
    unbindWindowMouseEvents.call(this);
    this.scrollerEventHandlers = null;
    if (el) {
      el.removeEventListener("touchstart", handlers.touchstart, false);
      el.removeEventListener("mousedown", handlers.mousedown, false);
      el.removeEventListener("click", handlers.fastclick, false);
      el.removeEventListener(normalizeWheel.getEventType(), handlers.wheel, false);
    }
  }
});
