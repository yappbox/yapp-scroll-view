import { helper } from '@ember/component/helper';

export default helper(function compact([arr]) {
  if (Array.isArray(arr)) {
    return arr.filter(Boolean);
  }
  return [];
});
