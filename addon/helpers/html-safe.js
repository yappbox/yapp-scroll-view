import { htmlSafe } from '@ember/string';

export default function htmlSafeHelper([path]) {
  return new htmlSafe(path);
}
