import { helper } from '@ember/component/helper';

export default helper(function append(params) {
  let result = [];
  for (let param of params) {
    if (Array.isArray(param)) {
      result.push(...param);
    } else {
      result.push(param);
    }
  }
  return result;
});
