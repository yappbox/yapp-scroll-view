/* globals Modernizr */
let prepared = false;
let helper = {
  trnOpen: 'translate(',
  trnClose: ')',
  translateY: null
};

function prepare() {
  var transformProperty;
  if (prepared) {
    return;
  }
  prepared = true;
  transformProperty = Modernizr.prefixed("Transform");
  if (Modernizr.csstransforms3d) {
    helper.trnOpen = 'translate3d(';
    helper.trnClose = ', 0)';
    helper.translateY = function(element, yPos) {
      if (element) {
        return element.style[transformProperty] = "" + helper.trnOpen + "0," + (-yPos) + "px" + helper.trnClose;
      }
    };
  } else if (Modernizr.csstransforms) {
    helper.translateY = function(element, yPos) {
      if (element) {
        return element.style[transformProperty] = "" + helper.trnOpen + "0," + (-yPos) + "px" + helper.trnClose;
      }
    };
  } else {
    helper.translateY = function(element, yPos) {
      if (element) {
        return element.style.marginTop = "" + (-yPos) + "px";
      }
    };
  }
}

prepare();

export default helper;
