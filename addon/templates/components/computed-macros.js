import { computed, get } from '@ember/object';

export function notEqual(dependentKey, value) {
  return computed(dependentKey, function() {
    return get(this, dependentKey) !== value;
  });
}
