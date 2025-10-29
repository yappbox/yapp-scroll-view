import { buildWaiter } from '@ember/test-waiters';

const waiter = buildWaiter('yapp-scroll-view:resize-observer');

export function invokeResizeCallback(callback) {
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

export function resizeObserverWaiterForTesting() {
  return waiter;
}
