import { isJsObject } from './is-js-object';
import { getSymbolIterator } from './symbol';

export function isListLikeIterable(obj: any): boolean {
  if (!isJsObject(obj)) return false;

  return Array.isArray(obj) ||
      (!(obj instanceof Map) &&      // JS Map are iterables but return entries as [k, v]
       getSymbolIterator() in obj);  // JS Iterable have a Symbol.iterator prop
}