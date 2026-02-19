import { helper } from '@ember/component/helper';

export default helper(function or(params) {
  for (let i = 0; i < params.length; i++) {
    if (params[i]) return params[i];
  }
  return params[params.length - 1];
});
