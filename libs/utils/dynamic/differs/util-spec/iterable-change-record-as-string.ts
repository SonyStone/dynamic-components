import { stringify } from '@angular/compiler/src/util';

import { IterableChangeRecord } from '../iterable-differ/iterable-change-record.interface';

export function iterableChangeRecordAsString<V>(icr: IterableChangeRecord<V>): string {
  return (icr.previousIndex === icr.currentIndex)
    ? stringify(icr.item)
    : `${stringify(icr.item)}[${stringify(icr.previousIndex)}->${stringify(icr.currentIndex)}]`;
}
