import { getSymbolIterator } from './symbol';

export function iterateListLike(obj: any, fn: (p: any) => any) {
  for (const iterator of obj) {
    fn(iterator);
  }
  // if (Array.isArray(obj)) {


  // } else {
  //   const iterator = obj[getSymbolIterator()]();
  //   let item: any;
  //   while (!((item = iterator.next()).done)) {
  //     fn(item.value);
  //   }
  // }
}
