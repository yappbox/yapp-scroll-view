import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export default helper(function htmlSafeHelper([path]) {
  return htmlSafe(path);
});
