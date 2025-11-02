import { find, settled, waitUntil } from '@ember/test-helpers';

export function scrollPosition(element) {
  if (!element) {
    return 0;
  }
  let scrollContainer =
    element.closest('.ScrollView-scroller') ||
    element.closest('[data-test-scroll-container]') ||
    (element.matches('.ScrollView')
      ? element.querySelector('.ScrollView-scroller')
      : element.closest('.ScrollView'));
  if (scrollContainer) {
    return -scrollContainer.scrollTop;
  }
  return 0;
}
export function waitForOpacity(selector, value, options = {}) {
  return waitUntil(
    () => {
      let element = find(selector);
      if (!element) {
        return false;
      }
      let opacity = element.style.opacity;
      if (!opacity) {
        opacity = window.getComputedStyle(element).opacity;
      }
      return opacity === value;
    },
    {
      timeout: options.timeout ?? 1000,
      timeoutMessage:
        options.timeoutMessage ?? `${selector} opacity should reach ${value}`,
    },
  );
}

function getScrollElement(element) {
  if (!element) {
    return null;
  }
  if (element.matches?.('.ScrollView-scroller')) {
    return element;
  }
  if (element.matches?.('.ScrollView')) {
    return (
      element.querySelector('.ScrollView-scroller') ||
      element.querySelector('[data-test-scroll-container]') ||
      element
    );
  }
  return (
    element.closest('.ScrollView-scroller') ||
    element.closest('[data-test-scroll-container]') ||
    (element.closest('.ScrollView')
      ? element.closest('.ScrollView').querySelector('.ScrollView-scroller') ||
        element.closest('.ScrollView')
      : null) ||
    element
  );
}

function waitForAnimationFrame() {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => resolve());
    } else {
      setTimeout(resolve, 16);
    }
  });
}

export async function scrollDown(selector, options = {}) {
  let element = typeof selector === 'string' ? find(selector) : selector;
  if (
    element instanceof HTMLElement &&
    element.matches('input, textarea, select')
  ) {
    return;
  }
  let scrollElement = getScrollElement(element);
  if (!scrollElement) {
    return;
  }

  let dragAmount = options.amount !== undefined ? options.amount * -1 : -200;
  let totalDelta = -dragAmount; // positive -> scroll down, negative -> scroll up
  if (totalDelta === 0) {
    return;
  }
  let steps = options.steps || 30;
  if (steps < 1) {
    steps = 1;
  }
  let stepSize = totalDelta / steps;

  for (let i = 0; i < steps; i++) {
    scrollElement.scrollTop += stepSize;
    scrollElement.dispatchEvent(new Event('scroll', { bubbles: true }));
    await waitForAnimationFrame();
  }
  if (totalDelta !== 0) {
    scrollElement.scrollTop += Math.sign(totalDelta);
    scrollElement.dispatchEvent(new Event('scroll', { bubbles: true }));
  }
  await settled();
}
