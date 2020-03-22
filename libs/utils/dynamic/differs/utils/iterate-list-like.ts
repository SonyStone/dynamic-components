import { getSymbolIterator } from './symbol';

export function iterateListLike(obj: any, fn: (p: any) => any) {
  if (Array.isArray(obj)) {

    for (const iterator of obj) {
      fn(iterator);
    }

  } else {
    const iterator = obj[getSymbolIterator()]();
    let item: any;
    while (!((item = iterator.next()).done)) {
      fn(item.value);
    }
  }
}
