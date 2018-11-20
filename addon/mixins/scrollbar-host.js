/* globals Modernizr */
import { run, schedule } from '@ember/runloop';

import Mixin from '@ember/object/mixin';
import cssTransform from '../utils/css-transform';

var cssPrefix, cssify, getContentHeight;

var MIN_SCROLLBAR_HEIGHT = 15;

var mround = Math.round;
var mmax = Math.max;
var mmin = Math.min;

var translateY = cssTransform.translateY;
var trnOpen = cssTransform.trnOpen;
var trnClose = cssTransform.trnClose;

cssify = function(str) {
  return str.replace(/([A-Z])/g, function(str, m1) {
    return "-" + (m1.toLowerCase());
  }).replace(/^ms-/, '-ms-');
};

cssPrefix = function(propName) {
  return cssify(Modernizr.prefixed(propName) || propName);
};

function initScrollbars() {
  this.$track = this.$('.y-scrollbar-track').css({
    top: this.scrollbarEndInset,
    right: this.scrollbarSideInset,
    bottom: this.scrollbarEndInset,
    width: this.scrollbarWidth
  });
  var cssOpts = {};
  cssOpts["pointer-events"] = "none";
  cssOpts["opacity"] = 0;
  cssOpts[cssPrefix("transitionProperty")] = "opacity";
  cssOpts[cssPrefix("transitionTimingFunction")] = "cubic-bezier(0.33,0.66,0.66,1)";
  cssOpts[cssPrefix("transitionDuration")] = "350ms";
  cssOpts[cssPrefix("transform")] = "" + trnOpen + "0,0" + trnClose;
  this.$thumb = this.$track.find('.thumb');
  this.$thumb.css(cssOpts);
}

getContentHeight = function() {
  return this.scrollableHeight || this.scrollableElement.offsetHeight;
};

export default Mixin.create({
  scrollbarWidth: 5,
  scrollbarSideInset: 2,
  scrollbarEndInset: 2,
  init() {
    this._super(...arguments);
    this.setupScrollbarHost();
  },
  setupScrollbarHost() {
    this.on("didInitializeScroller", this, 'initScrollbars');
    this.on("scrollingDidComplete", this, function() {
      if (run.currentRunLoop) {
        return schedule('afterRender', this, 'hideScrollbar');
      } else {
        return this.hideScrollbar();
      }
    });
  },
  renderScrollbar(buffer) {
    return buffer.push('<div class="y-scrollbar-track"><div class="thumb" style="opacity:0"></div></div>');
  },
  initScrollbars: initScrollbars,
  willDestroyElement() {
    this._super(...arguments);
    this.off("didInitializeScroller", this, 'initScrollbars');
    this.off("scrollingDidComplete", this, 'hideScrollbar');
    this.$thumb = null;
  },
  updateScrollbar(yPos) {
    var compressedMaxScrollbarTop, compressionAmount, containerHeight,
    contentHeight, contentRatio, element, scrollbarHeight, scrollbarTop, thumb,
    trackHeight, uncompressedMaxScrollbarTop, uncompressedScrollbarHeight;
    if (this._state !== 'inDOM') {
      return;
    }
    element = this.get('element');
    thumb = this.$thumb[0];
    containerHeight = this.scrollerHeight || element.offsetHeight;
    contentHeight = this.getContentHeight();
    trackHeight = this.scrollerTrackHeight || thumb.parentElement.offsetHeight;
    contentRatio = containerHeight / contentHeight;
    scrollbarHeight = mmax(mround(contentRatio * trackHeight), MIN_SCROLLBAR_HEIGHT);
    uncompressedScrollbarHeight = scrollbarHeight;
    uncompressedMaxScrollbarTop = trackHeight - uncompressedScrollbarHeight;
    compressedMaxScrollbarTop = trackHeight - MIN_SCROLLBAR_HEIGHT;
    scrollbarTop = mround(yPos * contentRatio);
    if (scrollbarTop < 0) {
      scrollbarHeight = scrollbarHeight + mround(yPos * 2);
      scrollbarHeight = mmax(MIN_SCROLLBAR_HEIGHT, scrollbarHeight);
    } else if (scrollbarTop > uncompressedMaxScrollbarTop) {
      compressionAmount = mround((scrollbarTop - uncompressedMaxScrollbarTop) * 2);
      scrollbarHeight = scrollbarHeight - compressionAmount;
      scrollbarHeight = mmax(MIN_SCROLLBAR_HEIGHT, scrollbarHeight);
      scrollbarTop = mmin(compressedMaxScrollbarTop, uncompressedMaxScrollbarTop + compressionAmount);
    }
    scrollbarTop = mmax(scrollbarTop, 0);
    thumb.style.height = scrollbarHeight + 'px';
    return translateY(thumb, -scrollbarTop);
  },
  getContentHeight: getContentHeight,
  hideScrollbar() {
    if (this.$thumb) {
      this.$thumb.css('opacity', 0);
    }
  },
  showScrollbar() {
    if (this.$thumb) {
      this.$thumb.css('opacity', 1);
    }
  }
});
