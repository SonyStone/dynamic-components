import { stringify } from '@angular/compiler/src/util';

import { KeyValueChangeRecord } from '../keyvalue-differ/keyvalue-change-record.interface';
import { looseIdentical } from '../utils/loose-identical';

export function keyvalueChangeRecordAsString(kvcr: KeyValueChangeRecord<string, any>) {
  return looseIdentical(kvcr.previousValue, kvcr.currentValue)
    ? stringify(kvcr.key)
    : (`[${stringify(kvcr.key)}]:${stringify(kvcr.previousValue)}->${stringify(kvcr.currentValue)}`);
}
