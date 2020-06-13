import { DefaultKeyValueChangeRecord } from './keyvalue-change-record';
import { DefaultKeyValueDiffer } from './keyvalue-differ';
import { KeyValue } from './keyvalue.interface';

export class KeyValueDifferWithBounds<K, V> extends DefaultKeyValueDiffer<K, V> {

  bounds = new Set();

  /**
   * Check the current state of the map vs the previous.
   * The algorithm is optimised for when the keys do no change.
   */
  check(map: KeyValue<K, V>): boolean {
    this.changeRecors.reset();

    let insertBefore = this.changeRecors.mapHead;
    this.changeRecors.appendAfter = null;

    this.changeRecors.forEach(map, (value, key) => {
      if (this.bounds.has(key)) {
  
        if (insertBefore && insertBefore.key === key) {
          this.changeRecors.maybeAddToChanges(insertBefore, value);
          this.changeRecors.appendAfter = insertBefore;
          insertBefore = insertBefore._next;
        } else {
          const record = this.changeRecors.getOrCreateRecordForKey(key, value);
          insertBefore = this.changeRecors.insertBeforeOrAppend(insertBefore, record);
        }
      }
    });

    // Items remaining at the end of the list have been deleted
    if (insertBefore) {
      if (insertBefore._prev) {
        insertBefore._prev._next = null;
      }

      this.changeRecors.removalsHead = insertBefore;

      for (let record: DefaultKeyValueChangeRecord<K, V>|null = insertBefore; record !== null;
           record = record._nextRemoved) {
        if (record === this.changeRecors.mapHead) {
          this.changeRecors.mapHead = null;
        }
        this.changeRecors.records.delete(record.key);
        record._nextRemoved = record._next;
        record.previousValue = record.currentValue;
        record.currentValue = null;
        record._prev = null;
        record._next = null;
      }
    }

    // Make sure tails have no next records from previous runs
    if (this.changeRecors.changesTail) this.changeRecors.changesTail._nextChanged = null;
    if (this.changeRecors.additionsTail) this.changeRecors.additionsTail._nextAdded = null;

    return this.changeRecors.isDirty;
  }

  reset(): void {
    this.changeRecors.reset();
    this.bounds.clear();
  }
}
