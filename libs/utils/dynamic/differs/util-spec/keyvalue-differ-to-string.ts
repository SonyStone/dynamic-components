import { KeyValueChanges } from '../keyvalue-differ/key-value-changes.interface';
import { keyvalueChangeRecordAsString } from './keyvalue-change-record-as-string';
import { keyvalueChangesAsString } from './keyvalue-changes-as-string';


export function keyvalueDifferToString(keyValueChanges: KeyValueChanges<string, any>) {

  const map: string[] = [];
  keyValueChanges.forEachItem(r => map.push(keyvalueChangeRecordAsString(r)));

  const previous: string[] = [];
  keyValueChanges.forEachPreviousItem(r => previous.push(keyvalueChangeRecordAsString(r)));

  const changes: string[] = [];
  keyValueChanges.forEachChangedItem(r => changes.push(keyvalueChangeRecordAsString(r)));

  const additions: string[] = [];
  keyValueChanges.forEachAddedItem(r => additions.push(keyvalueChangeRecordAsString(r)));

  const removals: string[] = [];
  keyValueChanges.forEachRemovedItem(r => removals.push(keyvalueChangeRecordAsString(r)));

  return keyvalueChangesAsString({
    map,
    previous,
    additions,
    changes,
    removals,
  });
}
