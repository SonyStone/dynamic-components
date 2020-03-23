import { DefaultKeyValueChangeRecord } from './keyvalue-change-record';
import { KeyValueChangeRecord } from './keyvalue-change-record.interface';
import { KeyValueChangeRecors } from './keyvalue-change-recors';
import { KeyValueChanges } from './keyvalue-changes.interface';

export class DefaultKeyValuChanges<K, V> implements KeyValueChanges<K, V> {

  constructor(
    private changeRecors: KeyValueChangeRecors<K, V>,
  ) {}

  /**
   * all items in new state
   */
  forEachItem(fn: (r: KeyValueChangeRecord<K, V>) => void) {
    let record: DefaultKeyValueChangeRecord<K, V>|null;
    for (record = this.changeRecors.mapHead; record !== null; record = record._next) {
      fn(record);
    }
  }

  /**
   * all items in previous state
   */
  forEachPreviousItem(fn: (r: KeyValueChangeRecord<K, V>) => void) {
    let record: DefaultKeyValueChangeRecord<K, V>|null;
    for (record = this.changeRecors.previousMapHead; record !== null; record = record._nextPrevious) {
      fn(record);
    }
  }

  /**
   * all keyValue item added
   */
  forEachAddedItem(fn: (r: KeyValueChangeRecord<K, V>) => void) {
    let record: DefaultKeyValueChangeRecord<K, V>|null;
    for (record = this.changeRecors.additionsHead; record !== null; record = record._nextAdded) {
      fn(record);
    }
  }

  /**
   * all keyValue item removed
   */
  forEachRemovedItem(fn: (r: KeyValueChangeRecord<K, V>) => void) {
    let record: DefaultKeyValueChangeRecord<K, V>|null;
    for (record = this.changeRecors.removalsHead; record !== null; record = record._nextRemoved) {
      fn(record);
    }
  }

  /**
   * all values in keyValue item changed
   */
  forEachChangedItem(fn: (r: KeyValueChangeRecord<K, V>) => void) {
    let record: DefaultKeyValueChangeRecord<K, V>|null;
    for (record = this.changeRecors.changesHead; record !== null; record = record._nextChanged) {
      fn(record);
    }
  }
}
