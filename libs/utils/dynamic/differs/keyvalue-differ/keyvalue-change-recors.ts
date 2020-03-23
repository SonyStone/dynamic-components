import { looseIdentical } from '../utils';
import { DefaultKeyValueChangeRecord } from './keyvalue-change-record';
import { KeyValue } from './keyvalue.interface';

export class KeyValueChangeRecors<K, V> {
  records = new Map<K, DefaultKeyValueChangeRecord<K, V>>();
  mapHead: DefaultKeyValueChangeRecord<K, V>|null = null;

  // _appendAfter is used in the check loop
  appendAfter: DefaultKeyValueChangeRecord<K, V>|null = null;
  previousMapHead: DefaultKeyValueChangeRecord<K, V>|null = null;
  changesHead: DefaultKeyValueChangeRecord<K, V>|null = null;
  changesTail: DefaultKeyValueChangeRecord<K, V>|null = null;
  additionsHead: DefaultKeyValueChangeRecord<K, V>|null = null;
  additionsTail: DefaultKeyValueChangeRecord<K, V>|null = null;
  removalsHead: DefaultKeyValueChangeRecord<K, V>|null = null;
  removalsTail: DefaultKeyValueChangeRecord<K, V>|null = null;

  get isDirty(): boolean {
    return this.additionsHead !== null || this.changesHead !== null ||
        this.removalsHead !== null;
  }

  /**
   * Inserts a record before `before` or append at the end of the list when `before` is null.
   *
   * Notes:
   * - This method appends at `this._appendAfter`,
   * - This method updates `this._appendAfter`,
   * - The return value is the new value for the insertion pointer.
   */
  insertBeforeOrAppend(
    before: DefaultKeyValueChangeRecord<K, V>|null,
    record: DefaultKeyValueChangeRecord<K, V>,
  ): DefaultKeyValueChangeRecord<K, V>|null {
    if (before) {
      const prev = before._prev;
      record._next = before;
      record._prev = prev;
      before._prev = record;
      if (prev) {
        prev._next = record;
      }
      if (before === this.mapHead) {
        this.mapHead = record;
      }

      this.appendAfter = before;
      return before;
    }

    if (this.appendAfter) {
      this.appendAfter._next = record;
      record._prev = this.appendAfter;
    } else {
      this.mapHead = record;
    }

    this.appendAfter = record;
    return null;
  }

  getOrCreateRecordForKey(key: K, value: V): DefaultKeyValueChangeRecord<K, V> {
    if (this.records.has(key)) {
      const record = this.records.get(key);

      this.maybeAddToChanges(record, value);
      const prev = record._prev;
      const next = record._next;
      if (prev) {
        prev._next = next;
      }
      if (next) {
        next._prev = prev;
      }
      record._next = null;
      record._prev = null;

      return record;
    } else {
      const record = new DefaultKeyValueChangeRecord<K, V>(key);

      this.records.set(key, record);
      record.currentValue = value;
      this.addToAdditions(record);

      return record;
    }
  }

  reset() {
    if (this.isDirty) {
      let record: DefaultKeyValueChangeRecord<K, V>|null;
      // let `_previousMapHead` contain the state of the map before the changes
      this.previousMapHead = this.mapHead;

      for (record = this.previousMapHead; record !== null; record = record._next) {
        record._nextPrevious = record._next;
      }

      // Update `record.previousValue` with the value of the item before the changes
      // We need to update all changed items (that's those which have been added and changed)
      for (record = this.changesHead; record !== null; record = record._nextChanged) {
        record.previousValue = record.currentValue;
      }

      for (record = this.additionsHead; record != null; record = record._nextAdded) {
        record.previousValue = record.currentValue;
      }

      this.changesHead = this.changesTail = null;
      this.additionsHead = this.additionsTail = null;
      this.removalsHead = null;
    }
  }

  // Add the record or a given key to the list of changes only when the value has actually changed
  maybeAddToChanges(record: DefaultKeyValueChangeRecord<K, V>, newValue: any): void {
    if (!looseIdentical(newValue, record.currentValue)) {
      record.previousValue = record.currentValue;
      record.currentValue = newValue;
      this.addToChanges(record);
    }
  }

  private addToAdditions(record: DefaultKeyValueChangeRecord<K, V>) {
    if (this.additionsHead === null) {
      this.additionsHead = this.additionsTail = record;
    } else {
      this.additionsTail._nextAdded = record;
      this.additionsTail = record;
    }
  }

  private addToChanges(record: DefaultKeyValueChangeRecord<K, V>) {
    if (this.changesHead === null) {
      this.changesHead = this.changesTail = record;
    } else {
      this.changesTail._nextChanged = record;
      this.changesTail = record;
    }
  }

  forEach(obj: KeyValue<K, V>, fn: (v: V, k: any) => void) {
    if (obj instanceof Map) {
      obj.forEach(fn);
    } else {
      Object.keys(obj).forEach(k => fn(obj[k], k));
    }
  }
}
