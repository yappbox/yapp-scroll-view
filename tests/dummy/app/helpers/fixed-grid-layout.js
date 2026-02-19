import { helper } from '@ember/component/helper';

// Stub for tests — creates a fixed grid layout config object
export default helper(function fixedGridLayout([width, height]) {
  return { width, height, type: 'fixed-grid' };
});
