// Vendored from ember-collection/addon/utils/translate.js + style-properties.js
// These are pure DOM utility functions for CSS transforms.

const stylePrefixes = ['webkit', 'Webkit', 'ms', 'Moz', 'O'];
const cssPrefixes = ['-webkit-', '-ms-', '-moz-', '-o-'];
const style = typeof document !== 'undefined' && document.documentElement && document.documentElement.style;
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function camelize(str) {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}
function findProperty(property, css) {
  let prop = css ? camelize(property) : property;
  if (style && prop in style) {
    return property;
  }
  if (style) {
    let capitalized = capitalize(prop);
    for (let i = 0; i < stylePrefixes.length; i++) {
      let prefixed = stylePrefixes[i] + capitalized;
      if (prefixed in style) {
        return css ? cssPrefixes[i] + property : prefixed;
      }
    }
  }
}
function styleProperty(prop) {
  return findProperty(prop, false);
}
function cssProperty(cssProp) {
  return findProperty(cssProp, true);
}
const transformCSSProp = cssProperty('transform');
const transformStyleProp = styleProperty('transform');
const supports3D = !!styleProperty('perspectiveOrigin');
const supports2D = !!transformStyleProp;
function translatePosition(el, x, y) {
  el.style.left = x + 'px';
  el.style.top = y + 'px';
}
function translateTransform2D(el, x, y) {
  el.style[transformStyleProp] = matrix2D(x, y);
}
function translateTransform3D(el, x, y) {
  el.style[transformStyleProp] = matrix3D(x, y);
}
function translatePositionCSS(x, y) {
  return `left:${x}px;top:${y}px;`;
}
function translateTransform2DCSS(x, y) {
  return `${transformCSSProp}:${matrix2D(x, y)};`;
}
function translateTransform3DCSS(x, y) {
  return `${transformCSSProp}:${matrix3D(x, y)};`;
}
function matrix2D(x, y) {
  return `matrix(1, 0, 0, 1, ${x}, ${y})`;
}
function matrix3D(x, y) {
  return `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${x}, ${y}, 0, 1)`;
}
const translate = supports3D ? translateTransform3D : supports2D ? translateTransform2D : translatePosition;
const translateCSS = supports3D ? translateTransform3DCSS : supports2D ? translateTransform2DCSS : translatePositionCSS;

export { supports2D, supports3D, translate, translateCSS, translatePosition, translatePositionCSS, translateTransform2D, translateTransform2DCSS, translateTransform3D, translateTransform3DCSS };
//# sourceMappingURL=translate.js.map
