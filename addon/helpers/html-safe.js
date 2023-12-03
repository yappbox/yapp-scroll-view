import { htmlSafe } from '@ember/template';

export default function htmlSafeHelper([path]) {
  return new htmlSafe(path);
}
