/* global opera, navigator */
var vendorPrefix = null;

export default function getVendorPrefix() {
  var docStyle, engine;
  if (vendorPrefix != null) {
    return vendorPrefix;
  }
  docStyle = document.documentElement.style;
  if (window.opera && (Object.prototype.toString.call(opera) === '[object Opera]')) {
    engine = 'presto';
  } else if ('MozAppearance' in docStyle) {
    engine = 'gecko';
  } else if ('WebkitAppearance' in docStyle) {
    engine = 'webkit';
  } else if (typeof navigator.cpuClass === 'string') {
    engine = 'trident';
  }
  return vendorPrefix = {
    trident: 'ms',
    gecko: 'Moz',
    webkit: 'Webkit',
    presto: 'O'
  }[engine];
}
