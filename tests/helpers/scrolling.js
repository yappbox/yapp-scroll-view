import { find, waitUntil } from '@ember/test-helpers';
import { panY } from 'ember-simulant-test-helpers';

export function scrollPosition(element) {
  let { transform } = element.style;
  return new window.WebKitCSSMatrix(transform).m42;
}

export function waitForOpacity(selector, value) {
  return waitUntil(() => {
    let element = find(selector);
    return element && (element.style.opacity === value);
   });
}

export function scrollDown(selector, options = {}) {
  let defaultOpts = {
    position: [10, 50],
    amount: 200,
    duration: 400
  };
  options = Object.assign(defaultOpts, options);
  return panY(find(selector), options);
}
