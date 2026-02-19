import { buildWaiter } from '@ember/test-waiters';

const waiter = buildWaiter('yapp-scroll-view:resize-observer');
function invokeResizeCallback(callback) {
  let token;
  if (waiter && typeof waiter.beginAsync === 'function') {
    token = waiter.beginAsync();
  }
  try {
    return callback();
  } finally {
    if (token) {
      waiter.endAsync(token);
    }
  }
}
function resizeObserverWaiterForTesting() {
  return waiter;
}

export { invokeResizeCallback, resizeObserverWaiterForTesting };
//# sourceMappingURL=resize-observer-waiter.js.map
